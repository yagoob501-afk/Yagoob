import {
  PDFDocument,
  PDFName,
  PDFDict,
  PDFArray,
  PDFStream,
  PDFString,
  PDFObject,
  decodePDFRawStream,
  PDFRawStream
} from 'pdf-lib';
import type { Lesson, AttendanceMap } from './types';
import type { AttendanceExportData } from './jsonExport';

export interface ImportResult {
  lessons: Lesson[];
  attendance: AttendanceMap;
}

/**
 * Recursively parses a PDF Name Tree (like EmbeddedFiles) to collect all name/value pairs.
 */
function parseNameTree(node: PDFObject | undefined): [string, PDFObject][] {
  const results: [string, PDFObject][] = [];
  if (!node || !(node instanceof PDFDict)) return results;

  // Check for 'Names' leaf node
  if (node.has(PDFName.of('Names'))) {
    const names = node.lookup(PDFName.of('Names'), PDFArray);
    for (let i = 0; i < names.size(); i += 2) {
      const keyObj = names.get(i);
      const key = keyObj instanceof PDFString ? keyObj.decodeText() : keyObj.toString();
      const value = names.lookup(i + 1);
      results.push([key, value] as any);
    }
  }

  // Check for 'Kids' intermediate node
  if (node.has(PDFName.of('Kids'))) {
    const kids = node.lookup(PDFName.of('Kids'), PDFArray);
    for (let i = 0; i < kids.size(); i++) {
      results.push(...parseNameTree(kids.lookup(i)));
    }
  }

  return results;
}

/**
 * Extracts attendance data from the official PDF Attachment protocol.
 */
export async function extractAttendanceFromPdf(file: File): Promise<ImportResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const allLessons: Lesson[] = [];
  const combinedAttendance: AttendanceMap = {};

  // 1. Navigate to the Names/EmbeddedFiles dictionary
  const catalog = pdfDoc.catalog;
  if (!catalog.has(PDFName.of('Names'))) {
    throw new Error("لا توجد ملفات مرفقة في هذا الملف.");
  }

  const namesDict = catalog.lookup(PDFName.of('Names'), PDFDict);
  if (!namesDict.has(PDFName.of('EmbeddedFiles'))) {
    throw new Error("لا توجد ملفات مرفقة (EmbeddedFiles).");
  }

  const embeddedFiles = namesDict.lookup(PDFName.of('EmbeddedFiles'), PDFDict);

  // 2. Recursively collect all attachments from the Name Tree
  const attachments = parseNameTree(embeddedFiles);

  // 3. Process each attachment
  for (const [fileName, fileSpec] of attachments) {
    if (!(fileSpec instanceof PDFDict)) continue;

    try {
      if (!fileSpec.has(PDFName.of('EF'))) continue;
      const ef = fileSpec.lookup(PDFName.of('EF'), PDFDict);

      if (!ef.has(PDFName.of('F'))) continue;
      const stream = ef.lookup(PDFName.of('F'), PDFStream) as PDFRawStream;

      // CRITICAL: PDF streams are usually compressed (FlateDecode).
      // We MUST decode them to get the actual bytes.
      const bytes = decodePDFRawStream(stream).decode();

      // Decode bytes to string
      const decoder = new TextDecoder('utf-8');
      const jsonString = decoder.decode(bytes);
      const data = JSON.parse(jsonString) as AttendanceExportData;

      // Validate signature
      if (data.type === 'attendance_report' && data.lesson) {
        const lesson: Lesson = {
          ...data.lesson,
          students: data.students,
          status: 'completed'
        };

        allLessons.push(lesson);
        combinedAttendance[lesson.id] = data.attendance;
      }
    } catch (err) {
      console.warn("Skipping non-compatible attachment:", fileName, err);
    }
  }

  if (allLessons.length === 0) {
    throw new Error("لم يتم العثور على بيانات حضور صالحة داخل الملف.");
  }

  // Sort lessons by lessonNumber
  allLessons.sort((a, b) => parseInt(a.lessonNumber) - parseInt(b.lessonNumber));

  return {
    lessons: allLessons,
    attendance: combinedAttendance
  };
}

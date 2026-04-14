import ReactDOM from "react-dom/client";
import { MarkingExportView } from "@/pages/additional-tools/components/attendance/Marking/MarkingExportView";
import type { Lesson, Student, AttendanceStatus } from "./types";

interface ExportProps {
  lesson: Lesson
  students: Student[]
  attendance: Record<string, AttendanceStatus>
  stats: {
    total: number
    present: number
    absent: number
    participating: number
  }
}

/**
 * Renders MarkingExportView off-screen,
 * captures its image, then cleans up and returns it.
 */
export async function createAttendanceImage(
  props: ExportProps
): Promise<string> {
  return new Promise((resolve) => {
    // Create container element
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);

    // Create React root
    const root = ReactDOM.createRoot(container);

    // onImageReady callback
    const handleImageReady = (image: string) => {
      // Small delay to ensure unmount is clean
      setTimeout(() => {
        root.unmount();
        container.remove();
      }, 100);
      resolve(image);
    };

    // Render component
    root.render(
      <MarkingExportView
        {...props}
        onImageReady={handleImageReady}
      />
    );
  });
}

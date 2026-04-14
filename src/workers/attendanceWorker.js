import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";

self.addEventListener("message", async (event) => {
    const { images, metadata } = event.data;

    // Phase 1: Create visual PDF using jsPDF
    const pdf = new jsPDF({
        orientation: "p",
        unit: "pt",
    });

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        try {
            const imgProps = pdf.getImageProperties(img);
            
            // Add a page that exactly matches the image dimensions
            pdf.addPage([imgProps.width, imgProps.height], imgProps.width > imgProps.height ? "l" : "p");
            pdf.addImage(img, "PNG", 0, 0, imgProps.width, imgProps.height);

            // Send progress update (0-80% for visual generation)
            const progress = ((i + 1) / images.length) * 80;
            self.postMessage({ type: "progress", progress });
        } catch (err) {
            console.error("Worker: Failed to process image", i, err);
        }
    }

    // Delete the initial blank page
    if (pdf.internal.pages.length > 1) {
        pdf.deletePage(1);
    }

    // Phase 2: Use pdf-lib to add official attachments
    try {
        const jspdfBytes = pdf.output("arraybuffer");
        const pdfDoc = await PDFDocument.load(jspdfBytes);

        if (metadata && metadata.length > 0) {
            for (let i = 0; i < metadata.length; i++) {
                // Decode Base64 back to raw bytes for the attachment
                // We use Base64 to transport data safely to worker, but attach as raw bytes
                const binaryStr = atob(metadata[i]);
                const bytes = new Uint8Array(binaryStr.length);
                for (let j = 0; j < binaryStr.length; j++) {
                    bytes[j] = binaryStr.charCodeAt(j);
                }

                // Attach the file
                // If it's the first one, let's call it current_lesson_data.json
                // Better: name by index/lesson info if we had it, but for now lesson_1_data.json
                const filename = `lesson_${(i + 1).toString().padStart(2, '0')}_data.json`;
                await pdfDoc.attach(bytes, filename, {
                    mimeType: 'application/json',
                    description: `Dataless attendance report for lesson ${i + 1}`,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                });
            }
        }

        const finalBytes = await pdfDoc.save();
        const pdfBlob = new Blob([finalBytes], { type: "application/pdf" });

        // Update progress to 100%
        self.postMessage({ type: "progress", progress: 100 });

        // Return the final file
        self.postMessage({ type: "done", blob: pdfBlob });

    } catch (err) {
        console.error("Worker: pdf-lib assembly failed", err);
        // Fallback to jsPDF if pdf-lib fails (at least we have the visual)
        const pdfBlob = pdf.output("blob");
        self.postMessage({ type: "done", blob: pdfBlob });
    }
});

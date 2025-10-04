import jsPDF from "jspdf";

self.addEventListener("message", async (event) => {
    const { images } = event.data;

    const pdf = new jsPDF("landscape", "pt", "a4");

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgProps = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);

        // إرسال تقدم التحميل
        const progress = ((i + 1) / images.length) * 100;
        self.postMessage({ type: "progress", progress });
    }

    const pdfBlob = pdf.output("blob");

    // إرسال الملف النهائي
    self.postMessage({ type: "done", blob: pdfBlob });
});

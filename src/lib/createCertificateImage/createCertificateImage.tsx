import PrimaryCertificateViewer, { type CertificateProps } from "@/components/ui/CertificateViewer/PrimaryCertificateViewer";
import ReactDOM from "react-dom/client";

/**
 * Renders PrimaryCertificateViewer off-screen,
 * captures its image, then cleans up and returns it.
 */
export async function createCertificateToImage(
  props: CertificateProps
): Promise<string> {
  return new Promise((resolve, _reject) => {
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
        root.unmount();
        container.remove();
        resolve(image);
    };

    // Render component with displayImage=false so it doesn't show
    root.render(
      <PrimaryCertificateViewer
        {...props}
        displayImage={false}
        onImageReady={handleImageReady}
      />
    );
  });
}

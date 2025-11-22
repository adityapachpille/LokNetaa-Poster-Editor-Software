import html2canvas from "html2canvas";

export async function downloadElementPng(elementId, filename = "comparison.png") {
  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Element #${elementId} not found`);
  const canvas = await html2canvas(node, {
    useCORS: true,
    backgroundColor: null,
    scale: 2,
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function shareUrl(title, text, url) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
      return true;
    } catch {
      alert("Sharing not supported on this browser");
      return false;
    }
  }
}

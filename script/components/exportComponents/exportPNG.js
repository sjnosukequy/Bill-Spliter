// import {html2canvas} from "../../libs/html2canvas/html2canvas.js";

const EXPORT_PNG = document.getElementById("export-png");


export function setupExportPNG() {
    EXPORT_PNG.addEventListener("click", () => {
        html2canvas(document.getElementById("result-img")).then(canvas => {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank");
                URL.revokeObjectURL(url);
            }, "image/png")
        })
    })
}


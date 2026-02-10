// import {html2canvas} from "../../libs/html2canvas/html2canvas.js";
import { debounce } from "../../utils/debounce.js";
const EXPORT_PNG = document.getElementById("export-png");

async function handleExportPNG() {
    console.log('export png');
    let imgContainer = document.getElementById('image-container')
    let resultImg = document.getElementById("result-img");
    try {
        let canvas = await html2canvas(resultImg);
        let img = document.createElement('img');
        img.classList.add('w-full', 'border', 'rounded-lg');
        if (canvas) {
            imgContainer.innerHTML = '';
            img.src = canvas.toDataURL("image/png");
            imgContainer.appendChild(img);

            // canvas.toBlob((blob) => {
            //     const url = URL.createObjectURL(blob);
            //     window.open(url, "_blank");
            //     URL.revokeObjectURL(url);
            // }, "image/png")
        }
    }
    catch (e) {
        imgContainer.innerHTML = e;
    }
}

const debounceFunc = debounce(handleExportPNG, 1000)

export function setupExportPNG() {
    EXPORT_PNG.addEventListener("click", debounceFunc);
}


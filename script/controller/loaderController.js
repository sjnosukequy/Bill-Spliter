const LOADER_CONTAINER = document.getElementById("loader");

export function removeLoader() {
    LOADER_CONTAINER.style.display = "none";
    LOADER_CONTAINER.innerHTML = "";
}
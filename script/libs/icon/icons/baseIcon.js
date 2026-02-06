export class baseIcon {
    static htmlContent = ``

    static getHtmlContent(width = 20) {
        let stringArray = this.htmlContent.split("<svg");
        let inject = `<svg width="${width}px" fill="currentColor"`;
        return inject + stringArray.join("");
    }

    static getHtmlElement(width = 20) {
        let element = document.createRange().createContextualFragment(this.htmlContent);
        const svg = element.querySelector("svg");
        if (svg) {
            svg.style.width = `${width}px`;
            svg.setAttribute("fill", "currentColor");
        }
        return element;
    }
}
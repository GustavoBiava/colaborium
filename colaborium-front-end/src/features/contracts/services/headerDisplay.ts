export function headerDisplay(root: ParentNode): void {
    const sections = Array.from(
        root.querySelectorAll<HTMLElement>("section.docx"),
    );

    const headerTemplate = sections
        .map((section) => section.querySelector(":scope > header"))
        .find((header): header is Element => Boolean(header));
        
    for (const section of sections) {
        if (headerTemplate && !section.querySelector(":scope > header")) {
            section.insertBefore(headerTemplate.cloneNode(true), section.firstChild);
        }
    }
    
    root.querySelectorAll("header svg").forEach((svg) => {
        const foreignObject = svg.querySelector("foreignObject");

        if (foreignObject) {
            const div = document.createElement("div");

            div.innerHTML = foreignObject.innerHTML;
            div.style.position = "relative";
            div.style.width = "100%";
            div.style.textAlign = "center";

            svg.replaceWith(div);
            return;
        }
    });
}
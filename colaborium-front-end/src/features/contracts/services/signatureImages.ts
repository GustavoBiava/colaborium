import JSZip from "jszip";

async function readDocumentXml(arrayBuffer: ArrayBuffer): Promise<string> {
    const zip = await JSZip.loadAsync(arrayBuffer);
    return zip.file("word/document.xml")!.async("string");
}

const PX_PER_PT = 96 / 72;
const px = (v: number) => v * PX_PER_PT;
const num_conversion = (v: string | undefined) => Number.parseFloat(v ?? "0") || 0;

function styleOf(el: Element): Record<string, string> {
    return Object.fromEntries(
        (el.getAttribute("style") ?? "")
            .split(";")
            .filter(Boolean)
            .map((part) => {
                const i = part.indexOf(":");
                return [part.slice(0, i).trim(), part.slice(i + 1).trim()];
            }),
    );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";

    for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = next;
        }
    }

    if (line) lines.push(line);
    return lines;
}

export async function buildSignatureImages(arrayBuffer: ArrayBuffer) {
    const xml = await readDocumentXml(arrayBuffer);
    const xmlDoc = new DOMParser().parseFromString(xml, "application/xml");
    const groups = Array.from(xmlDoc.getElementsByTagName("v:group"));

    return groups.map((group) => {
        const style = styleOf(group);
        const width = px(num_conversion(style.width));
        const height = px(num_conversion(style.height));

        const [coordX, coordY] = (group.getAttribute("coordsize") ?? "1,1")
            .split(",")
            .map(Number);

        const scaleX = width / coordX;
        const scaleY = height / coordY;

        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(width);
        canvas.height = Math.ceil(height);

        const ctx = canvas.getContext("2d")!;
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
        ctx.lineWidth = 1;

        for (const child of Array.from(group.children)) {
            const cs = styleOf(child);
            const x = num_conversion(cs.left) * scaleX;
            const y = num_conversion(cs.top) * scaleY;
            const w = num_conversion(cs.width) * scaleX;
            const h = num_conversion(cs.height) * scaleY;

            if (child.localName === "shape") {
                const path = child.getAttribute("path") ?? "";
                if (path.startsWith("m,l")) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + w, y);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(x, y, w, h);
                }
            }

            const textbox = Array.from(child.getElementsByTagName("w:txbxContent"))[0];
            if (textbox) {
                let textY = y + 2;

                for (const p of Array.from(textbox.getElementsByTagName("w:p"))) {
                    const text = Array.from(p.getElementsByTagName("w:t"))
                        .map((t) => t.textContent ?? "")
                        .join("");

                    const bold = p.getElementsByTagName("w:b").length > 0;
                    ctx.font = `${bold ? "bold " : ""}16px "Arial", serif`;

                    for (const line of wrapText(ctx, text, w - 4)) {
                        ctx.fillText(line, x + 2, textY + 14);
                        textY += 16;
                    }
                }
            }
        }

        return {
            dataUrl: canvas.toDataURL("image/png"),
            left: px(num_conversion(style["margin-left"])),
            top: px(num_conversion(style["margin-top"])),
            width,
            height,
        };
    });
}
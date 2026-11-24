import axios from "axios";
import html2pdf from "html2pdf.js";
import * as docx from "docx-preview";
import { buildSignatureImages } from "./signatureImages";
import { headerDisplay } from "./headerDisplay";

import { api } from "@/lib/api";

export async function generateContract(contractId: number): Promise<void> {
    const { data } = await api.get<Blob>(
        `/contratos/${contractId}/docx`,
        { responseType: "blob" },
    );

    const arrayBuffer = await data.arrayBuffer();

    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.left = "0";
    host.style.top = "0";
    host.style.width = "210mm";
    host.style.zIndex = "-1";

    document.body.appendChild(host);

    try {
        await docx.renderAsync(arrayBuffer, host, undefined, {
            useBase64URL: true,
        });

        await document.fonts.ready;

        const sections = Array.from(
            host.querySelectorAll<HTMLElement>("section.docx"),
        );

        headerDisplay(host);

        const signatureSection = sections[4]

        if (signatureSection) {
            const images = await buildSignatureImages(arrayBuffer);

            const verticalAdjustments = [200, 200, 550, 550];

            for (let i = 0; i < images.length; i++) {
                const image = images[i];

                const img = document.createElement("img");
                img.src = image.dataUrl;
                img.style.position = "absolute";
                img.style.left = `${image.left}px`;

                img.style.top = `${
                    image.top +
                    verticalAdjustments[i]
                }px`;

                img.style.width = `${image.width}px`;
                img.style.height = `${image.height}px`;
                img.style.pointerEvents = "none";

                signatureSection.appendChild(img);

                await new Promise<void>((resolve) => {
                    if (img.complete) resolve();
                    else img.onload = () => resolve();
                });
            }
        }

        await html2pdf()
            .set({
                margin: 0,
                filename: `contrato-${contractId}.pdf`,
                image: {
                    type: "png",
                },
                html2canvas: {
                    scale: 1,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    onclone: (clonedDoc: Document) => {
                        const style = clonedDoc.createElement("style");

                        style.textContent = `
                            .docx-wrapper {
                                padding: 0 !important;
                                margin: 0 !important;
                                background: #ffffff !important;
                                display: block !important;
                                width: 100% !important;
                            }

                            section.docx {
                                line-height: 1 !important;
                                word-break: normal !important;
                                break-inside: avoid !important;
                                overflow-wrap: normal !important;
                                overflow: visible !important;
                                hyphens: none !important;
                                width: 793px !important;
                                height: 1122px !important;
                                min-height: 1122px !important;
                                max-height: 1122px !important;
                                margin: 0 !important;
                            }

                            .html2pdf__container,
                            .html2pdf__container * {
                                color: #000 !important;
                                background-color: transparent !important;
                                border-color: #000 !important;
                                outline-color: #000 !important;
                                text-decoration-color: #000 !important;
                                -webkit-text-fill-color: #000 !important;
                                box-shadow: none !important;
                                text-shadow: none !important;
                                background-image: none !important;
                            }

                            .html2pdf__container {
                                background-color: #fff !important;
                            }
                        `;

                        clonedDoc.head.appendChild(style);

                        const source = clonedDoc.querySelector(".html2pdf__container > *") as HTMLElement | null;

                        if (source) {
                            source.style.setProperty("position", "static", "important");
                            source.style.setProperty("left", "auto", "important");
                            source.style.setProperty("top", "auto", "important");
                            source.style.setProperty("z-index", "auto", "important");
                            source.style.setProperty("margin", "0", "important");
                            source.style.setProperty("width", "100%", "important");
                            source.style.setProperty("background-color", "#ffffff", "important");
                        }
                        clonedDoc.body.style.setProperty("background-color", "#ffffff", "important");
                    },
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                }
            })
            .from(host)
            .save();
    } finally {
        host.remove();
        document
            .querySelectorAll(".html2pdf__overlay")
            .forEach((element) => element.remove());
    }
}

export async function getPdfErrorMessage(error: unknown): Promise<string> {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        try {
            const body = JSON.parse(await error.response.data.text());
            if (body.message) return body.message;
        } catch {
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Não foi possível gerar o PDF do contrato.";
}
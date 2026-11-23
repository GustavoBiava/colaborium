import { PDFDocument } from "pdf-lib";
import type { ContractResponse } from "../types/ContractResponse";

export async function generateContract(contract: ContractResponse) {
    const response = await fetch("/contract-template.pdf")
    const templateBytes = await response.arrayBuffer()

    const pdfDoc = await PDFDocument.load(templateBytes)

    const form = pdfDoc.getForm()

    const clienteId = String(contract.cliente_id)
    const salaId = contract.salas.map((sala) => sala.nome).join(", ")
    const dataInicio = String(contract.data_inicio)
    const dataFim = String(contract.data_fim)

    form.getTextField("NOME_EMPRESA").setText(clienteId);
    form.getTextField("CPF_CNPJ_EMPRESA").setText(salaId);
    form.getTextField("NOME_REPRESENTANTE").setText(dataInicio);
    form.getTextField("CPF_REPRESENTANTE").setText(dataFim);

    form.flatten()

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url;
    link.download = `contrato-${contract.id}.pdf`
    link.click()

    URL.revokeObjectURL(url);
}
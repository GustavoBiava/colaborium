import { readFile } from "node:fs/promises";
import { join } from "node:path";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import extenso from "extenso";

import customerRepository from "../customers/customers.repository";
import { buscarContrato } from "./contracts.service";

const TEMPLATE_PATH = join(process.cwd(), "templates", "template.docx");

function formatDate(value: Date | string | null | undefined): string {
    if (!value) return "";

    const date = value instanceof Date
        ? value
        : new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? ""
        : date.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
}

export async function generateContractDocx(contractId: number): Promise<Uint8Array> {

    const contract = await buscarContrato(contractId);

    const [customer] = await customerRepository.getCustomer(contract.cliente_id);

    const rooms = (contract.salas ?? []) as Array<{
        id: number;
        nome: string;
        valor: number | null;
        qtd_arcondicionado: number;
        qtd_cadeira: number;
        qtd_mesa: number;
    }>;

    const location_company = `${customer?.cidade_empresa}/${customer?.estado_empresa}`;
    const location_representant = `${customer?.cidade_representante}/${customer?.estado_representante}`;

    const discounted_value = (contract.valor_base * 0.9).toFixed(2);
    const multiple_rooms = rooms.length > 1

    const roomsNames = rooms
        .map((room) => room.nome)
        .join(", ");

    const roomsDetails = rooms
        .map((room, index) => {
            const arcondicionados = room.qtd_arcondicionado ?? 0;
            const cadeiras = room.qtd_cadeira ?? 0;
            const mesas = room.qtd_mesa ?? 0;

            return `${room.nome}: ${arcondicionados} (${extenso(arcondicionados)}) ar-condicionado${arcondicionados !== 1 ? "s" : ""}, ${cadeiras} (${extenso(cadeiras)}) cadeira${cadeiras !== 1 ? "s" : ""}, ${mesas} (${extenso(mesas)}) mesa${mesas !== 1 ? "s" : ""}`;
        })
        .join("\n");

    const data: Record<string, string | number> = {
        NOME_EMPRESA: customer?.nome_empresa ?? "",
        CPF_CNPJ_EMPRESA: customer?.cpf_cnpj_empresa ?? "",
        ENDERECO_EMPRESA: customer?.endereco_empresa ?? "",
        NUMERO_EMPRESA: customer?.numero_empresa ?? "",
        COMPLEMENTO_EMPRESA: customer?.complemento_empresa ?? "",
        BAIRRO_EMPRESA: customer?.bairro_empresa ?? "",
        CIDADE_ESTADO_EMPRESA: location_company ?? "",
        CEP_EMPRESA: customer?.cep_empresa ?? "",
        EMAIL_EMPRESA: customer?.email ?? "",
        TELEFONE_EMPRESA: customer?.telefone ?? "",

        NOME_REPRESENTANTE: customer?.nome_representante ?? "",
        NACIONALIDADE_REPRESENTANTE: customer?.nacionalidade_representante ?? "",
        CPF_REPRESENTANTE: customer?.cpf_representante ?? "",
        ENDERECO_REPRESENTANTE: customer?.endereco_representante ?? "",
        NUMERO_REPRESENTANTE: customer?.numero_representante ?? "",
        BAIRRO_REPRESENTANTE: customer?.bairro_representante ?? "",
        CIDADE_ESTADO_REPRESENTANTE: location_representant ?? "",
        CEP_REPRESENTANTE: customer?.cep_representante ?? "",

        DATA_INICIO: formatDate(contract.data_inicio) ?? "",
        DATA_FIM: formatDate(contract.data_fim) ?? "",
        PERIODO: contract?.periodo ?? "",

        VALOR_BASE: contract.valor_base ?? "",
        VALOR_DESCONTADO: discounted_value ?? "",
        VALOR_DESCONTADO_EXTENSO: extenso(discounted_value) ?? "",
        VALOR_EXTENSO: extenso(contract.valor_base) ?? "",
        SALAS: roomsNames ?? "",
        DESCRICAO_SALAS: roomsDetails ?? "",
        PLURAL: multiple_rooms ? "s" : ""
    };

    const template = await readFile(TEMPLATE_PATH);
    const zip = new PizZip(template);

    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: "{{", end: "}}" }, nullGetter: () => "" }); doc.render(data);

    const docxBytes = doc.getZip().generate({
        type: "uint8array",
        compression: "DEFLATE",
    });

    return docxBytes
}
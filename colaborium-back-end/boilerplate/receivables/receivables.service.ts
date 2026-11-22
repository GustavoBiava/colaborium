import receivableRepository from "./receivables.repository";
import { ReceivableError } from "./receivables.errors";
import type {
  PaginatedReceivables,
  ReceivableRow,
  ReceivableSummary,
} from "./receivables.types";
import type {
  CreateReceivableDTO,
  ListReceivablesQuery,
  SettleReceivableDTO,
} from "./receivables.schemas";

class ReceivableService {
  // lista paginada no padrão {data, pagination}
  async getReceivables(query: ListReceivablesQuery): Promise<PaginatedReceivables> {
    const { page, limit, status, search } = query;
    const filters = { status, search };

    // "all" = sem paginar
    if (limit === "all") {
      const rows = await receivableRepository.list(filters, null, 0);
      return {
        data: rows,
        pagination: {
          actual_page: page,
          limit_per_page: limit,
          total: rows.length,
          total_pages: 1,
          has_next: false,
        },
      };
    }

    const offset = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      receivableRepository.list(filters, limit, offset),
      receivableRepository.count(filters),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: rows,
      pagination: {
        actual_page: page,
        limit_per_page: limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
      },
    };
  }

  // totais dos cards
  async getSummary(): Promise<ReceivableSummary> {
    return receivableRepository.summary();
  }

  // cria conta manual
  async createReceivable(data: CreateReceivableDTO): Promise<ReceivableRow> {
    if (!(await receivableRepository.clientExists(data.cliente_id))) {
      throw new ReceivableError(404, "Cliente não encontrado");
    }

    // vínculos opcionais precisam existir (senão estoura FK)
    if (
      data.contrato_id &&
      !(await receivableRepository.contractExists(data.contrato_id))
    ) {
      throw new ReceivableError(404, "Contrato não encontrado");
    }

    if (
      data.pagamento_id &&
      !(await receivableRepository.paymentExists(data.pagamento_id))
    ) {
      throw new ReceivableError(404, "Parcela não encontrada");
    }

    const id = await receivableRepository.create(data);
    const created = await receivableRepository.findById(id);

    if (!created) throw new ReceivableError(500, "Falha ao criar conta");
    return created;
  }

  // dá baixa. retorna a conta já atualizada
  async settleReceivable(
    id: number,
    data: SettleReceivableDTO,
  ): Promise<ReceivableRow> {
    await receivableRepository.settle(id, data);

    const updated = await receivableRepository.findById(id);
    if (!updated) throw new ReceivableError(404, "Conta não encontrada");
    return updated;
  }
}

export default new ReceivableService();

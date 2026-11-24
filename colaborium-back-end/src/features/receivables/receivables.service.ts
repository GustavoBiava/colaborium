import receivableRepository, { ReceivableError } from "./receivables.repository.js";
import type {
  CreateReceivableDTO,
  ListReceivablesQuery,
  PaginatedReceivables,
  ReceivableRow,
  ReceivableSummary,
  SettleReceivableDTO,
} from "./receivables.schemas.js";

class ReceivableService {
  async getReceivables(
    query: ListReceivablesQuery,
  ): Promise<PaginatedReceivables> {
    const { page, limit, status, search } = query;
    const filters = { status, search };

    if (limit === "all") {
      const registers = await receivableRepository.list(filters, null, 0);
      return {
        data: registers,
        pagination: {
          actual_page: page,
          limit_per_page: limit,
          total: registers.length,
          total_pages: 1,
          has_next: false,
        },
      };
    }

    const offset = (page - 1) * limit;

    const [registers, totalRegisters] = await Promise.all([
      receivableRepository.list(filters, limit, offset),
      receivableRepository.count(filters),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalRegisters / limit));

    return {
      data: registers,
      pagination: {
        actual_page: page,
        limit_per_page: limit,
        total: totalRegisters,
        total_pages: totalPages,
        has_next: page < totalPages,
      },
    };
  }

  async getSummary(): Promise<ReceivableSummary> {
    return receivableRepository.summary();
  }

  async createReceivable(data: CreateReceivableDTO): Promise<ReceivableRow> {
    if (!(await receivableRepository.clientExists(data.cliente_id))) {
      throw new ReceivableError(404, "Cliente não encontrado");
    }

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

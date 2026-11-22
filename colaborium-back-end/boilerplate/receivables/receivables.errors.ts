// erro de regra de negócio. controller converte em resposta http
export class ReceivableError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ReceivableError";
  }
}

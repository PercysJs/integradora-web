import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { Ticket } from "../../domain/entities/Ticket";

type Input = Omit<Ticket, "id" | "createdAt">;

export class CreateTicketUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(input: Input): Promise<Ticket> {
    if (!input.passengerName || !input.routeId || !input.departureTime) {
      throw new Error("Todos los campos son obligatorios.");
    }
    return this.ticketRepository.create(input);
  }
}
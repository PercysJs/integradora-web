import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { Ticket } from "../../domain/entities/Ticket";

export class GetTicketsUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(): Promise<Ticket[]> {
    return this.ticketRepository.findAll();
  }
}
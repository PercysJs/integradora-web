import { Ticket } from "../entities/Ticket";

export interface ITicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  findByUnitNumber(unitNumber: string): Promise<Ticket[]>;
  create(data: Omit<Ticket, "id" | "createdAt">): Promise<Ticket>;
}
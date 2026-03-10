import { IScheduleRepository } from "../../domain/repositories/IScheduleRepository";
import { Schedule } from "../../domain/entities/Schedule";

type Input = Omit<Schedule, "id" | "createdAt" | "routeName">;

export class CreateScheduleUseCase {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(input: Input): Promise<Schedule> {
    if (!input.time || !input.routeId) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(input.time)) {
      throw new Error("Formato de hora inválido. Use HH:MM (00:00 - 23:59).");
    }

    const existing = await this.scheduleRepository.findByTimeAndRoute(input.time, input.routeId);
    if (existing) throw new Error("Ya existe ese horario en esta ruta.");

    return this.scheduleRepository.create(input);
  }
}
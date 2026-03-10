import { IScheduleRepository } from "../../domain/repositories/IScheduleRepository";
import { Schedule } from "../../domain/entities/Schedule";

interface Input {
  id: string;
  data: Partial<Omit<Schedule, "id" | "createdAt" | "routeName">>;
  routeId: string;
}

export class UpdateScheduleUseCase {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute({ id, data, routeId }: Input): Promise<Schedule> {
    if (data.time) {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(data.time)) {
        throw new Error("Formato de hora inválido. Use HH:MM (00:00 - 23:59).");
      }

      const existing = await this.scheduleRepository.findByTimeAndRoute(data.time, routeId);
      if (existing && existing.id !== id) {
        throw new Error("Ya existe ese horario en esta ruta.");
      }
    }
    return this.scheduleRepository.update(id, data);
  }
}
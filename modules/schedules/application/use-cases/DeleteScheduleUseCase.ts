import { IScheduleRepository } from "../../domain/repositories/IScheduleRepository";

export class DeleteScheduleUseCase {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(id: string): Promise<void> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) throw new Error("El horario no existe.");
    return this.scheduleRepository.delete(id);
  }
}
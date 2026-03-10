import { IScheduleRepository } from "../../domain/repositories/IScheduleRepository";

export class GetSchedulesUseCase {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute() {
    return this.scheduleRepository.findAll();
  }
}
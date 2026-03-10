import { IStopRepository } from "../../domain/repositories/IStopRepository";

export class GetStopsUseCase {
  constructor(private readonly stopRepository: IStopRepository) {}

  async execute() {
    return this.stopRepository.findAll();
  }
}
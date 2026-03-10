import { IStopRepository } from "../../domain/repositories/IStopRepository";

export class DeleteStopUseCase {
  constructor(private readonly stopRepository: IStopRepository) {}

  async execute(id: string): Promise<void> {
    const stop = await this.stopRepository.findById(id);
    if (!stop) throw new Error("La parada no existe.");
    return this.stopRepository.delete(id);
  }
}
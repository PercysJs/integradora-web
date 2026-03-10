import { IStopRepository } from "../../domain/repositories/IStopRepository";
import { Stop } from "../../domain/entities/Stop";

interface Input {
  id: string;
  data: Partial<Omit<Stop, "id" | "createdAt" | "routeName">>;
  routeId: string;
}

export class UpdateStopUseCase {
  constructor(private readonly stopRepository: IStopRepository) {}

  async execute({ id, data, routeId }: Input): Promise<Stop> {
    if (data.name) {
      const existing = await this.stopRepository.findByNameAndRoute(data.name, routeId);
      if (existing && existing.id !== id) {
        throw new Error("Ya existe una parada con ese nombre en esta ruta.");
      }
    }
    return this.stopRepository.update(id, data);
  }
}
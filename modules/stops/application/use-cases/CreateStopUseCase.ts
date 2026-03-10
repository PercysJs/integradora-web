import { IStopRepository } from "../../domain/repositories/IStopRepository";
import { Stop } from "../../domain/entities/Stop";

type Input = Omit<Stop, "id" | "createdAt" | "routeName">;

export class CreateStopUseCase {
  constructor(private readonly stopRepository: IStopRepository) {}

  async execute(input: Input): Promise<Stop> {
    if (!input.name || !input.routeId) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const existing = await this.stopRepository.findByNameAndRoute(input.name, input.routeId);
    if (existing) throw new Error("Ya existe una parada con ese nombre en esta ruta.");

    return this.stopRepository.create(input);
  }
}
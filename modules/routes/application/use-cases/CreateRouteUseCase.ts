import { IRouteRepository } from "../../domain/repositories/IRouteRepository";
import { Route } from "../../domain/entities/Route";

type Input = Omit<Route, "id" | "createdAt">;

export class CreateRouteUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(input: Input): Promise<Route> {
    if (!input.unitNumber || !input.route || !input.status) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const existing = await this.routeRepository.findByUnitNumber(input.unitNumber);
    if (existing) throw new Error("Ya existe una ruta con ese número de unidad.");

    return this.routeRepository.create(input);
  }
}
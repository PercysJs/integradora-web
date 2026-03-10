import { IRouteRepository } from "../../domain/repositories/IRouteRepository";
import { Route } from "../../domain/entities/Route";

interface Input {
  id: string;
  data: Partial<Omit<Route, "id" | "createdAt">>;
}

export class UpdateRouteUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute({ id, data }: Input): Promise<Route> {
    if (data.unitNumber) {
      const existing = await this.routeRepository.findByUnitNumber(data.unitNumber);
      if (existing && existing.id !== id) {
        throw new Error("Ya existe una ruta con ese número de unidad.");
      }
    }
    return this.routeRepository.update(id, data);
  }
}
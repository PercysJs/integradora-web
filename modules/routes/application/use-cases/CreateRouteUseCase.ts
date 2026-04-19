import { IRouteRepository } from "../../domain/repositories/IRouteRepository";
import { Route } from "../../domain/entities/Route";

type Input = Omit<Route, "id" | "createdAt">;

export class CreateRouteUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(input: Input): Promise<Route> {
    if (!input.unitNumber || !input.route || !input.status) {
      throw new Error("Todos los campos son obligatorios.");
    }

    if (!input.price || input.price <= 0) {
      throw new Error("El precio del boleto debe ser mayor a $0.00.");
    }

    if (!input.originAddress) {
      throw new Error("La dirección de origen es obligatoria.");
    }

    if (!input.destinationAddress) {
      throw new Error("La dirección de destino es obligatoria.");
    }

    return this.routeRepository.create(input);
  }
}
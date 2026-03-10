import { IRouteRepository } from "../../domain/repositories/IRouteRepository";

export class DeleteRouteUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(id: string): Promise<void> {
    const route = await this.routeRepository.findById(id);
    if (!route) throw new Error("La ruta no existe.");
    return this.routeRepository.delete(id);
  }
}
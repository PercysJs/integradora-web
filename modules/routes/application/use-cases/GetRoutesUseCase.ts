import { IRouteRepository } from "../../domain/repositories/IRouteRepository";

export class GetRoutesUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute() {
    return this.routeRepository.findAll();
  }
}
"use server";

import { RouteRepository } from "../../infrastructure/repositories/RouteRepository";
import { DeleteRouteUseCase } from "../../application/use-cases/DeleteRouteUseCase";

export async function deleteRouteAction(id: string) {
  try {
    const repository = new RouteRepository();
    const useCase = new DeleteRouteUseCase(repository);
    await useCase.execute(id);
    return { success: true, message: "Ruta eliminada correctamente." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
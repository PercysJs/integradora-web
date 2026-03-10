"use server";

import { StopRepository } from "../../infrastructure/repositories/StopRepository";
import { DeleteStopUseCase } from "../../application/use-cases/DeleteStopUseCase";

export async function deleteStopAction(id: string) {
  try {
    const repository = new StopRepository();
    const useCase = new DeleteStopUseCase(repository);
    await useCase.execute(id);
    return { success: true, message: "Parada eliminada correctamente." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
"use server";

import { ScheduleRepository } from "../../infrastructure/repositories/ScheduleRepository";
import { DeleteScheduleUseCase } from "../../application/use-cases/DeleteScheduleUseCase";

export async function deleteScheduleAction(id: string) {
  try {
    const repository = new ScheduleRepository();
    const useCase = new DeleteScheduleUseCase(repository);
    await useCase.execute(id);
    return { success: true, message: "Horario eliminado correctamente." };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}
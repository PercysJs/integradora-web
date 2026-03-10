"use server";

import { ScheduleRepository } from "../../infrastructure/repositories/ScheduleRepository";
import { UpdateScheduleUseCase } from "../../application/use-cases/UpdateScheduleUseCase";

export async function updateScheduleAction(id: string, formData: FormData) {
  const time = formData.get("time") as string;
  const routeId = formData.get("routeId") as string;

  try {
    const repository = new ScheduleRepository();
    const useCase = new UpdateScheduleUseCase(repository);
    await useCase.execute({ id, data: { time, routeId }, routeId });
    return { success: true, message: "Horario actualizado correctamente." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
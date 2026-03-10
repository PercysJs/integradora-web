"use server";

import { ScheduleRepository } from "../../infrastructure/repositories/ScheduleRepository";
import { CreateScheduleUseCase } from "../../application/use-cases/CreateScheduleUseCase";

export async function createScheduleAction(formData: FormData) {
  const time = formData.get("time") as string;
  const routeId = formData.get("routeId") as string;

  try {
    const repository = new ScheduleRepository();
    const useCase = new CreateScheduleUseCase(repository);
    await useCase.execute({ time, routeId });
    return { success: true, message: "Horario creado correctamente." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
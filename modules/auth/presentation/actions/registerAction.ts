"use server";

import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";

export async function registerAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const repository = new AuthRepository();
    const useCase = new RegisterUserUseCase(repository);
    await useCase.execute(fullName, email, password);
    return { success: true, message: "Usuario registrado correctamente." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
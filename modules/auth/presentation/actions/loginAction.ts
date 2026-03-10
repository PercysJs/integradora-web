"use server";

import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import { LoginUserUseCase } from "../../application/use-cases/LoginUserUseCase";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const repository = new AuthRepository();
    const useCase = new LoginUserUseCase(repository);
    const user = await useCase.execute(email, password);
    return { success: true, user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
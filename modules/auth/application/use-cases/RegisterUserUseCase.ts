import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class RegisterUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(fullName: string, email: string, password: string) {
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("El correo no tiene un formato válido.");
    }

   
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error("La contraseña debe tener mínimo 8 caracteres, una letra y un número.");
    }

    return this.authRepository.register(fullName, email, password);
  }
}
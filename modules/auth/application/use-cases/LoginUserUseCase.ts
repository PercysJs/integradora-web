import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class LoginUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Correo y contraseña son obligatorios.");
    }

    return this.authRepository.login(email, password);
  }
}
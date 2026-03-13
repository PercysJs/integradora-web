import { supabase } from "@/shared/lib/supabase";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/User";

export class AuthRepository implements IAuthRepository {

  async register(fullName: string, email: string, password: string): Promise<User> {
    
    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("No se pudo crear el usuario.");

    const userId = authData.user.id;
    const createdAt = new Date(authData.user.created_at);

    // 2. Insertar en tabla users
    const { error: insertError } = await supabase
      .from("users")
      .insert({ id: userId, full_name: fullName, email });

    if (insertError) throw new Error(insertError.message);

    return { id: userId, fullName, email, createdAt };
  }

  async login(email: string, password: string): Promise<User> {
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error("Credenciales inválidas.");
    if (!authData.user) throw new Error("Usuario no encontrado.");

    const { id, user_metadata, created_at } = authData.user;

    return {
      id,
      fullName: user_metadata?.full_name ?? "",
      email: authData.user.email!,
      createdAt: new Date(created_at),
    };
  }
}
import { AuthCard } from "../components/AuthCard";
import { RegisterForm } from "../components/RegisterForm";

export function AuthRegisterView() {
  return (
    <AuthCard title="Registro de Administrador">
      <RegisterForm />
    </AuthCard>
  );
}
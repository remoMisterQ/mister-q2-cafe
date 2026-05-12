import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="section-pad">
      <div className="container-page grid place-items-center">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

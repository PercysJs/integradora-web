interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {

      }
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mountains.png')" }}
      />

      {

      }
      <div className="absolute inset-0 bg-white/30" />

      {

      }
      <div className="relative z-10 flex-1 flex items-center justify-center px-10">
        <img
          src="/images/logo.png"
          alt="Logo ABS"
          className="w-[700px] h-[600px] object-contain drop-shadow-2xl"
        />
      </div>

      {

      }
      <div className="relative z-10 w-full max-w-lg flex items-center justify-center p-10">
        <div className="bg-white w-full rounded-2xl shadow-2xl px-10 py-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            {title}
          </h1>
          {children}
        </div>
      </div>

    </div>
  );
}
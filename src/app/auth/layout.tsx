export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
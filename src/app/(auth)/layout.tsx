export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="size-full flex trans-c">
      <div className="w-full md:w-sm lg:w-1/3 flex-center">{children}</div>
      <div className="relative max-md:hidden flex-1 flex-center bg-brand-area overflow-hidden select-none"></div>
    </div>
  );
}

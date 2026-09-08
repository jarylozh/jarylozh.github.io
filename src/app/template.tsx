export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full flex-1 animate-in flex-col duration-700 ease-out fade-in motion-reduce:animate-none">
      {children}
    </div>
  );
}

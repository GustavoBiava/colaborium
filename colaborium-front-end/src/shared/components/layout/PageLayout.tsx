export function PageLayout({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-start min-h-screen bg-neutral-900 pr-2">
      <div className="flex flex-col h-[98%] w-full p-3 bg-white rounded-md">
        {pageTitle && (
          <h2 className="text-neutral-900 text-xl font-bold">{pageTitle}</h2>
        )}
        {children}
      </div>
    </div>
  );
}

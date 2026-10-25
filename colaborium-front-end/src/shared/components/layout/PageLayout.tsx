import type { LucideIcon } from "lucide-react";

interface PageLayoutProps {
  Icon?: LucideIcon;
  children: React.ReactNode;
  pageTitle: string;
  subtitle: string;
}

export function PageLayout({
  children,
  pageTitle,
  Icon,
  subtitle,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col justify-center items-start min-h-screen bg-neutral-900 pr-2 ">
      <div className="flex flex-col h-[98%] w-full p-3 bg-white rounded-md py-6 px-5 gap-10 ">
        {pageTitle && (
          <span className="flex flex-wrap justify-start items-center gap-2">
            {Icon && (
              <div className="place-content-center place-items-center rounded-xs w-10 h-10 bg-neutral-200">
                <Icon size={24} />
              </div>
            )}

            <div className="flex flex-col justify-start items-start">
              <p className="text-neutral-900 text-xl font-bold m-0">
                {pageTitle}
              </p>
              <span className="text-xs">{subtitle}</span>
            </div>
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

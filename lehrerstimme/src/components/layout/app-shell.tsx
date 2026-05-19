import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border/80 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Lehrerstimme</span>
            <span className="text-xs text-muted-foreground">
              Unabhängige Stimmungsbilder aus der Lehrkräfte-Community
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
    </div>
  );
}

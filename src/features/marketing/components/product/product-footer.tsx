import { Logo } from "@/shared/branding";

export function ProductFooter() {
  return (
    <footer className="border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
        <Logo size="sm" />
        <p className="text-gray-400 text-xs">
          &copy; 2026 Foody. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

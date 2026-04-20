import { Logo } from "@/components/shared/Logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" />
            <p className="text-gray-400 text-sm mt-3">
              Reducing food waste, one meal at a time.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Pricing"],
            },
            {
              title: "Company",
              links: ["About us", "Blogs"],
            },
            {
              title: "Resources",
              links: ["Community", "Support"],
            },
            {
              title: "Contact",
              links: ["xxibrahimashrafxx@gmail.com", "+201280669592"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p
                className="text-[#0E3442] text-sm mb-3"
                style={{ fontWeight: 700 }}
              >
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <button className="text-gray-400 text-sm hover:text-[#25A05F] transition-colors">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            &copy; 2026 Foody. All rights reserved.
          </p>
          <div className="flex gap-4">
            <button className="text-gray-400 text-xs hover:text-[#25A05F]">
              Privacy Policy
            </button>
            <button className="text-gray-400 text-xs hover:text-[#25A05F]">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

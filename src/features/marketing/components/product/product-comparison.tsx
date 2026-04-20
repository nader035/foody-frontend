import { Check } from "lucide-react";

const comparisonRows = [
  { f: "Multi-branch dashboard", a: false, b: true, c: false, d: true },
  { f: "Donation to charities", a: false, b: false, c: true, d: true },
  { f: "Discounted sale to public", a: true, b: false, c: false, d: true },
  { f: "Auto split (donate/sell)", a: false, b: false, c: false, d: true },
  { f: "Manager controls policy", a: false, b: true, c: false, d: true },
  { f: "Real-time notifications", a: true, b: false, c: true, d: true },
  { f: "Reporting & analytics", a: false, b: true, c: false, d: true },
];

export function ProductComparison() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className="text-[#0E3442] mb-3"
            style={{ fontSize: "2rem", fontWeight: 800 }}
          >
            How Foody compares
          </h2>
          <p className="text-gray-400">
            No other platform combines surplus management, donations, and
            discounted sales in one product.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#155433] text-white">
                <th className="text-left px-6 py-4" style={{ fontWeight: 700 }}>
                  Feature
                </th>
                <th
                  className="text-center px-4 py-4"
                  style={{ fontWeight: 600 }}
                >
                  Too Good To Go
                </th>
                <th
                  className="text-center px-4 py-4"
                  style={{ fontWeight: 600 }}
                >
                  Winnow
                </th>
                <th
                  className="text-center px-4 py-4"
                  style={{ fontWeight: 600 }}
                >
                  Olio
                </th>
                <th
                  className="text-center px-4 py-4 bg-[#25A05F]"
                  style={{ fontWeight: 700 }}
                >
                  Foody
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.f} className="border-b border-gray-50">
                  <td
                    className="px-6 py-3.5 text-[#0E3442]"
                    style={{ fontWeight: 600 }}
                  >
                    {row.f}
                  </td>
                  {[row.a, row.b, row.c, row.d].map((v, i) => (
                    <td
                      key={i}
                      className={`text-center px-4 py-3.5 ${i === 3 ? "bg-[#25A05F]/5" : ""}`}
                    >
                      {v ? (
                        <Check
                          size={18}
                          className={
                            i === 3
                              ? "text-[#25A05F] mx-auto"
                              : "text-gray-400 mx-auto"
                          }
                        />
                      ) : (
                        <span className="text-gray-300 text-lg">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Report SOS", href: "/report" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Map", href: "/map" },
  { label: "Action Plan", href: "/command" },
  { label: "Simulator", href: "/simulator" },
  { label: "Pitch", href: "/pitch" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 font-bold">
            RM
          </div>

          <div>
            <p className="font-bold leading-none">RescueMesh AI</p>
            <p className="text-xs text-slate-400">
              Disaster Command Intelligence
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/report"
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Send SOS
        </Link>
      </nav>
    </header>
  );
}
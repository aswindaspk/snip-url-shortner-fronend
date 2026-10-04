"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Link2,
  LayoutDashboard,
  ChartNoAxesCombined,
  Settings,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "./ui/button";
export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 text-[29px] font-bold tracking-[-1.5px]"
      aria-label="Snip home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
        <Link2 size={22} strokeWidth={2.5} />
      </span>
      snip<span className="text-primary -ml-2">.</span>
    </Link>
  );
}
const items = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/urls", label: "My links", icon: Link2 },
  { href: "/app/analytics", label: "Analytics", icon: ChartNoAxesCombined },
];
export function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between border-b p-5 md:hidden">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      <aside
        className={`${open ? "flex" : "hidden"} fixed inset-y-0 left-0 z-30 w-[232px] flex-col border-r bg-card px-5 py-8 md:flex max-md:top-[77px] max-md:shadow-xl`}
      >
        <div className="px-3 max-md:hidden">
          <Logo />
        </div>
        <div className="mt-10 mb-7 rounded-lg border bg-background px-3 py-3 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edeadf] text-[#615a44] text-xs font-bold">
            S
          </span>
          <div>
            <p className="font-semibold text-xs">Your workspace</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Make every link count
            </p>
          </div>
        </div>
        <p className="px-3 mb-3 text-[10px] font-semibold tracking-[.14em] text-muted-foreground">
          WORKSPACE
        </p>
        <nav className="space-y-1" aria-label="Workspace">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={path === href ? "page" : undefined}
              className={`flex gap-3 items-center rounded-lg px-3 py-3 text-[13px] ${path === href ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-12">
          <div className="rounded-xl bg-background border p-4 mb-6">
            <span className="text-primary">
              <Link2 size={21} />
            </span>
            <p className="font-semibold text-xs mt-3">
              A little link. A lot of potential.
            </p>
            <p className="text-xs text-muted-foreground leading-5 mt-2">
              Make your next big idea easier to share.
            </p>
            <Link
              href="/features"
              className="mt-3 text-xs inline-flex items-center gap-2 font-medium"
            >
              Explore Snip <ArrowUpRight size={14} />
            </Link>
          </div>
          <nav aria-label="Account">
            {[
              { href: "/app/settings", label: "Settings", icon: Settings },
              { href: "/app/profile", label: "Profile", icon: User },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground text-xs hover:text-foreground"
                href={href}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t mt-5 pt-5 px-3 flex items-center justify-between">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden dark:block" size={16} />
      <Moon className="dark:hidden" size={16} />
    </Button>
  );
}
export function PublicHeader() {
  return (
    <header className="border-b bg-card">
      <div className="max-w-6xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-3 sm:gap-7">
          <Link
            href="/features"
            className="text-sm text-muted-foreground hidden sm:block"
          >
            Features
          </Link>
          <Link href="/login" className="text-sm">
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">
              Get started <ArrowRight size={15} />
            </Link>
          </Button>
          <span className="hidden sm:block">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}

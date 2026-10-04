"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Link2,
  MousePointer2,
  Plus,
  QrCode,
  Sparkles,
  Zap,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { UrlForm } from "./url-form";
import { Button } from "./ui/button";
export function Dashboard() {
  const { data } = authClient.useSession();
  return (
    <>
      <div className="flex flex-wrap justify-between gap-4 items-center mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[.14em] text-muted-foreground mb-2">
            A LITTLE SHORTER. A LOT SMARTER.
          </p>
          <h1 className="text-[29px] font-semibold tracking-tight">
            Hello{data?.user.name ? `, ${data.user.name.split(" ")[0]}` : ""}{" "}
            <span className="text-primary">✳</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Big ideas start with small links. Let’s make your next one.
          </p>
        </div>
        <Button asChild>
          <a href="#create-link">
            <Plus size={16} />
            Create a link
          </a>
        </Button>
      </div>
      <div className="rounded-xl bg-[#eaece0] dark:bg-[#293023] border border-[#dde1d0] dark:border-border p-6 mb-7 flex justify-between items-center gap-6 overflow-hidden">
        <div>
          <span className="text-[10px] font-semibold text-[#63704f] dark:text-[#adbf93] tracking-widest">
            WELCOME TO YOUR WORKSPACE
          </span>
          <h2 className="text-xl font-semibold mt-2 tracking-tight">
            Your next big thing deserves a little link.
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            Create a short link, add your own alias, and share it anywhere.
          </p>
        </div>
        <span className="hidden sm:block text-[#96a47f]">
          <Sparkles size={65} strokeWidth={1} />
        </span>
      </div>
      <UrlForm />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
        {[
          { label: "Total links", icon: Link2 },
          { label: "Total clicks", icon: MousePointer2 },
          { label: "Active links", icon: Zap },
          { label: "Link performance", icon: ChartNoAxesCombined },
        ].map(({ label, icon: Icon }) => (
          <div className="rounded-xl border bg-card p-5" key={label}>
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              {label}
              <Icon size={16} />
            </div>
            <p
              className="mt-4 text-3xl text-muted-foreground"
              aria-label="Not available"
            >
              —
            </p>
            <p className="text-[10px] text-muted-foreground mt-3">
              Reporting not connected yet
            </p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 mt-7">
        <section className="rounded-xl border bg-card">
          <div className="flex justify-between p-5 border-b">
            <h2 className="font-semibold">Your link collection</h2>
            <Link
              href="/app/urls"
              className="text-xs text-muted-foreground flex gap-2 items-center"
            >
              My links <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="text-center px-6 py-10">
            <span className="inline-flex p-3 rounded-xl bg-muted text-muted-foreground">
              <Link2 size={24} />
            </span>
            <h3 className="font-medium mt-4">A home for every link</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto leading-5">
              Saved link history will appear here when the link management API
              is available. For now, copy each link after creating it.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-5">
              <a href="#create-link">
                <Plus size={14} />
                Create your next link
              </a>
            </Button>
          </div>
        </section>
        <section className="rounded-xl border bg-card p-5">
          <p className="text-[10px] tracking-widest text-muted-foreground mb-5">
            A LITTLE INSPIRATION
          </p>
          <div className="rounded-lg bg-[#f4efe5] dark:bg-muted p-4 mb-4">
            <QrCode size={27} strokeWidth={1.4} />
            <h3 className="font-semibold mt-4">Take your links offline.</h3>
            <p className="text-xs text-muted-foreground leading-5 mt-2">
              From packaging to posters, a QR code makes every surface a new
              connection.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

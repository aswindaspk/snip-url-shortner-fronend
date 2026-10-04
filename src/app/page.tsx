import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Share2,
  Globe2,
  Link2,
  QrCode,
  Sparkles,
  Zap,
} from "lucide-react";
import { PublicHeader, Logo } from "@/components/navigation";
import { UrlForm } from "@/components/url-form";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 lg:pt-24">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
            <div>
              <h1 className="text-[52px] sm:text-[68px] font-semibold leading-[1.06] tracking-[-3px]">
                Small links.
                <br />
                <span className="text-primary">Big possibilities.</span>
              </h1>
              <p className="mt-6 max-w-md text-base text-muted-foreground leading-7">
                Your ideas deserve to go places. Turn long, complicated URLs
                into simple links that are ready for anything.
              </p>
              <div className="flex flex-wrap items-center gap-5 mt-8">
                <Button asChild>
                  <a href="#create-link">
                    Create your first link <ArrowRight size={16} />
                  </a>
                </Button>
                <Link
                  href="/features"
                  className="text-sm flex gap-1 items-center"
                >
                  Explore Snip <ArrowUpRight size={15} />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-5 mt-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Check size={13} className="text-primary" />
                  No account needed
                </span>
                <span className="flex items-center gap-1">
                  <Check size={13} className="text-primary" />
                  Ready in seconds
                </span>
              </div>
            </div>
            <div className="relative rounded-[28px] bg-[#eeeee5] dark:bg-[#282d24] dot-grid min-h-[360px] p-8 flex flex-col justify-center overflow-hidden">
              <div className="absolute right-7 top-7 text-[#9aab86]">
                <Sparkles size={27} aria-hidden="true" />
              </div>
              <p className="text-xs text-muted-foreground mb-3 ml-3">
                GOOD THINGS COME IN SMALL LINKS
              </p>
              <div className="bg-card border rounded-xl px-5 py-4 translate-y-[5px] shadow-sm">
                <p className="text-[10px] tracking-wider text-muted-foreground mb-2">
                  BEFORE
                </p>
                <p className="text-muted-foreground text-xs break-all font-mono">
                  https://your-next-big-idea.com/share/something-wonderful?with=everyone
                </p>
              </div>
              <div className="h-12 flex justify-center items-center text-primary">
                <span className="text-3xl">↓</span>
              </div>
              <div className="bg-card border rounded-xl px-5 py-5 shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-[10px] tracking-wider text-primary mb-2">
                    AFTER · ILLUSTRATIVE LINK
                  </p>
                  <p className="font-semibold text-2xl tracking-tight">
                    snip.link/big-idea
                  </p>
                </div>
                <span className="bg-primary p-3 rounded-xl text-white">
                  <Link2 size={24} />
                </span>
              </div>
              <div className="flex justify-between items-center mt-8 px-3">
                <p className="text-xs text-muted-foreground">
                  A smaller link.
                  <br />
                  An easier way to connect.
                </p>
                <span className="text-3xl text-[#9aab86]">✳</span>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <UrlForm />
        </div>
        <section className="border-y bg-card">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="flex flex-wrap justify-between gap-5 items-end mb-9">
              <div>
                <p className="text-xs text-primary font-semibold tracking-widest mb-3">
                  SMALL DETAILS. BIG DIFFERENCE.
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Everything a great link needs.
                </h2>
              </div>
              <Link href="/features" className="text-sm flex gap-2">
                Meet your new toolkit <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "From long to lovely",
                  text: "Paste a URL, give it a personal touch, and get a clean link you’ll actually want to share.",
                },
                {
                  icon: QrCode,
                  title: "Connect beyond the screen",
                  text: "Every new link comes with a downloadable QR code. Take it from your screen into the real world.",
                },
                {
                  icon: Share2,
                  title: "Ready to go anywhere",
                  text: "Copy your link in a click, or send it straight to your favorite apps with your device’s share menu.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <article key={title}>
                  <span className="flex w-10 h-10 items-center justify-center rounded-lg bg-muted mb-5">
                    <Icon size={20} />
                  </span>
                  <h3 className="font-semibold mb-3">{title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-6 py-14 flex flex-wrap items-center gap-6 justify-between">
          <div className="flex gap-4 items-center">
            <Globe2 className="text-primary" size={30} />
            <div>
              <h2 className="text-xl font-semibold">
                Your next connection starts with a link.
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Make it a good one.
              </p>
            </div>
          </div>
          <Button asChild>
            <a href="#create-link">
              Let’s snip it <ArrowRight size={16} />
            </a>
          </Button>
        </section>
      </main>
      <footer className="border-t">
        <div className="max-w-6xl mx-auto p-6 flex flex-wrap justify-between gap-6 items-center">
          <Logo />
          <p className="text-xs text-muted-foreground">
            Thoughtfully short. Endlessly shareable.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/features">Features</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

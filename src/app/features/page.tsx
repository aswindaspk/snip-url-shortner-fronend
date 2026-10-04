import Link from "next/link";
import { ArrowRight, Link2, QrCode, Share2, Code2 } from "lucide-react";
import { PublicHeader } from "@/components/navigation";
import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-primary text-xs tracking-widest font-semibold">
          LESS FRICTION. MORE CONNECTION.
        </p>
        <h1 className="text-5xl font-semibold tracking-[-2px] mt-5 max-w-xl leading-tight">
          A small toolkit.
          <br />A world of possibilities.
        </h1>
        <p className="text-muted-foreground text-base leading-7 mt-6 max-w-xl">
          From the first click to the next big idea, make your links easier to
          create and easier to share.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 my-12">
          {[
            {
              icon: Link2,
              title: "Links with a little personality",
              text: "Turn a long destination into a short link. Choose your own memorable alias, or let Snip create one for you.",
            },
            {
              icon: QrCode,
              title: "From a link to a real-world connection",
              text: "Download the QR code that comes with every link. Put it on a poster, a business card, or your next presentation.",
            },
            {
              icon: Share2,
              title: "Good ideas are meant to be shared",
              text: "Copy in one click, open your link, or send it with your device’s built-in share menu.",
            },
            {
              icon: Code2,
              title: "Fits right into your workflow",
              text: "Create links programmatically using the existing JSON API and bring shorter links into your own applications.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <section key={title} className="rounded-xl border bg-card p-8">
              <Icon className="text-primary mb-6" size={26} />
              <h2 className="text-lg font-semibold mb-3">{title}</h2>
              <p className="text-muted-foreground leading-6">{text}</p>
            </section>
          ))}
        </div>
        <section className="rounded-xl border bg-muted p-8">
          <h2 className="text-xl font-semibold">
            A clearer view of what comes next.
          </h2>
          <p className="text-muted-foreground leading-7 mt-3 max-w-2xl">
            Link management and analytics are planned for the workspace.
            Reporting will need backend support before we can show click trends,
            audiences, or performance. Today, Snip focuses on creating and
            sharing great links.
          </p>
        </section>
        <Button asChild className="mt-8">
          <Link href="/#create-link">
            Create your first link <ArrowRight size={16} />
          </Link>
        </Button>
      </main>
    </>
  );
}

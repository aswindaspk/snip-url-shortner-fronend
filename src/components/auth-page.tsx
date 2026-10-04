import { Logo } from "./navigation";
import { AuthForm } from "./auth-form";
import Link from "next/link";
import { ArrowLeft, Link2 } from "lucide-react";
export function AuthPage({ signup = false }: { signup?: boolean }) {
  return (
    <main id="main-content" className="min-h-screen grid lg:grid-cols-2">
      <section className="hidden lg:flex bg-[#eaece2] dark:bg-[#252d20] p-14 flex-col justify-between dot-grid">
        <Logo />
        <div>
          <span className="flex w-16 h-16 bg-primary rounded-2xl items-center justify-center text-white mb-8">
            <Link2 size={32} />
          </span>
          <h1 className="text-6xl font-semibold tracking-[-3px] leading-[1.1]">
            A small link.
            <br />
            Your next big thing.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-sm leading-7">
            A little less complexity. A little more connection. Welcome to a
            simpler way to share.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Thoughtfully short. Endlessly shareable.
        </p>
      </section>
      <section className="p-6 sm:p-12 flex flex-col">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground text-xs"
        >
          <ArrowLeft size={14} />
          Back to Snip
        </Link>
        <div className="w-full max-w-sm m-auto py-12">
          <div className="lg:hidden mb-10">
            <Logo />
          </div>
          <p className="text-primary text-xs font-semibold tracking-widest mb-3">
            {signup ? "YOUR NEXT CHAPTER" : "GOOD TO SEE YOU"}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {signup ? "Make yourself at home." : "Welcome back."}
          </h2>
          <p className="mt-3 mb-8 text-muted-foreground">
            {signup
              ? "Create your account to enter your workspace."
              : "Sign in to your Snip workspace."}
          </p>
          <AuthForm signup={signup} />
        </div>
      </section>
    </main>
  );
}

import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme";
import { KeystoneMark, Wordmark } from "./brand";

export { LandingPage } from "./landing";

export function LoginPage() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
      <ThemeToggle className="absolute right-5 top-5 z-20" />
      <section className="relative hidden overflow-hidden border-r border-border bg-surface-1 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 grid-atmos opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] ambient-glow" />
        <Link to="/" className="relative flex items-center gap-3">
          <KeystoneMark className="h-8 w-8" />
          <Wordmark />
        </Link>
        <div className="relative max-w-xl">
          <div className="mb-8 h-px w-24 hairline" />
          <h1 className="text-[3.25rem] font-semibold leading-[1.02] tracking-[-0.03em]">
            One command center
            <br />
            <span className="text-muted-foreground">for every field operation.</span>
          </h1>
          <p className="mt-7 max-w-md text-[15px] leading-7 text-muted-foreground">
            Coordinate people, assets, service commitments, and field execution with clarity.
          </p>
        </div>
        <div className="relative flex items-center gap-2 text-[10px] tracking-[0.16em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          SECURE ENTERPRISE ACCESS
        </div>
      </section>

      <section className="flex items-center justify-center p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void router.navigate({ to: "/dashboard" });
          }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-12 flex items-center gap-2.5 lg:hidden">
            <KeystoneMark className="h-7 w-7" />
            <Wordmark />
          </Link>
          <p className="text-[10px] tracking-[0.18em] text-primary">WELCOME BACK</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">Sign in to operations</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use any credentials to explore the Phase 1 workspace.
          </p>
          <div className="mt-8 space-y-5">
            <label className="block text-xs">
              Work email
              <Input className="mt-2 h-11" type="email" defaultValue="admin@northstarfacilities.in" required />
            </label>
            <label className="block text-xs">
              Password
              <div className="relative mt-2">
                <Input className="h-11 pr-10" type={show ? "text" : "password"} defaultValue="keystone-demo" required />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </label>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <Checkbox />
                Remember me
              </label>
              <button type="button" className="text-primary transition-opacity hover:opacity-80">
                Forgot password?
              </button>
            </div>
            <Button className="group h-11 w-full btn-glow" type="submit">
              Sign in
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-2 border-t border-border pt-5 text-[10px] text-muted-foreground">
            <LockKeyhole className="h-3.5 w-3.5" />
            Secure enterprise access · Demo environment
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2">
            <RoleLink to="/dashboard" label="Admin" />
            <RoleLink to="/technician/dashboard" label="Technician" />
            <RoleLink to="/customer/dashboard" label="Customer" />
          </div>
        </form>
      </section>
    </div>
  );
}

function RoleLink({ to, label }: { to: string; label: string }) {
  return (
    <Button asChild variant="quiet" size="sm">
      <Link to={to}>{label}</Link>
    </Button>
  );
}

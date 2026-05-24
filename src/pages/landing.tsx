import { useNavigate } from "react-router-dom"
import { useCallback, useState } from "react"
import { Shield, Zap, Server, ArrowRight, GitBranch } from "lucide-react"
import { api } from "@/services/api"
import { Logo } from "@/components/icons/logo"
import { GithubIcon } from "@/components/icons/provider-icon"

function NavButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="group relative px-5 py-2 text-sm font-medium text-black bg-white rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-70"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 animate-spin rounded-full border border-black/30 border-t-black" />
          Checking...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Dashboard
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
    </button>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(false)

  const handleLogin = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    setChecking(true)
    try {
      await api.get("/auth/me")
      navigate("/dashboard")
    } catch {
      navigate("/login")
    } finally {
      setChecking(false)
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Noise texture overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        <div className="flex items-center gap-2.5">
          <Logo className="h-10 w-10" />
          <span className="text-xl font-semibold tracking-tight">GitReserve</span>
        </div>
        <NavButton onClick={() => void handleLogin()} loading={checking} />
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-32 md:px-12 md:pt-36 md:pb-44 lg:px-20">
        {/* Grid accent lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-neutral-800/50 to-transparent" />
          <div className="absolute top-0 left-2/4 h-full w-px bg-gradient-to-b from-transparent via-neutral-800/30 to-transparent" />
          <div className="absolute top-0 left-3/4 h-full w-px bg-gradient-to-b from-transparent via-neutral-800/50 to-transparent" />
        </div>

        <div className="relative max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-1.5 text-xs font-medium text-neutral-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Automated backups on every push
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            Your repos.
            <br />
            <span className="text-neutral-500">Always safe.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-400 md:text-xl">
            GitReserve mirrors your Git repositories to S3-compatible storage automatically.
            Every push triggers a backup. Zero manual intervention.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => void handleLogin()}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-7 py-3 text-sm font-medium text-neutral-300 transition-all duration-200 hover:border-neutral-500 hover:text-white"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative h-80 w-80">
            <div className="absolute inset-0 rounded-full border border-neutral-800/60" />
            <div className="absolute inset-8 rounded-full border border-neutral-800/40" />
            <div className="absolute inset-16 rounded-full border border-neutral-800/30" />
            <div className="absolute inset-24 rounded-full border border-neutral-800/20 bg-neutral-900/20" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent md:mx-12 lg:mx-20" />

      {/* Features */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mb-16 max-w-md">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Push. Backup. Done.
          </h2>
        </div>

        <div className="grid gap-px rounded-2xl border border-neutral-800 bg-neutral-800 overflow-hidden md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Zap className="h-5 w-5" />}
            title="Webhook-driven"
            description="Automatic triggers on every push. No cron jobs, no polling. Real-time backups."
          />
          <FeatureCard
            icon={<Server className="h-5 w-5" />}
            title="S3 & R2 storage"
            description="Store archives in AWS S3 or Cloudflare R2. Your infrastructure, your rules."
          />
          <FeatureCard
            icon={<Shield className="h-5 w-5" />}
            title="Encrypted & secure"
            description="OAuth tokens encrypted at rest. Webhook signatures verified on every request."
          />
          <FeatureCard
            icon={<GitBranch className="h-5 w-5" />}
            title="Multi-provider"
            description="Connect GitHub and GitLab. More providers coming soon."
          />
        </div>
      </section>

      {/* Providers section */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent md:mx-12 lg:mx-20" />

      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="flex flex-col items-center text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Integrations</p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight md:text-4xl">
            Works with your stack
          </h2>
          <div className="flex items-center gap-12">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
                <GithubIcon className="h-7 w-7 text-white" />
              </div>
              <span className="text-sm text-neutral-400">GitHub</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
                <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 00-.867 0L16.418 9.45H7.582L4.918 1.263a.455.455 0 00-.867 0L1.387 9.452.045 13.587a.924.924 0 00.331 1.023L12 23.054l11.624-8.443a.92.92 0 00.331-1.024"/></svg>
              </div>
              <span className="text-sm text-neutral-400">GitLab</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900">
                <Server className="h-7 w-7 text-white" />
              </div>
              <span className="text-sm text-neutral-400">S3 / R2</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent md:mx-12 lg:mx-20" />

      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Never lose a repo again.
          </h2>
          <p className="mb-8 max-w-md text-neutral-400">
            Set it up once. Every push is backed up automatically. Sleep well knowing your code is safe.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 py-8 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="text-sm font-medium">GitReserve</span>
          </div>
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} GitReserve. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative bg-black p-8 transition-colors hover:bg-neutral-950">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 text-neutral-300 transition-colors group-hover:border-neutral-700 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold tracking-tight text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-500">{description}</p>
    </div>
  )
}

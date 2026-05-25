import { useNavigate } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react"
import { Shield, Zap, Server, ArrowRight, GitBranch, Check, Cloud, FileArchive, FileText, Hash } from "lucide-react"
import { api } from "@/services/api"
import { GithubIcon } from "@/components/icons/provider-icon"

function HeroTerminal() {
  const [phase, setPhase] = useState(0)
  const [typedCmd, setTypedCmd] = useState("")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const command = "git push origin main"

  useEffect(() => {
    let charIdx = 0

    function typeNext() {
      if (charIdx <= command.length) {
        setTypedCmd(command.slice(0, charIdx))
        charIdx++
        timerRef.current = setTimeout(typeNext, 40 + Math.random() * 40)
      } else {
        timerRef.current = setTimeout(() => setPhase(1), 400)
      }
    }

    typeNext()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  useEffect(() => {
    if (phase === 0) return
    if (phase <= 7) {
      const delays = [600, 400, 400, 700, 800, 700, 600, 600]
      timerRef.current = setTimeout(() => setPhase(phase + 1), delays[phase - 1] ?? 500)
      return () => { if (timerRef.current) clearTimeout(timerRef.current) }
    }
    if (phase === 8) {
      timerRef.current = setTimeout(() => {
        setPhase(0)
        setTypedCmd("")
        let ci = 0
        function retype() {
          if (ci <= command.length) {
            setTypedCmd(command.slice(0, ci))
            ci++
            timerRef.current = setTimeout(retype, 40 + Math.random() * 40)
          } else {
            timerRef.current = setTimeout(() => setPhase(1), 400)
          }
        }
        timerRef.current = setTimeout(retype, 1200)
      }, 3500)
      return () => { if (timerRef.current) clearTimeout(timerRef.current) }
    }
  }, [phase])

  return (
    <div className="w-[420px] rounded-xl border border-neutral-800 bg-neutral-950/90 shadow-2xl shadow-black/60 backdrop-blur-sm overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 border-b border-neutral-800/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[10px] tracking-wide text-neutral-600 font-mono uppercase">Terminal</span>
      </div>

      {/* Terminal output */}
      <div className="px-5 py-4 font-mono text-[13px] leading-[1.7] space-y-0.5 min-h-[130px]">
        <div>
          <span className="text-emerald-400">$</span>{" "}
          <span className="text-white">{typedCmd}</span>
          {phase === 0 && <span className="inline-block w-[7px] h-[15px] bg-emerald-400/80 ml-0.5 animate-pulse align-middle" />}
        </div>
        {phase >= 1 && <div className="text-neutral-500">Enumerating objects: 42, done.</div>}
        {phase >= 2 && <div className="text-neutral-500">Compressing objects: 100% (38/38)</div>}
        {phase >= 3 && <div className="text-neutral-500">Writing objects: 100% (42/42), 8.12 KiB</div>}
        {phase >= 4 && (
          <div className="flex items-center gap-1.5 text-emerald-400 pt-1">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            <span>main → origin/main</span>
          </div>
        )}
      </div>

      {/* Backup section — always present, content fades in */}
      <div className="border-t border-neutral-800/60">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Cloud className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-white">GitReserve Backup</div>
              <div className="text-[10px] text-neutral-500">S3-compatible storage</div>
            </div>
          </div>
          <span className={`rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400 transition-opacity duration-300 ${phase >= 8 ? "opacity-100" : "opacity-0"}`}>
            Complete
          </span>
        </div>

        <div className="px-5 pb-4 space-y-2.5 min-h-[120px]">
          <div className={`text-[10px] font-medium uppercase tracking-widest text-neutral-600 transition-opacity duration-300 ${phase >= 5 ? "opacity-100" : "opacity-0"}`}>
            Syncing
          </div>
          <div className={`flex items-center justify-between transition-opacity duration-300 ${phase >= 6 ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center gap-2.5">
              <FileArchive className="h-3.5 w-3.5 text-neutral-500" />
              <span className="text-[12px] text-neutral-300">repo-archive.bundle</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-600">8.12 KB</span>
              <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
            </div>
          </div>
          <div className={`flex items-center justify-between transition-opacity duration-300 ${phase >= 7 ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center gap-2.5">
              <FileText className="h-3.5 w-3.5 text-neutral-500" />
              <span className="text-[12px] text-neutral-300">metadata.json</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-600">1.2 KB</span>
              <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
            </div>
          </div>
          <div className={`flex items-center justify-between transition-opacity duration-300 ${phase >= 8 ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center gap-2.5">
              <Hash className="h-3.5 w-3.5 text-neutral-500" />
              <span className="text-[12px] text-neutral-300">checksums.sha256</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tight">GitReserve</span>
          <button onClick={() => navigate("/docs")} className="hidden sm:block text-sm text-neutral-400 hover:text-white transition-colors">Docs</button>
        </div>
        <NavButton onClick={() => void handleLogin()} loading={checking} />
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-12 pb-24 md:px-12 md:pt-16 md:pb-32 lg:px-20">
        {/* Grid accent lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-neutral-800/50 to-transparent" />
          <div className="absolute top-0 left-2/4 h-full w-px bg-gradient-to-b from-transparent via-neutral-800/30 to-transparent" />
          <div className="absolute top-0 left-3/4 h-full w-px bg-gradient-to-b from-transparent via-neutral-800/50 to-transparent" />
        </div>

        <div className="relative flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Left — copy */}
          <div className="max-w-2xl shrink-0">
            <div className="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-1.5 text-[13px] font-medium text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
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

          {/* Right — terminal animation */}
          <div className="hidden lg:block lg:shrink-0">
            <HeroTerminal />
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
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium">GitReserve</span>
            <button onClick={() => navigate("/docs")} className="text-xs text-neutral-500 hover:text-white transition-colors">Docs</button>
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

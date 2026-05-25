import { useState, useRef, useEffect } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { ChevronRight, Menu, X, Search, Sparkles, ExternalLink, AlertTriangle, Lightbulb, Copy, Check, ChevronDown, FileText } from "lucide-react"
import { DOCS, DOC_CATEGORIES, type DocSection } from "./docs-content"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 rounded-md bg-neutral-800/80 text-neutral-500 hover:text-white transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

function renderMarkdown(content: string) {
  const lines = content.trim().split("\n")
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]!
    const k = key++

    if (line.startsWith("# ")) {
      elements.push(<h1 key={k} className="text-3xl font-bold tracking-tight text-white mb-3 mt-10 first:mt-0">{line.slice(2)}</h1>)
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={k} id={line.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="text-xl font-semibold text-white mt-12 mb-3 scroll-mt-20">{line.slice(3)}</h2>)
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={k} className="text-base font-medium text-white mt-8 mb-2">{line.slice(4)}</h3>)
    } else if (line === "---") {
      elements.push(<hr key={k} className="my-8 border-neutral-800/60" />)
    } else if (line.startsWith(":::tip")) {
      const calloutLines: string[] = []
      i++
      while (i < lines.length && lines[i] !== ":::") {
        calloutLines.push(lines[i]!)
        i++
      }
      elements.push(
        <div key={k} className="my-5 flex gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3.5">
          <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
          <div className="text-[14px] leading-relaxed text-emerald-200/80">{calloutLines.map(l => renderInline(l)).reduce<React.ReactNode[]>((acc, el, idx) => idx === 0 ? [el] : [...acc, " ", el], [])}</div>
        </div>
      )
    } else if (line.startsWith(":::warning")) {
      const calloutLines: string[] = []
      i++
      while (i < lines.length && lines[i] !== ":::") {
        calloutLines.push(lines[i]!)
        i++
      }
      elements.push(
        <div key={k} className="my-5 flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3.5">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
          <div className="text-[14px] leading-relaxed text-amber-200/80">{calloutLines.map(l => renderInline(l)).reduce<React.ReactNode[]>((acc, el, idx) => idx === 0 ? [el] : [...acc, " ", el], [])}</div>
        </div>
      )
    } else if (line.startsWith("```")) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i]!.startsWith("```")) {
        codeLines.push(lines[i]!)
        i++
      }
      const code = codeLines.join("\n")
      elements.push(
        <div key={k} className="group relative my-5">
          {lang && <div className="absolute top-0 left-0 rounded-tl-lg rounded-br-md bg-neutral-800/80 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500">{lang}</div>}
          <pre className="rounded-lg border border-neutral-800 bg-[#0a0a0a] p-4 pt-8 overflow-x-auto">
            <code className="text-[13px] font-mono text-neutral-300 leading-relaxed">{code}</code>
          </pre>
          <CopyButton text={code} />
        </div>
      )
    } else if (line.startsWith("| ") && lines[i + 1]?.startsWith("|--")) {
      const headers = line.split("|").filter(Boolean).map(h => h.trim())
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i]!.startsWith("| ")) {
        rows.push(lines[i]!.split("|").filter(Boolean).map(c => c.trim()))
        i++
      }
      i--
      elements.push(
        <div key={k} className="my-5 overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                {headers.map((h, j) => <th key={j} className="px-4 py-2.5 text-left text-[13px] font-medium text-neutral-300">{renderInline(h)}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-neutral-800/40 last:border-0">
                  {row.map((cell, ci) => <td key={ci} className="px-4 py-2.5 text-[13px] text-neutral-400">{renderInline(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [line]
      while (i + 1 < lines.length && /^\d+\.\s/.test(lines[i + 1]!)) {
        i++
        items.push(lines[i]!)
      }
      elements.push(
        <ol key={k} className="my-4 space-y-2 counter-reset-list">
          {items.map((item, j) => {
            const text = item.replace(/^\d+\.\s/, "")
            return (
              <li key={j} className="flex gap-3 text-neutral-400 text-[14px] leading-relaxed">
                <span className="flex h-5 w-5 mt-0.5 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[11px] font-medium text-neutral-400">{j + 1}</span>
                <span>{renderInline(text)}</span>
              </li>
            )
          })}
        </ol>
      )
    } else if (line.startsWith("- ")) {
      const items: string[] = [line]
      while (i + 1 < lines.length && lines[i + 1]!.startsWith("- ")) {
        i++
        items.push(lines[i]!)
      }
      elements.push(
        <ul key={k} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2.5 text-neutral-400 text-[14px] leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500/60" />
              <span>{renderInline(item.slice(2))}</span>
            </li>
          ))}
        </ul>
      )
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(<p key={k} className="text-[14px] leading-relaxed text-neutral-400 my-3">{renderInline(line)}</p>)
    }

    i++
  }

  return elements
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[2]) {
      parts.push(<strong key={match.index} className="font-semibold text-white">{match[2]}</strong>)
    } else if (match[3]) {
      parts.push(<code key={match.index} className="rounded bg-neutral-800/80 px-1.5 py-0.5 text-[12px] font-mono text-emerald-400">{match[3]}</code>)
    } else if (match[4] && match[5]) {
      if (match[5].startsWith("/")) {
        parts.push(<Link key={match.index} to={match[5]} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 decoration-emerald-400/30 hover:decoration-emerald-400/60 transition-colors">{match[4]}</Link>)
      } else {
        parts.push(<a key={match.index} href={match[5]} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 decoration-emerald-400/30 inline-flex items-center gap-1">{match[4]}<ExternalLink className="h-3 w-3" /></a>)
      }
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 1 ? parts[0] : parts
}

function getHeadings(content: string): { id: string; title: string }[] {
  return content.split("\n")
    .filter(l => l.startsWith("## "))
    .map(l => {
      const title = l.slice(3).trim()
      return { id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title }
    })
}

function DocsSidebar({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  const [search, setSearch] = useState("")
  const filtered = search
    ? DOCS.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.content.toLowerCase().includes(search.toLowerCase()))
    : DOCS

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-600" />
        <input
          type="text"
          placeholder="Search docs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-neutral-600 outline-none focus:border-neutral-700 transition-colors"
        />
      </div>
      <nav className="space-y-5">
        {search ? (
          <div className="space-y-0.5">
            {filtered.length === 0 && <p className="px-3 text-[12px] text-neutral-600">No results found</p>}
            {filtered.map(doc => (
              <Link
                key={doc.slug}
                to={`/docs/${doc.slug}`}
                onClick={onNavigate}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                  current === doc.slug ? "bg-neutral-800/60 text-white font-medium" : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"
                }`}
              >
                {doc.title}
                <span className="ml-auto text-[10px] text-neutral-600">{doc.category}</span>
              </Link>
            ))}
          </div>
        ) : (
          DOC_CATEGORIES.map(category => {
            const items = DOCS.filter(d => d.category === category)
            if (items.length === 0) return null
            return (
              <div key={category}>
                <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600">{category}</div>
                <ul className="space-y-0.5">
                  {items.map(doc => (
                    <li key={doc.slug}>
                      <Link
                        to={`/docs/${doc.slug}`}
                        onClick={onNavigate}
                        className={`flex items-center rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                          current === doc.slug
                            ? "bg-neutral-800/60 text-white font-medium"
                            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"
                        }`}
                      >
                        {doc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })
        )}
      </nav>
    </div>
  )
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/, "").replace(/```/, ""))
    .replace(/:::tip\n?/g, "Tip: ")
    .replace(/:::warning\n?/g, "Warning: ")
    .replace(/:::/g, "")
    .replace(/#{1,3}\s/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/\|[^\n]+\|/g, (row) => row.split("|").filter(Boolean).map(c => c.trim()).join(" | "))
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function AskAiDropdown({ doc }: { doc: DocSection }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const plainContent = stripMarkdown(doc.content)
  const prompt = `Help me understand this documentation page about "${doc.title}" from GitReserve:\n\n${plainContent}`
  const encoded = encodeURIComponent(prompt)

  const chatgptLogo = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  )

  const claudeLogo = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M4.709 15.955l4.72-2.756.08-.046-.08-.139-2.139-3.704a.08.08 0 0 0-.139 0L2.432 17.18a.08.08 0 0 0 .07.12h4.07a.08.08 0 0 0 .069-.04l.07-.121zm8.377-.283H8.088a.08.08 0 0 0-.07.12l4.992 8.645a.08.08 0 0 0 .139 0l4.996-8.646a.08.08 0 0 0-.07-.12h-5.002zm4.56-1.107l4.72 2.756.069.04.07-.121 2.064-3.576a.08.08 0 0 0 0-.08L19.85.715a.08.08 0 0 0-.139 0l-2.064 3.576-.07.121.08.046 4.72 2.756a.08.08 0 0 1 0 .139l-4.72 2.756-.08.046.07.121 2.064 3.576a.08.08 0 0 1 0 .08l-2.064 3.576-.07.121-.069-.04-4.72-2.756a.08.08 0 0 0-.08 0l-4.72 2.756-.069.04-.07-.121-2.064-3.576a.08.08 0 0 1 0-.08l2.064-3.576.07-.121-.08-.046-4.72-2.756a.08.08 0 0 1 0-.139l4.72-2.756.08-.046-.07-.121L6.285 4.29a.08.08 0 0 1 0-.08L8.349.635a.08.08 0 0 1 .069-.04h4.998a.08.08 0 0 1 .07.04l4.996 8.647a.08.08 0 0 1 0 .08l-4.996 8.646a.08.08 0 0 1-.07.04H8.418a.08.08 0 0 1-.07-.04L4.14.715a.08.08 0 0 0-.139 0L1.938 4.29a.08.08 0 0 0 0 .08l4.719 8.175.07.121.069-.04 4.72-2.756a.08.08 0 0 1 .08 0l4.72 2.756" />
    </svg>
  )

  const options = [
    {
      label: "Open in ChatGPT",
      icon: chatgptLogo,
      color: "text-[#10a37f]",
      bg: "bg-[#10a37f]/10",
      href: `https://chat.openai.com/?q=${encoded}`,
    },
    {
      label: "Open in Claude",
      icon: claudeLogo,
      color: "text-[#d97757]",
      bg: "bg-[#d97757]/10",
      href: `https://claude.ai/new?q=${encoded}`,
    },
    {
      label: "View as Markdown",
      icon: <FileText className="h-3.5 w-3.5" />,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      action: () => {
        const blob = new Blob([doc.content.trim()], { type: "text/markdown" })
        const url = URL.createObjectURL(blob)
        window.open(url, "_blank")
      },
    },
    {
      label: "Copy as text",
      icon: <Copy className="h-3.5 w-3.5" />,
      color: "text-neutral-400",
      bg: "bg-neutral-500/10",
      action: () => {
        void navigator.clipboard.writeText(plainContent)
        setOpen(false)
      },
    },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 text-[12px] font-medium text-neutral-400 transition-all hover:text-white hover:border-neutral-700"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Ask AI</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-neutral-800 bg-neutral-950 p-1.5 shadow-2xl shadow-black/40 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600">Explain with</div>
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                if ("href" in opt && opt.href) {
                  window.open(opt.href, "_blank")
                } else if ("action" in opt && opt.action) {
                  opt.action()
                }
                setOpen(false)
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-neutral-300 transition-colors hover:bg-neutral-800/60 hover:text-white"
            >
              <div className={`flex h-6 w-6 items-center justify-center rounded-md ${opt.bg} ${opt.color}`}>
                {opt.icon}
              </div>
              {opt.label}
            </button>
          ))}
          <div className="mx-2 my-1.5 border-t border-neutral-800/60" />
          <div className="px-2.5 py-1 text-[10px] text-neutral-600">
            Sends this page's content to the selected AI
          </div>
        </div>
      )}
    </div>
  )
}

function DocsArticle({ doc }: { doc: DocSection }) {
  const currentIdx = DOCS.findIndex(d => d.slug === doc.slug)
  const prev = currentIdx > 0 ? DOCS[currentIdx - 1] : null
  const next = currentIdx < DOCS.length - 1 ? DOCS[currentIdx + 1] : null

  return (
    <article className="max-w-none">
      <div className="mb-6 flex items-center gap-2 text-[12px] text-neutral-600">
        <Link to="/docs" className="hover:text-neutral-400 transition-colors">Docs</Link>
        <ChevronRight className="h-3 w-3" />
        <span>{doc.category}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-400">{doc.title}</span>
      </div>

      <div>{renderMarkdown(doc.content)}</div>

      <div className="mt-16 flex items-center justify-between border-t border-neutral-800 pt-6">
        {prev ? (
          <Link to={`/docs/${prev.slug}`} className="group flex flex-col gap-1">
            <span className="text-[11px] text-neutral-600">Previous</span>
            <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">← {prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/docs/${next.slug}`} className="group flex flex-col gap-1 text-right">
            <span className="text-[11px] text-neutral-600">Next</span>
            <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{next.title} →</span>
          </Link>
        ) : <div />}
      </div>
    </article>
  )
}

function OnThisPage({ doc }: { doc: DocSection }) {
  const headings = getHeadings(doc.content)
  if (headings.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600">On this page</div>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="block text-[12px] text-neutral-500 hover:text-neutral-200 transition-colors py-0.5">{h.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DocsPage() {
  const { slug } = useParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!slug) {
    return <Navigate to="/docs/introduction" replace />
  }

  const doc = DOCS.find(d => d.slug === slug)

  if (!doc) {
    return <Navigate to="/docs/introduction" replace />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-800 bg-black/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-5">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1 rounded-md hover:bg-neutral-800 text-neutral-400">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="text-lg font-bold tracking-tight">GitReserve</Link>
            <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 border border-neutral-800 rounded px-2 py-0.5">Docs</span>
          </div>
          <div className="flex items-center gap-2">
            <AskAiDropdown doc={doc} />
            <Link to="/dashboard" className="text-[13px] text-neutral-400 hover:text-white transition-colors hidden sm:block">Dashboard</Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 border-r border-neutral-800 sticky top-[53px] h-[calc(100vh-53px)] overflow-y-auto p-5">
          <DocsSidebar current={slug} />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-20 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-[53px] bottom-0 w-64 border-r border-neutral-800 bg-neutral-950 p-5 overflow-y-auto">
              <DocsSidebar current={slug} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-3xl">
            <DocsArticle doc={doc} />
          </div>
        </main>

        {/* Right panel — On this page */}
        <aside className="hidden xl:block w-48 shrink-0 border-l border-neutral-800 sticky top-[53px] h-[calc(100vh-53px)]">
          <div className="p-5">
            <OnThisPage doc={doc} />
          </div>
        </aside>
      </div>
    </div>
  )
}

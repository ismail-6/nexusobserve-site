import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Code2,
  Download,
  Github,
  Menu,
  RadioTower,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { SiteLink } from "@/lib/navigation";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup">
      <svg
        className="nexus-mark"
        width="30"
        height="32"
        viewBox="0 0 30 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 23V8l6-4 12 16V4l6 5v15l-6 4L9 12v16l-6-5Z"
          fill="currentColor"
        />
        <path d="m3 8 6 4v16l-6-5V8Z" fill="currentColor" opacity=".5" />
      </svg>
      {!compact && (
        <span>
          Nexus<span className="brand-observe">Observe</span>
        </span>
      )}
    </span>
  );
}

const primaryLinks = [
  { href: "/product", label: "Platform" },
  { href: "/opentelemetry", label: "OpenTelemetry" },
  { href: "/industries", label: "Solutions" },
  { href: "/compare", label: "Compare" },
];
const resourceLinks = [
  {
    href: "/docs",
    label: "Documentation",
    icon: BookOpen,
    detail: "From first signal to production",
  },
  {
    href: "/guides",
    label: "Practical guides",
    icon: Code2,
    detail: "Build a better telemetry pipeline",
  },
  {
    href: "/downloads",
    label: "Downloads",
    icon: Download,
    detail: "Application and local agent",
  },
];

export function Header({ path }: { path: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [path]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <SiteLink href="/" className="brand" aria-label="NexusObserve home">
          <Brand />
        </SiteLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <SiteLink
              key={link.href}
              href={link.href}
              className={
                path.startsWith(link.href) ? "nav-link active" : "nav-link"
              }
              aria-current={path.startsWith(link.href) ? "page" : undefined}
            >
              {link.label}
            </SiteLink>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`nav-link resource-trigger ${/^\/(docs|guides|downloads)/.test(path) ? "active" : ""}`}
              >
                Resources <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="resource-menu">
              {resourceLinks.map(({ icon: Icon, ...link }) => (
                <DropdownMenuItem asChild key={link.href}>
                  <SiteLink href={link.href} className="resource-item">
                    <Icon size={18} />
                    <span>
                      <strong>{link.label}</strong>
                      <small>{link.detail}</small>
                    </span>
                    <ArrowRight size={14} />
                  </SiteLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="header-actions">
          <a
            className="github-link"
            href="https://github.com/nexusobserve/nexusobserve"
            target="_blank"
            rel="noreferrer"
            aria-label="NexusObserve on GitHub"
          >
            <Github size={18} />
          </a>
          <Button asChild size="sm" className="nav-cta">
            <SiteLink href="/downloads">
              Get started <ArrowRight size={14} />
            </SiteLink>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="mobile-menu-trigger"
                aria-label="Open navigation"
              >
                <Menu size={22} />
              </Button>
            </SheetTrigger>
            <SheetContent className="mobile-navigation">
              <SheetHeader>
                <SheetTitle>
                  <Brand />
                </SheetTitle>
                <SheetDescription>
                  Explore your observability workspace.
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile navigation">
                {[...primaryLinks, ...resourceLinks].map((link) => (
                  <SiteLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={
                      path.startsWith(link.href) ? "page" : undefined
                    }
                  >
                    {link.label}
                    <ArrowRight size={16} />
                  </SiteLink>
                ))}
              </nav>
              <Button asChild>
                <SiteLink
                  href="/downloads"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started <ArrowRight size={16} />
                </SiteLink>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer section-frame">
      <div className="footer-main">
        <div className="footer-brand">
          <SiteLink href="/" className="brand">
            <Brand />
          </SiteLink>
          <p>
            See your systems clearly.
            <br />
            Keep your telemetry close.
          </p>
          <a
            href="https://github.com/nexusobserve/nexusobserve"
            target="_blank"
            rel="noreferrer"
            className="footer-github"
          >
            <Github size={16} /> Built in the open <ArrowRight size={13} />
          </a>
        </div>
        <div className="footer-column">
          <span>Platform</span>
          {primaryLinks.map((link) => (
            <SiteLink key={link.href} href={link.href}>
              {link.label}
            </SiteLink>
          ))}
        </div>
        <div className="footer-column">
          <span>Build with NexusObserve</span>
          {resourceLinks.map((link) => (
            <SiteLink key={link.href} href={link.href}>
              {link.label}
            </SiteLink>
          ))}
          <SiteLink href="/docs/mcp">MCP integration</SiteLink>
        </div>
        <div className="footer-column">
          <span>Start here</span>
          <SiteLink href="/docs/quickstart">Quick start</SiteLink>
          <SiteLink href="/docs/production">Production deployment</SiteLink>
          <SiteLink href="/docs/agent">Native agent</SiteLink>
          <SiteLink href="/opentelemetry/sources">Data sources</SiteLink>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NexusObserve</span>
        <span>
          <RadioTower size={13} /> Open standards. Your infrastructure.
        </span>
        <span>Made for production.</span>
      </div>
    </footer>
  );
}

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Code2,
  Cpu,
  Download,
  Menu,
  Moon,
  Puzzle,
  RadioTower,
  Sun,
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
  { href: "/industries", label: "Solutions" },
  { href: "/compare", label: "Compare" },
];
const platformLinks = [
  {
    href: "/agents",
    label: "Agent-based collection",
    icon: Cpu,
    detail: "Fetch signals directly from your systems",
  },
  {
    href: "/plugins",
    label: "Plugin catalog",
    icon: Puzzle,
    detail: "Native samplers for your production estate",
  },
  {
    href: "/opentelemetry",
    label: "OpenTelemetry",
    icon: RadioTower,
    detail: "Connect and manage open telemetry pipelines",
  },
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
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", darkMode ? "#171717" : "#ffffff");
    try {
      localStorage.setItem("nexusobserve-theme", darkMode ? "dark" : "light");
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
  }, [darkMode]);
  useEffect(() => setMobileOpen(false), [path]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <SiteLink href="/" className="brand" aria-label="NexusObserve home">
          <Brand />
        </SiteLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryLinks.map((link) =>
            link.href === "/product" ? (
              <div className="platform-nav" key={link.href}>
                <SiteLink
                  href="/product"
                  className={
                    path === "/product" ||
                    platformLinks.some((item) => path.startsWith(item.href))
                      ? "nav-link active"
                      : "nav-link"
                  }
                  aria-current={path === "/product" ? "page" : undefined}
                >
                  Platform
                </SiteLink>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="nav-link platform-menu-trigger"
                      aria-label="Explore platform"
                    >
                      <ChevronDown size={12} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="resource-menu platform-menu"
                  >
                    {platformLinks.map(({ icon: Icon, ...item }) => (
                      <DropdownMenuItem asChild key={item.href}>
                        <SiteLink href={item.href} className="resource-item">
                          <Icon size={18} />
                          <span>
                            <strong>{item.label}</strong>
                            <small>{item.detail}</small>
                          </span>
                          <ArrowRight size={14} />
                        </SiteLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
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
            ),
          )}
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
          <Button
            variant="outline"
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-pressed={darkMode}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            <span>{darkMode ? "Light" : "Dark"}</span>
          </Button>
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
                {[
                  primaryLinks[0],
                  ...platformLinks,
                  ...primaryLinks.slice(1),
                  ...resourceLinks,
                ].map((link) => (
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
        </div>
        <div className="footer-column">
          <span>Platform</span>
          {platformLinks.map((link) => (
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
          <SiteLink href="/docs/agent">Agent setup</SiteLink>
          <SiteLink href="/docs/plugins">Plugin setup</SiteLink>
          <SiteLink href="/industries">Solutions</SiteLink>
          <SiteLink href="/compare">Compare platforms</SiteLink>
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

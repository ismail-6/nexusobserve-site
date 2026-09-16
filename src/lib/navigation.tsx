import { forwardRef, type AnchorHTMLAttributes } from "react";

export function goTo(href: string) {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new Event("site:navigate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}

export const SiteLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ href = "/", onClick, ...props }, ref) => (
  <a
    ref={ref}
    href={href}
    {...props}
    onClick={(event) => {
      onClick?.(event);
      if (
        !event.defaultPrevented &&
        href.startsWith("/") &&
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey &&
        props.target !== "_blank" &&
        !props.download
      ) {
        event.preventDefault();
        goTo(href);
      }
    }}
  />
));
SiteLink.displayName = "SiteLink";

import type { AnchorHTMLAttributes } from "react";
import { Link as RouterLink } from "react-router-dom";

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

// Internal paths use client-side routing; external URLs, hash links, mailto: and tel: render a plain anchor.
const isInternalPath = (href: string) => href.startsWith("/") && !href.startsWith("//");

const Link = ({ href, children, ...rest }: LinkProps) => {
  if (isInternalPath(href)) {
    return (
      <RouterLink to={href} {...rest}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
};

export default Link;

import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { siteConfig } from "@/src/lib/seo/metadata";

interface PageMetaProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function PageMeta({ title, description, children }: PageMetaProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    const pageUrl = new URL(pathname, siteConfig.url).href;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    for (const [attribute, name, content] of [
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:url", pageUrl],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
    ]) {
      let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    }
  }, [title, description, pathname]);

  return <>{children}</>;
}

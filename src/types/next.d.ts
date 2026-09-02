declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      siteName?: string;
      type?: string;
      locale?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
    };
  }
}

declare module 'next/navigation' {
  export function useSearchParams(): URLSearchParams;
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
  };
  export function usePathname(): string;
}

declare module 'next/link' {
  import React from 'react';
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
  }
  const Link: React.FC<LinkProps>;
  export default Link;
}

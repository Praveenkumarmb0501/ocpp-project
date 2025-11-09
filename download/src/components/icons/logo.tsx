import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22v-4" />
      <path d="M18 14v-4" />
      <path d="M6 14v-4" />
      <path d="M18 10V8c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2" />
      <path d="M12 2v2" />
      <path d="M7 4h.01" />
      <path d="M17 4h.01" />
    </svg>
  );
}

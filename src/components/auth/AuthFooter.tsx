import Link from "next/link";
import React from "react";

type AuthFooterProps = {
  href: string;
  text: string;
  linkText: string;
};

export default function AuthFooter({ href, text, linkText }: AuthFooterProps) {
  return (
    <div>
      <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-4">
        {text}{" "}
        <Link
          href={href}
          className="font-medium hover:underline text-slate-600 dark:text-slate-300"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
}

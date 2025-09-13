import Logo from "@/../public/logo.svg";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 md:p-6">
      <Link
        href="/"
        className="absolute top-0 left-0 flex items-center ml-6 mt-6 gap-2 hover:gap-3 rounded-full"
      >
        <ArrowLeftIcon />
        <span className="scale-0 md:scale-100">Back to Home</span>
      </Link>
      <Logo className="fill-foreground size-14 md:size-16 mb-4" />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default Layout;

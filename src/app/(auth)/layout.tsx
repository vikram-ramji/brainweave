import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 md:p-6">
      <Image
        src={"/logo.svg"}
        alt="Logo"
        width={60}
        height={65}
        className="mb-4"
      />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default Layout;

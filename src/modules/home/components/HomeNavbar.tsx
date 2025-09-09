import {
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
} from "@/components/ui/resizable-navbar";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

function HomeNavbar() {
  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <NavbarButton href="/sign-in">Sign In</NavbarButton>
            <ThemeToggleButton />
          </div>
        </NavBody>
      </Navbar>
    </div>
  );
}

export default HomeNavbar;

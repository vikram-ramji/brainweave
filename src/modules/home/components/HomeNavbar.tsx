"use client";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
} from "@/components/ui/resizable-navbar";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useState } from "react";

function HomeNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Menu */}
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <NavbarButton href="/sign-in">Sign In</NavbarButton>
            <ThemeToggleButton />
          </div>
        </NavBody>

        {/* Mobile Menu */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center w-full justify-start gap-4">
              <NavbarButton
                href="/sign-in"
                className="w-full text-center text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </NavbarButton>
              <ThemeToggleButton />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default HomeNavbar;

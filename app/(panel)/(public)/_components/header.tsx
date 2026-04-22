"use client";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isOpen, setOpen] = useState(false); // State to manage the mobile menu

  const session = null; // Placeholder for session management

  const navItems = [{ href: "#profissionais", label: "Profissionais" }];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          onClick={() => setOpen(false)}
          key={item.href}
          asChild
          className="bg-transparent hover:bg-transparent text-black shadow-none"
        >
          <Link href={item.href} className="text-base">
            {item.label}
          </Link>
        </Button>
      ))}

      {session ? (
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2"
        >
          <LogIn />
          Acessar Clinica
        </Link>
      ) : (
        <Button>
          <LogIn />
          Portal da Clinica
        </Button>
      )}
    </>
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-[999] bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-bold text-zinc-900 tracking-tight"
        >
          Odonto<span className="text-emerald-500">PRO</span>
        </Link>

        <nav className="hidden items-center md:flex space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              className="text-black hover:bg-transparent px-6 font-semibold"
              size="icon"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[240px] sm:w-[300px] z-[9999]"
          >
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Veja nossos links</SheetDescription>

            <nav className="flex flex-col space-y-4 mt-6">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

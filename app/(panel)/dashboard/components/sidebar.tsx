"use client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Folder,
  List,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { requestFormReset } from "react-dom";
import Image from "next/image";
import logoImg from "../../../../public/logo-odonto.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SidebarDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-0">
      <aside
        className={clsx(
          "flex flex-col bg-background border-r transition-all duration-300 p-4 h-full",
          {
            "w-20": isCollapsed,
            "w-64": !isCollapsed,
            "hidden md:flex md:fixed": true,
          },
        )}
      >
        <div className="mb-6 mt-4">
          {!isCollapsed && (
            <Image
              src={logoImg}
              alt="Logo OdontoPro"
              priority
              quality={100}
              style={{ width: "auto", height: "auto" }}
            />
          )}
        </div>

        <Button
          className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="mr-2 h-12 w-12" />
          ) : (
            <ChevronLeft className="mr-2 h-12 w-12" />
          )}
        </Button>

        {isCollapsed && (
          <nav className="flex flex-col gap-1 overflow-hidden">
            <SidebarLink
              href="/dashboard"
              icon={<CalendarCheck2 className="w-6 h-6" />}
              label="Agendamentos"
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
            <SidebarLink
              href="/dashboard/services"
              icon={<Folder className="w-6 h-6" />}
              label="Serviços"
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
            <SidebarLink
              href="/dashboard/profile"
              icon={<Settings className="w-6 h-6" />}
              label="Perfil"
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
            <SidebarLink
              href="/dashboard/plans"
              icon={<Banknote className="w-6 h-6" />}
              label="Planos"
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
          </nav>
        )}

        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">
              <span className="text-sm text-zinc-400 font-medium mt-1 uppercase">
                Painel
              </span>
              <SidebarLink
                href="/dashboard"
                icon={<CalendarCheck2 className="w-6 h-6" />}
                label="Agendamentos"
                pathname={pathname}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/dashboard/services"
                icon={<Folder className="w-6 h-6" />}
                label="Serviços"
                pathname={pathname}
                isCollapsed={isCollapsed}
              />
              <span className="text-sm text-zinc-400 font-medium mt-1 uppercase">
                Configurações
              </span>
              <SidebarLink
                href="/dashboard/profile"
                icon={<Settings className="w-6 h-6" />}
                label="Perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/dashboard/plans"
                icon={<Banknote className="w-6 h-6" />}
                label="Planos"
                pathname={pathname}
                isCollapsed={isCollapsed}
              />
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </aside>
      <div
        className={clsx("flex flex-1 flex-col transition-all duration-300", {
          "md:ml-20": isCollapsed,
          "md:ml-64": !isCollapsed,
        })}
      >
        <header className="md:hidden flex items-center justify-between border-b px-4 md:px-6 h-14 z-10 sticky top-0 bg-white">
          <Sheet>
            <div className="flex items-center gap-4">
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <h1 className="text-base md:text-lg font-semibold">
                Menu OdontoPro
              </h1>
            </div>
            <SheetContent side="right" className="sm:max-w-xs text-black">
              <SheetTitle>OdontoPro</SheetTitle>
              <SheetDescription>Menu administrarivo</SheetDescription>
              <nav className="grid gap-2 text-base pt-5">
                <SidebarLink
                  href="/dashboard"
                  icon={<CalendarCheck2 className="w-6 h-6" />}
                  label="Agendamentos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                />

                <SidebarLink
                  href="/dashboard/services"
                  icon={<Folder className="w-6 h-6" />}
                  label="Serviços"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                />
                <SidebarLink
                  href="/dashboard/profile"
                  icon={<Settings className="w-6 h-6" />}
                  label="Perfil"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                />
                <SidebarLink
                  href="/dashboard/plans"
                  icon={<Banknote className="w-6 h-6" />}
                  label="Planos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 py-4 px-2 md:p-6">{children}</main>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
}

function SidebarLink({
  href,
  icon,
  label,
  pathname,
  isCollapsed,
}: SidebarLinkProps) {
  return (
    <Link href={href}>
      <div
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-md  transition-colors",
          {
            "text-white bg-blue-500": pathname === href,
            "text-gray-700 hover:bg-gray-100": pathname !== href,
          },
        )}
      >
        <span className="w-6 h-6">{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Link>
  );
}

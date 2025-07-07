'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button/index";
import Image from "next/image";
import Link from "next/link";
import MenuNavbar from "./menu";
import { Menu, X } from "lucide-react";
import { useAuthContext } from "@/contexts/auth";
import { useAuthLogic } from "@/hooks/useAuthLogic"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { isLoggedIn, userInfo, isLoadingAuth } = useAuthContext()
  const { logout } = useAuthLogic()

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
  };

  return (
    <nav className="w-full">
      <div className="max-w-screen-xl mx-auto py-3 flex items-center justify-between">
        <Link href="/">
          <Image
            width={150}
            height={33}
            src="/logo.png"
            sizes="150px"
            alt="Logo"
          />
        </Link>

        {/* Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop */}
        <div className="hidden md:flex flex-1 justify-center">
          <MenuNavbar />
        </div>

        {isLoadingAuth ? (
          <></>
          // <div className="hidden md:flex items-center">Carregando...</div>
        ) : isLoggedIn ? (
          <>
            {userInfo?.name && (
              <p className="text-dark-gray">Olá, {userInfo.name}!</p>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-black rounded hover:text-red hover:cursor-pointer"
            >
              Sair
            </button>
          </>
        ) : (
          // Login/Signin
          <div className="flex gap-2 items-center">
            <Link href="/login">login</Link>
            <Link href="/signin">
              <Button>cadastro</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <MenuNavbar />
        </div>
      )}
    </nav>
  );
}

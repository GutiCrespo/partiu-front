"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingAnimation from "@/components/loadingAnimation";

export function NavigationTransitionLoader() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    // Quando a rota muda, ativa o loading
    setIsActive(true);

    // Mantém o loading visível por um tempinho
    const timeout = setTimeout(() => {
      setIsActive(false);
    }, 400); // ajusta se quiser mais ou menos tempo

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <LoadingAnimation />
    </div>
  );
}
"use client";

import { usePathname } from "next/navigation";
import PageWind from "@/components/PageWind";

export default function HomeOnlyWind() {
  const pathname = usePathname();

  
  if (pathname !== "/") return null;

  return <PageWind />;
}
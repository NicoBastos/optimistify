"use client";

// import { SunrayAnimationProvider, useSunrayAnimation } from "@/context/SunrayAnimationContext";
// import SunrayAnimation from "@/components/SunrayAnimation";
// function SunrayAnimationGlobal() {
// const { showSunrays } = useSunrayAnimation();
// return <SunrayAnimation show={showSunrays} />;
// }

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
} 
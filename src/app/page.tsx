"use client";

import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center space-y-8 px-4">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Optimistify
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Transform negative thoughts into positive perspectives with the power of AI. 
          Start your journey to a more optimistic mindset today.
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={() => router.push('/app')}
        >
          Start Your Optimistic Journey
        </Button>
      </div>
    </div>
  );
}

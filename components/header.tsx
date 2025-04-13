"use client"

import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="font-semibold text-lg">Minimalist Blog/Journal</div>
        <ModeToggle />
      </div>
    </header>
  )
}


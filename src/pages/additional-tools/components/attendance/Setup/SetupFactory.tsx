"use client"

import { useState, useEffect } from "react"
import { SetupDesktop } from "./SetupDesktop"
import { SetupMobile } from "./SetupMobile"

interface SetupFactoryProps {
  onNext: () => void
  onClear: () => void
}

export function SetupFactory(props: SetupFactoryProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) {
    return <SetupMobile {...props} />
  }

  return <SetupDesktop {...props} />
}

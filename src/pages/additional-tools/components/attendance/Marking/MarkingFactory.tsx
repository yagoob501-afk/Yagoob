"use client"

import { useState, useEffect } from "react"
import { MarkingDesktop } from "./MarkingDesktop"
import { MarkingMobile } from "./MarkingMobile"

interface MarkingFactoryProps {
  lessonId: string
  onSave: () => void
  onBack: () => void
}

export function MarkingFactory(props: MarkingFactoryProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) {
    return <MarkingMobile {...props} />
  }

  return <MarkingDesktop {...props} />
}

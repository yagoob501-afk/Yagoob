"use client"

import { useState, useEffect } from "react"
import { SelectionDesktop } from "./SelectionDesktop"
import { SelectionMobile } from "./SelectionMobile"

interface SelectionFactoryProps {
  onSelectLesson: (id: string) => void
  onBack: () => void
}

export function SelectionFactory(props: SelectionFactoryProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) {
    return <SelectionMobile {...props} />
  }

  return <SelectionDesktop {...props} />
}

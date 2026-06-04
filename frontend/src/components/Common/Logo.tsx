import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
}

export function Logo({
  variant = "full",
  className,
  asLink = true,
}: LogoProps) {
  const wordmark = (
    <div className={cn("flex flex-col", className)}>
      <span className="font-[Fraunces] text-[1.6rem] leading-none tracking-[-0.04em] text-[#f7f2e8]">
        TaniLink
      </span>
    </div>
  )

  const content =
    variant === "responsive" ? (
      <div className="group-data-[collapsible=icon]:hidden">{wordmark}</div>
    ) : variant === "full" ? (
      wordmark
    ) : (
      wordmark
    )

  if (!asLink) {
    return content
  }

  return <Link to="/">{content}</Link>
}

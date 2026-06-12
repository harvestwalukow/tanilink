import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
  tone?: "light" | "dark"
  to?: "/" | "/app"
}

export function Logo({
  variant = "full",
  className,
  asLink = true,
  tone = "light",
  to = "/",
}: LogoProps) {
  const wordmark = (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn(
          'font-[Fraunces] text-[1.6rem] leading-none tracking-[-0.04em]',
          tone === "light" ? "text-[#f7f2e8]" : "text-[#24473b]",
        )}
      >
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

  return <Link to={to}>{content}</Link>
}

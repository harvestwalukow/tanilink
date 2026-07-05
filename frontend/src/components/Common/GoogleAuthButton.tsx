import { useEffect, useRef } from "react"

import useAuth from "@/hooks/useAuth"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: { credential?: string }) => void
            use_fedcm_for_button?: boolean
          }) => void
          renderButton: (
            element: HTMLElement,
            options: {
              locale?: string
              shape?: string
              size?: string
              text?: string
              theme?: string
              width?: string
            },
          ) => void
        }
      }
    }
  }
}

function GoogleLogo() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}

function GoogleButtonLabel() {
  return (
    <span className="flex items-center gap-2">
      <GoogleLogo />
      Lanjutkan dengan Google
    </span>
  )
}

export function GoogleAuthButton() {
  const { googleLoginMutation } = useAuth()
  const googleLoginMutate = googleLoginMutation.mutate
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!googleClientId || !buttonRef.current) return

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) return
      const hostElement = buttonRef.current
      const buttonWidth = Math.max(
        240,
        Math.floor(hostElement.getBoundingClientRect().width),
      )
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response.credential) {
            googleLoginMutate(response.credential)
          }
        },
        use_fedcm_for_button: true,
      })
      hostElement.innerHTML = ""
      window.google.accounts.id.renderButton(hostElement, {
        locale: "id",
        shape: "pill",
        size: "large",
        text: "continue_with",
        theme: "outline",
        width: String(buttonWidth),
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    )
    if (existingScript) {
      renderGoogleButton()
      existingScript.addEventListener("load", renderGoogleButton, { once: true })
      return () => existingScript.removeEventListener("load", renderGoogleButton)
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.addEventListener("load", renderGoogleButton, { once: true })
    document.head.appendChild(script)
    return () => script.removeEventListener("load", renderGoogleButton)
  }, [googleClientId, googleLoginMutate])

  if (googleClientId) {
    return (
      <div className="relative h-12 w-full overflow-hidden rounded-full border border-[#d8ccb7] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-sm font-medium text-[#17352b]"
          aria-hidden="true"
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            <GoogleLogo />
          </div>
          Lanjutkan dengan Google
        </div>
        <div
          ref={buttonRef}
          className="absolute inset-0 opacity-0"
          aria-busy={googleLoginMutation.isPending}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled
      title="Set VITE_GOOGLE_CLIENT_ID untuk mengaktifkan Google OAuth."
      className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d8ccb7] bg-[#fffaf2] px-4 text-sm font-medium text-[#8d8478]"
    >
      <GoogleButtonLabel />
    </button>
  )
}

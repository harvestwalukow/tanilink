import { Logo } from "@/components/Common/Logo"
import { Footer } from "./Footer"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-shell grid min-h-svh bg-[linear-gradient(180deg,#fffdf8_0%,#f6eddc_100%)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-[#e7dbc8] bg-[linear-gradient(160deg,#24473b_0%,#17352b_58%,#10241d_100%)] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,174,103,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(108,143,65,0.18),transparent_30%)]" />
        <div className="relative px-10 py-8">
          <Logo variant="full" tone="light" asLink={false} />
        </div>
        <div className="relative flex flex-1 items-center px-10 pb-12">
          <div className="flex w-full max-w-xl flex-col gap-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[30px] border border-white/10 bg-white/8 p-5 text-[#f7f2e8]">
                <p className="text-sm text-[#d7e1d6]">Rekomendasi utama</p>
                <p className="pt-3 text-2xl font-semibold">Padi dan jagung</p>
                <p className="pt-4 text-sm leading-7 text-[#e8eee5]">
                  Cocok untuk kondisi lahan aktif dan curah hujan sedang.
                </p>
              </div>
              <div className="rounded-[30px] border border-white/10 bg-[#f7f2e8] p-5 text-[#17352b]">
                <p className="text-sm text-[#6d705c]">Harga panen</p>
                <p className="pt-3 text-2xl font-semibold">Rp5.450/kg</p>
                <div className="mt-4 flex items-end gap-2">
                  {[40, 62, 54, 78, 70].map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className="block flex-1 rounded-full bg-[#c98a4b]"
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex items-center">
          <Logo variant="full" tone="dark" className="lg:hidden" />
        </div>
        <div className="flex flex-1 items-start justify-center pt-8 md:pt-10 lg:items-center lg:pt-0">
          <div className="w-full max-w-md rounded-[32px] border border-[#eadfcd] bg-white p-8 text-[#17352b] shadow-[0_24px_60px_rgba(197,174,131,0.18)]">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

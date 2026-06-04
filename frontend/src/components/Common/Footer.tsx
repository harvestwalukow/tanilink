export function Footer() {
  return (
    <footer className="border-t border-[#d7ccb9]/70 bg-[#fffaf1]/85 px-6 py-4 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-[#5f5b52]">© 2025 TaniLink · V1.2.0</p>
        <div className="flex items-center gap-2 text-sm text-[#8b7558]">
          <span className="rounded-full bg-[#f1e8d7] px-3 py-1">
            Dummy data only
          </span>
          <span className="rounded-full bg-[#e3efe8] px-3 py-1 text-[#2f5d50]">
            East Java focus
          </span>
        </div>
      </div>
    </footer>
  )
}

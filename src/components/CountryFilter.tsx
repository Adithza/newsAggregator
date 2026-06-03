"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

const COUNTRIES = [
  { code: "", label: "All" },
  { code: "us", label: "US" },
  { code: "gb", label: "UK" },
  { code: "in", label: "India" },
] as const

function CountryFilter() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get("country") ?? ""

  function hrefFor(code: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (code) params.set("country", code)
    else params.delete("country")
    const q = params.toString()
    return q ? `${pathname}?${q}` : pathname
  }

  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-3 sm:px-12 justify-start w-full bg-gray-950">
      {COUNTRIES.map(({ code, label }) => {
        const isActive = active === code
        return (
          <Link
            key={code || "all"}
            href={hrefFor(code)}
            className={`
              px-2 md:px-4 py-1.5 rounded-sm text-sm font-medium whitespace-nowrap transition-all duration-200
              ${isActive ? "text-blue-600" : "text-white hover:text-blue-400"}
            `}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}

export default CountryFilter

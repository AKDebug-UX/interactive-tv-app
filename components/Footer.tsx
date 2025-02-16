"use client"

import Image from "next/image"

export default function Footer() {
  return (
    <div className="flex items-end justify-start mt-12 space-x-8">
      <div className="w-32 h-32 relative flex items-center justify-center">
        <Image src={`img/CiS_Badge.png`} alt="Dice Face" fill className="" />
      </div>
      <div className="flex w-full items-end justify-between space-x-8">
        <span className="text-6xl text-[#1a237e] font-bold">EXERCISE &apos;ROGER SO FAR&apos;</span>
        <div className="w-[270px] h-20 relative">
          <Image src={`img/CiS_ACF_CCF_Banner_Kings_Crown.png`} alt="Dice Face" fill className="" />
        </div>
      </div>
    </div>
  )
}


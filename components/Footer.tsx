"use client"

import Image from "next/image"

export default function Footer() {
  return (
    <div className="flex items-center justify-between mt-12">
      <div className="flex items-end space-x-8">
        <div className="w-32 h-32 relative flex items-center justify-center">
          <Image src={`img/CiS_Badge.png`} alt="Dice Face" fill className="" />
        </div>
        <span className="text-6xl font-bold">EXERCISE &apos;ROGER SO FAR&apos;</span>
      </div>
      <div className="w-[300px] h-32 relative flex items-center justify-center">
        <Image src={`img/CiS_ACF_CCF_Banner_Kings_Crown.png`} alt="Dice Face" fill className="" />
      </div>
    </div>
  )
}


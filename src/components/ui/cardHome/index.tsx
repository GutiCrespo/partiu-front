'use client'
import { useState } from "react"
import Image from "next/image"

type Props = {
  position?: string,
}

export default function CardHome({ position = "0" }: Props) {
  const [photos] = useState([
    "/group_planner.png",
    "/organised_in_days.png",
    "/integrated_map.png"
  ])

  const photoSelected = photos[parseInt(position)]

  return (
    <div className="Card bg-light-gray flex items-center justify-center flex-col gap-1.5 px-2 py-3 rounded-xl mx-4">
      <Image
        width={345}
        height={305}
        src={photoSelected}
        alt="Imagem do recurso"
        className="max-w-[40%]"
      />
      <p className="bold">Planejamento em grupo</p>
      <p>Convide amigos e monte o roteiro juntos, sem stress.</p>
    </div>
  )
}

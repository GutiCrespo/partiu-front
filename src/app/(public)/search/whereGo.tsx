'use client'

import { Button } from "@/components/ui/button/index";
import CardPlace from "@/components/ui/cardPlaceHor";
import { useState } from "react";

export default function WhereGoSection() {

    const city = "Ribeirão Preto"

    const [showAllCards, setShowAllCards] = useState(false)

    function toggleCards(){
        setShowAllCards(!showAllCards)
    }

    const cards = Array.from({length: 6}).map((_, i) => <CardPlace key={i}/>)

    return (
        <section className="explore-o-brasil w-full">
            <div className="">
                <h3 className="text-base">Onde ir em: <span className="text-blue">{city}</span></h3>
            </div>
            <div className="sections">

                <div className="cards md:grid md:grid-cols-3">
                    {showAllCards ? cards : cards.slice(0, 3)}
                </div>
            <div className="w-full flex justify-center md:gap-4 md:items-center hover:underline hover:cursor-pointer" onClick={toggleCards}>
                <Button onClick={toggleCards}>
                    {showAllCards ? 'ver menos' : 'ver mais'}
                </Button>

            </div>
            </div>
        </section>
    )
}

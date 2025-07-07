'use client'

import CardPlace from "@/components/ui/cardPlace";
import { useState } from "react";

export default function ExploreSection() {

    const [showAllCards, setShowAllCards] = useState(false)

    function toggleCards(){
        setShowAllCards(!showAllCards)
    }

    const cards = Array.from({length: 6}).map((_, i) => <CardPlace key={i}/>)

    return (
        <section className="explore-o-brasil w-full">
            <div className="">
                <h3 className="text-base">Explore o Brasil</h3>
            </div>
            <div className="sections">
                {/* mobile */}
                <div className="cards flex gap-4 
                                overflow-x-auto scroll-smooth
                                md:hidden
                                ">
                    {cards}
                </div>

                {/* desktop */}
                <div className="hidden cards md:grid md:grid-cols-3">
                    {showAllCards ? cards : cards.slice(0, 3)}
                </div>
            <div className="hidden w-full md:flex md:justify-between md:gap-4 md:items-center hover:underline hover:cursor-pointer" onClick={toggleCards}>
                <div className="h-[1px] w-1/3 bg-black"></div>
                <a onClick={toggleCards}>
                    {showAllCards ? 'ver menos' : 'ver mais'}
                </a>
                <div className="h-[1px] w-1/3 bg-black"></div>
            </div>
            </div>
        </section>
    )
}

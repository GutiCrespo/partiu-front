'use client'

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";
import ExploreSection from "./explore";
import WhereGoSection from "./whereGo";
import Maps from "@/components/ui/google-map";
import Autocomplete from "@/components/ui/autocomplete-places";


export default function SearchDestination() {

    const [searchValue, setSearchValue] = useState("")

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value)
    }

    const [destination, setDestination] = useState<string>('');
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [placeId, setPlaceId] = useState<string>('');  

    const handleCoordinates = (address: string, lat: number, lng: number, placeID: string) => {
        setDestination(address);
        setLatitude(lat);
        setLongitude(lng);
        setPlaceId(placeID); 
        
    };

    return (
        <main className="flex flex-col gap-6 h-screen">
            <section className="flex flex-col items-center gap-4">
                <Image
                    width={130}
                    height={33}
                    src="/search_group.svg"
                    alt="Grupo de amigos Planejando"
                    className=""
                />
                <h2>Onde iremos hoje?</h2>
                
                {/* <Input
                    type="text"
                    isSearchBox
                    name="destination"
                    id="destination"
                    className="w-fit "
                    onChange={handleChange}
                    value={searchValue}
                /> */}

            <Autocomplete placeholder="Pesquiser por cidade, país ou até mesmo ponto turístico" handleCoordinates={handleCoordinates}/>
        
            <Maps latitude={latitude} longitude={longitude} />

            </section>

            {/* <ExploreSection/>
            <WhereGoSection/> */}
        </main>
    )
}
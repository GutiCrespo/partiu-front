import Image from "next/image";

export default function CardViagemHorizontal() {
    const placeName = "Jardim Botânico Jardim BotânicoJardim BotânicoJardim BotânicoJardim BotânicoJardim Botânico";
    const placePhoto = "/mockup/place.png";
    const placeRating = "4,7";
    const placeLocation = "Curitiba, centro";

    return (
        <div className="bg-white w-full flex p-4 gap-2 rounded-lg h-[130px] md:h-[145px] lg:h-[145px] overflow-hidden">
            <div className="relative aspect-square w-[85px] md:w-[100px] lg:w-[115px] shrink-0">
                <Image
                    src={placePhoto}
                    alt="foto local"
                    fill
                    priority
                    sizes="(max-width: 768px) 85px, (max-width: 1024px) 100px, 115px"
                    className="rounded-lg shadow-md hover:shadow-lg 
                            hover:scale-[103%] hover:cursor-pointer transition duration-150 ease-in-out
                            object-cover"
                />
            </div>
            <div className="flex flex-col justify-between w-full">
                <p className="font-semibold text-sm line-clamp-2">{placeName}</p>

                <div className="Rating flex items-center gap-1 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#866969" d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"/>
                    </svg>
                    <p className="text-normal-gray">{placeRating}</p>
                </div>

                <div className="Location flex items-center gap-1 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                        <path fill="#866969" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"/>
                    </svg>
                    <p className="text-normal-gray">{placeLocation}</p>
                </div>
            </div>
        </div>
    );
}

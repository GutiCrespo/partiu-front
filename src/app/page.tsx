import { Button } from "@/components/ui/button/index";
import Image from "next/image";
import Link from "next/link";
// import CardHome from "@/components/ui/cardHome";
// import Playground from "../../playground";

export default function Home() {

  const cardCSS = "Card bg-light-gray flex items-center justify-center flex-col gap-1.5 px-2 py-3 rounded-xl mx-4 w-full"

  return (
    
    <main className="flex flex-col items-center justify-between gap-6 md:gap-0 md:flex-row "> 
        {/* <Playground/> */}

        <div className="flex flex-col md:flex-row md:justify-around max-w-6xl gap-6 md:gap-0">
          <header className="flex flex-col items-center text-center gap-4">
            <h1 className="max-w-96 md:max-w-2xl md:px-12">Planeje sua viagem <span className="text-red">sem dores</span> ou <span className="text-blue">incômodos</span></h1>
            <p className="max-w-96 md:max-w-2xl w-2/3">Crie seu roteiro, compartilhe com quem você quiser e <span className="text-blue font-bold">Partiu!</span> Aproveite sua viagem.</p>
            <Image 
              width={360} 
              height={325} 
              src="/header_globe.png" 
              alt="Globe Image" 
              className="max-w-[40%] w-auto"
            />
            <Link href={`/search`}>
              <Button >explorar destinos</Button>
            </Link>
          </header>

          <section className="flex flex-col justify-center items-center text-center gap-4 max-w-sm">

            {/* <CardHome position="0"/> */}
            <div className={cardCSS}>
              <Image
                width={345} 
                height={305} 
                src="/group_planner.png" 
                alt="Mulher marcando como concluido um quadrado." 
                className="max-w-[40%]"
              />
              <p className="bold"> Planejamento em grupo</p>
              <p className="">Convide amigos e monte o roteiro juntos, sem stress.</p>
            </div>
            <div className={cardCSS}>
              <Image
                width={75} 
                height={150} 
                src="/organised_in_days.png" 
                alt="Um mapa com várias setas apontando para um coração que está ao centro." 
                className="max-w-[40%]"
              />
              <p className="bold">Roteiros organizados por dia</p>
              <p className="">Crie uma linha do tempo das melhores opções para seu dia.</p>
            </div>
            <div className={cardCSS}>
              <Image
                width={170} 
                height={900} 
                src="/integrated_map.png" 
                alt="Um grupo de amigos planejando" 
                className="max-w-[40%]"
              />
              <p className="bold">Mapa integrado com locais</p>
              <p className="">Adicione lugares direto do mapa com dados reais da cidade.</p>
            </div>
          </section>
        </div>
      </main>
    );
}

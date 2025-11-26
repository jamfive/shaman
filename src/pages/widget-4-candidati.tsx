import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Lista {
  pos: number;
  desc_lis_c: string;
  img_lis_c: string;
  voti: number;
  perc: string;
  seggi: number;
}

interface Candidate {
  cogn: string;
  nome: string;
  d_nasc: number;
  l_nasc: string;
  pos: number;
  voti: number;
  perc: string;
  tot_vot_lis: number;
  perc_lis: string;
  liste: Lista[];
}

interface ScrutiniData {
  int: {
    ele_t: number;
    vot_t: number;
    perc_vot: string;
    sz_tot: number;
    sz_cons: number;
  };
  cand: Candidate[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
    }
  },
};

const Widget4CandidatiPage: React.FC = () => {
  const [topCandidates, setTopCandidates] = useState<Candidate[]>([]);
  const [sezioniScrutinate, setSezioniScrutinate] = useState<number>(0);
  const [sezioniTotali, setSezioniTotali] = useState<number>(0);

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`/data/scrutini-puglia.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((data: ScrutiniData) => {
        // Ordina per voti decrescente e prendi i primi 4
        const sorted = [...data.cand].sort((a, b) => b.voti - a.voti).slice(0, 4);
        setTopCandidates(sorted);
        setSezioniScrutinate(data.int.sz_cons || 0);
        setSezioniTotali(data.int.sz_tot || 0);
      })
      .catch((error) => {
        console.error("Error fetching scrutini data:", error);
      });
      
   
  }, []);

  return (
    <div className="w-[660px] h-auto bg-base-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[80px]" />
      </div>

      <div className="relative z-10 h-full flex flex-col p-4">
        {/* Candidates Grid - 4 in linea */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={topCandidates.length > 0 ? "show" : "hidden"}
          className="grid grid-cols-4 gap-2 flex-1 widget-4"
        >
          {topCandidates.map((candidate, index) => {
            const fullName = `${candidate.nome} ${candidate.cogn}`;
            const cognName = candidate.cogn.toUpperCase();
            const imageSlug = candidate.cogn.toLowerCase();
            const percentage = parseFloat(candidate.perc.replace(',', '.')) || 0;
            const isFirst = index === 0;
            
            return (
              <motion.div key={candidate.pos} variants={item}>
                <Link href="https://regionali.trmnet.work/risultati" target="_blank" rel="noopener noreferrer">
                  <div className={`card glass-card h-full transition-all duration-300 border-2 overflow-hidden cursor-pointer hover:-translate-y-1 ${
                    isFirst ? 'border-primary shadow-lg' : 'border-white/20'
                  }`}>
                    {/* Immagine candidato */}
                    <figure className="relative w-full aspect-square overflow-hidden">
                      <Image
                        src={`/img/candidati/${imageSlug}.webp`}
                        alt={fullName}
                        fill
                        className="object-cover object-top"
                        sizes="157px"
                        priority={index < 2}
                      />
                    </figure>
                    
                    <div className="card-body p-2">
                      {/* Candidate Header */}
                      <div className="mb-1">
                        <h2 className="text-xs font-bold leading-tight truncate">
                          {cognName}
                        </h2>
                      </div>

                      {/* Votes and Percentage */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline text-[9px]">
                          <span className="opacity-60">Voti</span>
                          <span className="font-bold font-mono text-[10px]">
                            {candidate.voti.toLocaleString("it-IT")}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <progress
                            className={`progress w-full h-1.5 ${
                              isFirst ? 'progress-primary' : 'progress-secondary'
                            }`}
                            value={percentage}
                            max="100"
                          ></progress>
                          <span className={`text-base font-bold text-center ${
                            isFirst ? 'text-primary' : 'text-secondary'
                          }`}>
                            {percentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-base-content/10">
          <p className="text-[10px] opacity-60">
            Dati aggiornati in tempo reale
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[10px] opacity-60">
              Sezioni: {sezioniScrutinate}/{sezioniTotali}
            </p>
            <progress className="progress w-24 h-1.5" value={sezioniScrutinate} max={sezioniTotali}></progress>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widget4CandidatiPage;

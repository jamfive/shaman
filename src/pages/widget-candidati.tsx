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
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
    }
  },
};

const WidgetCandidatiPage: React.FC = () => {
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
        // Ordina per voti decrescente e prendi i primi 2
        const sorted = [...data.cand].sort((a, b) => b.voti - a.voti).slice(0, 2);
        setTopCandidates(sorted);
            setSezioniScrutinate(data.int.sz_cons || 0);
            setSezioniTotali(data.int.sz_tot || 0);
      })
      .catch((error) => {
        console.error("Error fetching scrutini data:", error);
      });
      const reloadInterval = setInterval(() => {
        window.location.reload();
      }, 120000);
    return () => clearInterval(reloadInterval);
  }, []);

  return (
    <div className="w-[662px] h-[500px] bg-base-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[80px]" />
      </div>

      <div className="relative z-10 h-full flex flex-col p-6">
        {/* Header */}
        

        {/* Candidates Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={topCandidates.length > 0 ? "show" : "hidden"}
          className="grid grid-cols-2 gap-4 flex-1"
        >
          {topCandidates.map((candidate, index) => {
            const fullName = `${candidate.nome} ${candidate.cogn}`;
            const imageSlug = candidate.cogn.toLowerCase();
            
        
        
            
            const percentage = parseFloat(candidate.perc) || 0;
            const isFirst = index === 0;
            
            return (
              <motion.div key={candidate.pos} variants={item}>
                <Link href="https://regionali.trmnet.work" target="_blank" rel="noopener noreferrer">
                <div className={`card glass-card h-full transition-all duration-300 border-2 overflow-hidden cursor-pointer hover:-translate-y-1 ${
                  isFirst ? 'border-primary shadow-xl' : 'border-white/20'
                }`}>
                  

                  {/* Immagine candidato */}
                  <figure className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={`/img/candidati/${imageSlug}.webp`}
                      alt={fullName}
                      fill
                      className="object-cover object-top"
                      sizes="331px"
                      priority
                    />
                  </figure>
                  
                  <div className="card-body p-4">
                    {/* Candidate Header */}
                    <div className="mb-3">
                      <h2 className="text-lg font-bold leading-tight mb-1">
                        {fullName}
                      </h2>
                      
                    </div>

                    {/* Votes and Percentage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="opacity-60">Voti</span>
                        <span className="font-bold font-mono text-sm">
                          {candidate.voti.toLocaleString("it-IT")}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <progress
                          className={`progress flex-1 h-2 ${
                            isFirst ? 'progress-primary' : 'progress-secondary'
                          }`}
                          value={percentage}
                          max="100"
                        ></progress>
                        <span className={`text-2xl font-bold ${
                          isFirst ? 'text-primary' : 'text-secondary'
                        }`}>
                          {percentage}%
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
        <div className="flex justify-between mt-4">
          <p className="text-xs opacity-60">
            Dati aggiornati in tempo reale
          </p>
          <p className="text-xs opacity-60">
            Sezioni scrutinate: {sezioniScrutinate} / {sezioniTotali}
            <progress className="progress w-42 h-2 ml-2" value={sezioniScrutinate} max={sezioniTotali}></progress>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WidgetCandidatiPage;

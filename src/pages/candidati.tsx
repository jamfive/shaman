import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import Image from "next/image";

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
  };
  cand: Candidate[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
    }
  },
};

const CandidatiPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

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
        console.log("Scrutini data fetched:", data);
        setCandidates(data.cand);
      })
      .catch((error) => {
        console.error("Error fetching scrutini data:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-2 opacity-60">
          <ul>
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>Candidati</li>
          </ul>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:text-left"
        >
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Candidati alla <span className="text-gradient">Presidenza</span>
          </h1>
          <p className="text-lg opacity-80 max-w-5xl">
            Elezioni Regionali{" "}
            <span className="font-semibold">Puglia 2025</span>. Scopri i profili
            dei candidati, le liste collegate e i risultati in tempo reale.
          </p>
        </motion.div>

        {/* Candidates Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={candidates.length > 0 ? "show" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {candidates.map((candidate) => {
            const fullName = `${candidate.nome} ${candidate.cogn}`;
            const imageSlug = candidate.cogn.toLowerCase();
            
            // Determina la coalizione in base al cognome
            let coalition = "Lista civica";
            if (candidate.cogn.toLowerCase() === "decaro") {
              coalition = "Coalizione di CSX";
            } else if (candidate.cogn.toLowerCase() === "lobuono") {
              coalition = "Coalizione di CDX";
            }
            
            const percentage = parseFloat(candidate.perc) || 0;
            
            return (
              <motion.div key={candidate.pos} variants={item}>
                <div className="card glass-card hover:shadow-xl transition-all duration-300 border border-white/20 group overflow-hidden">
                  {/* Immagine candidato */}
                  <figure className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={`/img/candidati/${imageSlug}.webp`}
                      alt={fullName}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </figure>
                  
                  <div className="card-body p-4">
                    {/* Candidate Header */}
                    <div className="mb-3">
                      <h2 className="text-lg font-bold leading-tight mb-1">
                        {fullName}
                      </h2>
                      <div className="badge badge-ghost badge-sm opacity-70 truncate max-w-full">
                        {coalition}
                      </div>
                    </div>

                    {/* Votes and Percentage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="opacity-60">Voti</span>
                        <span className="font-bold font-mono">
                          {candidate.voti.toLocaleString("it-IT")}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <progress
                          className="progress progress-primary h-1.5 flex-1 mr-2"
                          value={percentage}
                          max="100"
                        ></progress>
                        <span className="text-xl font-bold text-primary">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="alert glass-card mt-8 border-l-4 border-l-info"
        >
          <Info className="stroke-info" />
          <div>
            <h3 className="font-bold text-sm">Aggiornamento Dati</h3>
            <div className="text-xs opacity-70">
              I dati visualizzati sono aggiornati in tempo reale. Ultimo
              aggiornamento: 13 novembre 2025, ore 20:00
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CandidatiPage;

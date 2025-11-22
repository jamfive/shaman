import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, X } from "lucide-react";
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
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

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
            <li>Risultati</li>
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
            Candidati e <span className="text-gradient">Risultati</span>
          </h1>
         
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
            const percentage = parseFloat(candidate.perc) || 0;
            
            return (
              <motion.div key={candidate.pos} variants={item}>
                <div
                  className="card glass-card hover:shadow-xl transition-all duration-300 border border-white/20 group cursor-pointer"
                  onClick={() => setSelectedCandidate(candidate)}
                >
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
                      {/* Liste collegate */}
                      <div className="flex flex-wrap gap-1 mt-2 overflow-visible">
                        {candidate.liste.map((lista) => (
                          <div
                            key={lista.pos}
                            className="tooltip tooltip-top z-50"
                            data-tip={`${lista.desc_lis_c}\nVoti: ${lista.voti.toLocaleString("it-IT")} (${lista.perc}%)`}
                          >
                            <div className="size-10 relative rounded border border-base-content/10 hover:border-primary/50 transition-colors">
                              <Image
                                src={`/img/regionali2025/${lista.img_lis_c}`}
                                alt={lista.desc_lis_c}
                                fill
                                className="object-contain p-0.5"
                                sizes="32px"
                              />
                            </div>
                          </div>
                        ))}
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
      
      </div>

      {/* Modal dettaglio candidato */}
      {selectedCandidate && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            {/* Header modale */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-lg">
                    <Image
                      src={`/img/candidati/${selectedCandidate.cogn.toLowerCase()}.webp`}
                      alt={`${selectedCandidate.nome} ${selectedCandidate.cogn}`}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedCandidate.nome} {selectedCandidate.cogn}
                  </h3>
                  <p className="text-sm opacity-60">
                    {selectedCandidate.cogn.toLowerCase() === "decaro"
                      ? "Coalizione di CSX"
                      : selectedCandidate.cogn.toLowerCase() === "lobuono"
                      ? "Coalizione di CDX"
                      : "Lista civica"}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setSelectedCandidate(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Statistiche totali */}
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-6">
              <div className="stat">
                <div className="stat-title">Voti totali</div>
                <div className="stat-value text-primary">
                  {selectedCandidate.voti.toLocaleString("it-IT")}
                </div>
                <div className="stat-desc">Somma di tutte le liste</div>
              </div>
              <div className="stat">
                <div className="stat-title">Percentuale</div>
                <div className="stat-value text-secondary">
                  {parseFloat(selectedCandidate.perc) || 0}%
                </div>
                <div className="stat-desc">Sul totale dei voti</div>
              </div>
            </div>

            {/* Tabella liste */}
            <div className="overflow-x-auto">
              <h4 className="font-bold text-lg mb-3">Liste collegate</h4>
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Lista</th>
                    <th className="text-right">Voti</th>
                    <th className="text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCandidate.liste.map((lista) => (
                    <tr key={lista.pos}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative rounded border border-base-content/10">
                            <Image
                              src={`/img/regionali2025/${lista.img_lis_c}`}
                              alt={lista.desc_lis_c}
                              fill
                              className="object-contain p-0.5"
                              sizes="32px"
                            />
                          </div>
                          <span className="text-sm">{lista.desc_lis_c}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono font-semibold">
                        {lista.voti.toLocaleString("it-IT")}
                      </td>
                      <td className="text-right">
                        <span className="badge badge-primary">{lista.perc}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer modale */}
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedCandidate(null)}
              >
                Chiudi
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedCandidate(null)} />
        </div>
      )}
    </div>
  );
};

export default CandidatiPage;

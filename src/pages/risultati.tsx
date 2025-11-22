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

      <div className="container mx-auto px-4 py-6 pt-20 relative z-10">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-1 opacity-60">
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
          className="mb-4 text-center md:text-left"
        >
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            Candidati e <span className="text-gradient">Risultati</span>
          </h1>
         
        </motion.div>

        {/* Candidates Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={candidates.length > 0 ? "show" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
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
                  
                  <div className="card-body p-3">
                    {/* Candidate Header */}
                    <div className="mb-2">
                      <h2 className="text-lg font-bold leading-tight mb-1">
                        {fullName}
                      </h2>
                      {/* Liste collegate */}
                      <div className="flex flex-wrap gap-1 mt-1 overflow-visible">
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
                    <div className="space-y-1.5">
                      {/* Voti Candidato */}
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="opacity-60">Voti Candidato</span>
                        <span className="font-bold font-mono text-primary">
                          {candidate.voti.toLocaleString("it-IT")}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <progress
                          className="progress progress-primary h-1.5 flex-1 mr-2"
                          value={percentage}
                          max="100"
                        ></progress>
                        <span className="text-lg font-bold text-primary">
                          {percentage}%
                        </span>
                      </div>

                      {/* Voti Liste */}
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="opacity-60">Voti Liste</span>
                        <span className="font-bold font-mono text-secondary">
                          {candidate.tot_vot_lis.toLocaleString("it-IT")}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <progress
                          className="progress progress-secondary h-1.5 flex-1 mr-2"
                          value={parseFloat(candidate.perc_lis) || 0}
                          max="100"
                        ></progress>
                        <span className="text-lg font-bold text-secondary">
                          {parseFloat(candidate.perc_lis) || 0}%
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
          <div className="modal-box max-w-3xl">
            {/* Header modale */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-lg">
                    <Image
                      src={`/img/candidati/${selectedCandidate.cogn.toLowerCase()}.webp`}
                      alt={`${selectedCandidate.nome} ${selectedCandidate.cogn}`}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedCandidate.nome} {selectedCandidate.cogn}
                  </h3>
                  <p className="text-xs opacity-60">
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
                <X size={18} />
              </button>
            </div>

            {/* Statistiche totali - Layout compatto */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="card bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
                <div className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-2">
                  Voti Candidato
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {selectedCandidate.voti.toLocaleString("it-IT")}
                </div>
                <div className="flex items-center gap-2">
                  <div className="badge badge-primary badge-sm font-bold text-primary-content!">
                    {parseFloat(selectedCandidate.perc) || 0}%
                  </div>
                  <span className="text-xs opacity-50">sul totale</span>
                </div>
              </div>
              
              <div className="card bg-linear-to-br from-secondary/10 to-secondary/5 border border-secondary/20 p-4">
                <div className="text-xs font-semibold text-secondary/70 uppercase tracking-wider mb-2">
                  Voti Liste
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {selectedCandidate.tot_vot_lis.toLocaleString("it-IT")}
                </div>
                <div className="flex items-center gap-2">
                  <div className="badge badge-secondary badge-sm font-bold text-white">
                    {parseFloat(selectedCandidate.perc_lis) || 0}%
                  </div>
                  <span className="text-xs opacity-50">sul totale</span>
                </div>
              </div>
              
              <div className="card bg-linear-to-br from-accent/10 to-accent/5 border border-accent/20 p-4">
                <div className="text-xs font-semibold text-accent/70 uppercase tracking-wider mb-2">
                  Voto Disgiunto
                </div>
                <div className="text-2xl font-bold text-accent mb-1">
                  {(selectedCandidate.voti - selectedCandidate.tot_vot_lis).toLocaleString("it-IT", { signDisplay: 'always' })}
                </div>
                <div className="flex items-center gap-2">
                  <div className="badge badge-accent badge-sm font-bold">
                    {(parseFloat(selectedCandidate.perc) - parseFloat(selectedCandidate.perc_lis)).toFixed(2)}%
                  </div>
                  <span className="text-xs opacity-50">differenza</span>
                </div>
              </div>
            </div>

            {/* Tabella liste - Layout compatto */}
            <div className="overflow-x-auto">
              <h4 className="font-bold text-sm mb-2 opacity-70">Liste collegate ({selectedCandidate.liste.length})</h4>
              <table className="table table-sm table-zebra">
                <thead>
                  <tr className="text-xs">
                    <th className="w-12"></th>
                    <th>Lista</th>
                    <th className="text-right">Voti</th>
                    <th className="text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCandidate.liste.map((lista) => (
                    <tr key={lista.pos} className="hover">
                      <td>
                        <div className="w-8 h-8 relative rounded border border-base-content/10">
                          <Image
                            src={`/img/regionali2025/${lista.img_lis_c}`}
                            alt={lista.desc_lis_c}
                            fill
                            className="object-contain p-0.5"
                            sizes="32px"
                          />
                        </div>
                      </td>
                      <td className="text-xs">{lista.desc_lis_c}</td>
                      <td className="text-right font-mono text-xs font-semibold">
                        {lista.voti.toLocaleString("it-IT")}
                      </td>
                      <td className="text-right">
                        <span className="badge badge-primary badge-sm text-primary-content!">{lista.perc}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={2} className="text-xs">Totale Liste</td>
                    <td className="text-right font-mono text-xs">
                      {selectedCandidate.tot_vot_lis.toLocaleString("it-IT")}
                    </td>
                    <td className="text-right">
                      <span className="badge badge-secondary badge-sm text-white!">
                        {parseFloat(selectedCandidate.perc_lis) || 0}%
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer modale */}
            <div className="modal-action mt-4">
              <button
                className="btn btn-sm btn-primary"
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

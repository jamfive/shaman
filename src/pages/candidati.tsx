import React from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { motion } from "framer-motion";
import { User, ChevronRight, Info } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  party: string;
  coalition: string;
  votes: number;
  percentage: number;
  image?: string;
}

interface CandidatiPageProps {
  candidates: Candidate[];
  totalVotes: number;
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CandidatiPage: React.FC<CandidatiPageProps> = ({
  candidates,
  totalVotes,
}) => {
  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-8 opacity-60">
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
          className="mb-12 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Candidati alla <span className="text-gradient">Presidenza</span>
          </h1>
          <p className="text-lg opacity-80 max-w-2xl">
            Elezioni Regionali{" "}
            <span className="font-semibold">Puglia 2025</span>. Scopri i profili
            dei candidati, le liste collegate e i risultati in tempo reale.
          </p>
        </motion.div>

        {/* Candidates Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {candidates.map((candidate) => (
            <motion.div key={candidate.id} variants={item}>
              <div className="card glass-card hover:shadow-xl transition-all duration-300 border border-white/20 group">
                <div className="card-body">
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="card-title text-2xl mb-2 font-bold">
                        {candidate.name}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="badge badge-primary badge-outline font-medium">
                          {candidate.party}
                        </div>
                        <div className="badge badge-ghost opacity-70">
                          {candidate.coalition}
                        </div>
                      </div>
                    </div>

                    <div className="avatar placeholder">
                      <div className="bg-primary/10 text-primary rounded-full w-16 h-16 ring ring-primary/20 ring-offset-base-100 ring-offset-2 group-hover:ring-primary/40 transition-all">
                        <span className="text-2xl font-bold">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Votes and Percentage */}
                  <div className="space-y-4 bg-base-100/50 p-4 rounded-xl">
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="opacity-70">Voti ottenuti</span>
                        <span className="font-bold font-mono">
                          {candidate.votes.toLocaleString("it-IT")}
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full h-2"
                        value={candidate.percentage}
                        max="100"
                      ></progress>
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-xs opacity-60 uppercase tracking-wider font-semibold">
                        Percentuale
                      </span>
                      <span className="text-3xl font-bold text-primary">
                        {candidate.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-ghost btn-sm gap-2 group-hover:translate-x-1 transition-transform">
                      Dettagli <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="alert glass-card mt-12 border-l-4 border-l-info"
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

export const getStaticProps: GetStaticProps<CandidatiPageProps> = async () => {
  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Antonio Decaro",
      party: "Partito Democratico",
      coalition: "Centro-sinistra",
      votes: 0,
      percentage: 0,
    },
    {
      id: 2,
      name: "Luigi Lobuono",
      party: "Fratelli d'Italia",
      coalition: "Centro-destra",
      votes: 0,
      percentage: 0,
    },
    {
      id: 3,
      name: "Sabino Mangano",
      party: "Alleanza civica per la Puglia",
      coalition: "Lista civica",
      votes: 0,
      percentage: 0,
    },
    {
      id: 4,
      name: "Ada Donno",
      party: "Puglia pacifista e popolare",
      coalition: "Lista civica",
      votes: 0,
      percentage: 0,
    },
  ];

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return {
    props: {
      candidates,
      totalVotes,
    },
  };
};

export default CandidatiPage;

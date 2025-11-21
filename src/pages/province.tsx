import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { motion } from "framer-motion";
import {
  Map,
  Users,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Info,
} from "lucide-react";
import { ShamanConfig } from "@/ShamanConfig";

interface Province {
  name: string;
  slug: string;
  population: number;
  municipalities: number;
  turnout: number;
  turnoutPrevious: number;
  votedCount: number;
  totalVoters: number;
  leadingCandidate: string;
  leadingPercentage: number;
}

interface ComVot {
  perc_r: string;
  enti_t: number;
  enti_p: number;
  perc: string;
}

interface EntiF {
  desc: string;
  ele_t: number;
  com_vot: ComVot[];
}

interface AffluenteData {
  enti: {
    ente_p: {
      desc: string;
      ele_t: number;
      com_vot: ComVot[];
    };
    enti_f: EntiF[];
  };
}

interface ProvincePageProps {
  provinces: Province[];
  totalPopulation: number;
  totalMunicipalities: number;
  avgTurnout: number;
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

const ProvincePage: React.FC<ProvincePageProps> = ({
  provinces: initialProvinces,
  totalPopulation,
  totalMunicipalities,
  avgTurnout,
}) => {
  const [provinces, setProvinces] = useState<Province[]>(initialProvinces);
  const phase = ShamanConfig.phase // Primo checkpoint: 12:00

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`/data/affluenze-puglia.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((data: AffluenteData) => {
        const updatedProvinces = initialProvinces.map((province) => {
          const provinciaData = data.enti.enti_f.find(
            (p) => p.desc.toLowerCase() === province.name.toLowerCase()
          );
          
          if (provinciaData && phase >= 0) {
            const currentData = provinciaData.com_vot[phase];
            return {
              ...province,
              turnout: parseFloat(currentData.perc) || 0,
              turnoutPrevious: parseFloat(currentData.perc_r) || 0,
              totalVoters: provinciaData.ele_t,
              votedCount: 0, // Calcolabile se necessario
            };
          }
          return province;
        });
        setProvinces(updatedProvinces);
      })
      .catch((error) => {
        console.error("Error fetching affluenze data:", error);
      });
  }, [initialProvinces, phase]);
  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[100px]" />
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
            <li>Province</li>
          </ul>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:text-left"
        >
          <h1 className="text-4xl font-bold mb-1 tracking-tight">
            Province della <span className="text-gradient">Puglia</span>
          </h1>
          <p className="text-lg opacity-80 max-w-2xl">
            Risultati elettorali suddivisi per provincia - Elezioni Regionali
            2025
          </p>
        </motion.div>

        {/* Regional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="card glass-card p-6">
            <div className="flex flex-col gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-lg w-fit">
                <Map size={20} />
              </div>
              <div>
                <div className="text-3xl font-bold">{provinces.length}</div>
                <div className="text-xs uppercase tracking-wider opacity-60">
                  Province
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card p-6">
            <div className="flex flex-col gap-2">
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg w-fit">
                <Building2 size={20} />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalMunicipalities}</div>
                <div className="text-xs uppercase tracking-wider opacity-60">
                  Comuni
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card p-6">
            <div className="flex flex-col gap-2">
              <div className="p-2 bg-accent/10 text-accent rounded-lg w-fit">
                <Users size={20} />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {(totalPopulation / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs uppercase tracking-wider opacity-60">
                  Abitanti
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card p-6">
            <div className="flex flex-col gap-2">
              <div className="p-2 bg-info/10 text-info rounded-lg w-fit">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {avgTurnout.toFixed(1)}%
                </div>
                <div className="text-xs uppercase tracking-wider opacity-60">
                  Affluenza Media
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Provinces Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {provinces.map((province) => (
            <motion.div key={province.slug} variants={item}>
              <Link
                href={`/provincia/${province.slug}`}
                className="card glass-card hover:shadow-xl transition-all duration-300 group h-full"
              >
                <div className="card-body">
                  {/* Province Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="card-title text-2xl mb-1 font-bold group-hover:text-primary transition-colors">
                        {province.name}
                      </h2>
                    </div>
                    <div className="badge badge-lg badge-primary badge-outline font-mono">
                      {province.slug.toUpperCase()}
                    </div>
                  </div>

                  {/* Province Stats */}
                  <div className="space-y-3 mb-6 bg-base-100/50 p-4 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70">Popolazione</span>
                      <span className="font-semibold font-mono">
                        {province.population.toLocaleString("it-IT")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70">Comuni</span>
                      <span className="font-semibold font-mono">
                        {province.municipalities}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70">Votanti</span>
                      <span className="font-semibold font-mono">
                        {province.votedCount.toLocaleString("it-IT")}
                      </span>
                    </div>
                  </div>

                  {/* Turnout */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2 items-end">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                        Affluenza
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {province.turnout}%
                        </span>
                        {(() => {
                          const delta = province.turnout - province.turnoutPrevious;
                          if (delta > 0) {
                            return (
                              <div className="flex items-center gap-1">
                                <TrendingUp size={14} className="text-success" />
                                <span className="text-success font-semibold text-xs">+{delta.toFixed(1)}%</span>
                              </div>
                            );
                          } else if (delta < 0) {
                            return (
                              <div className="flex items-center gap-1">
                                <TrendingDown size={14} className="text-error" />
                                <span className="text-error font-semibold text-xs">{delta.toFixed(1)}%</span>
                              </div>
                            );
                          } else if (province.turnoutPrevious > 0) {
                            return (
                              <div className="flex items-center gap-1">
                                <Minus size={14} className="opacity-50" />
                                <span className="opacity-50 font-semibold text-xs">0%</span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                    <progress
                      className="progress progress-primary w-full h-2"
                      value={province.turnout}
                      max="100"
                    ></progress>
                  </div>

                  {/* Leading Candidate */}
                  <div className="mt-auto pt-4 border-t border-base-content/10">
                    <p className="text-xs opacity-60 mb-2 uppercase tracking-wider font-semibold">
                      In testa
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">
                        {province.leadingCandidate}
                      </span>
                      <span className="badge badge-success badge-sm font-bold">
                        {province.leadingPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Link indicator */}
                  <div className="card-actions justify-end mt-6">
                    <div className="btn btn-ghost btn-sm gap-2 group-hover:translate-x-1 transition-transform">
                      Dettagli <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="alert glass-card mt-12 border-l-4 border-l-info"
        >
          <Info className="stroke-info" />
          <span className="text-sm">
            Clicca su una provincia per visualizzare i risultati dettagliati e
            l&apos;affluenza per comune
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ProvincePageProps> = async () => {
  const provinces: Province[] = [
    {
      name: "Bari",
      slug: "bari",
      population: 1218191,
      municipalities: 41,
      turnout: 0,
      turnoutPrevious: 0,
      votedCount: 0,
      totalVoters: 0,
      leadingCandidate: "Antonio Decaro",
      leadingPercentage: 45.2,
    },
    {
      name: "Barletta-Andria-Trani",
      slug: "bat",
      population: 376561,
      municipalities: 10,
      turnout: 0,
      turnoutPrevious: 0,
      votedCount: 0,
      totalVoters: 0,
      leadingCandidate: "Luigi Lobuono",
      leadingPercentage: 41.8,
    },
    {
      name: "Brindisi",
      slug: "brindisi",
      population: 375286,
      municipalities: 20,
      turnout: 0,
      turnoutPrevious: 0,
      votedCount: 0,
      totalVoters: 0,
      leadingCandidate: "Antonio Decaro",
      leadingPercentage: 43.5,
    },
    {
      name: "Foggia",
      slug: "foggia",
      population: 590304,
      municipalities: 61,
      turnout: 0,
      turnoutPrevious: 0,
      votedCount: 0,
      totalVoters: 0,
      leadingCandidate: "Luigi Lobuono",
      leadingPercentage: 46.7,
    },
    {
      name: "Lecce",
      slug: "lecce",
      population: 763778,
      municipalities: 96,
      turnout: 0,
      turnoutPrevious: 0,
      votedCount: 0,
      totalVoters: 0,
      leadingCandidate: "Antonio Decaro",
      leadingPercentage: 48.3,
    },
    {
      name: "Taranto",
      slug: "taranto",
      population: 550046,
      municipalities: 29,
      turnout: 0,
      turnoutPrevious: 0,
      votedCount: 0,
      totalVoters: 0,
      leadingCandidate: "Antonio Decaro",
      leadingPercentage: 44.1,
    },
  ];

  const totalPopulation = provinces.reduce((sum, p) => sum + p.population, 0);
  const totalMunicipalities = provinces.reduce(
    (sum, p) => sum + p.municipalities,
    0
  );
  const avgTurnout =
    provinces.reduce((sum, p) => sum + p.turnout, 0) / provinces.length;

  return {
    props: {
      provinces,
      totalPopulation,
      totalMunicipalities,
      avgTurnout,
    },
  };
};

export default ProvincePage;

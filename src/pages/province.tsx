import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { motion } from "framer-motion";
import { ShamanConfig } from "@/ShamanConfig";
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
import { appURL, translatePhase } from "@/lib/utils";
import Meta from "@/components/Meta";

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
  secondCandidate: string;
  secondPercentage: number;
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

interface ScrutiniCandidate {
  cogn: string;
  nome: string;
  voti: number;
  perc: string;
}

interface ScrutiniData {
  cand: ScrutiniCandidate[];
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
  const [regionalAvgTurnout, setRegionalAvgTurnout] =
    useState<number>(avgTurnout);
  const phase = ShamanConfig.phase; // Primo checkpoint: 12:00

  useEffect(() => {
    const timestamp = new Date().getTime();

    // Mappa slug provincia a nome file per scrutini
    const fileNameMap: { [key: string]: string } = {
      bat: "barletta-andria-trani",
      bari: "bari",
      brindisi: "brindisi",
      foggia: "foggia",
      lecce: "lecce",
      taranto: "taranto",
    };

    // Carica affluenze regionali
    fetch(`${ShamanConfig.fetchDataURL}/data/affluenze-puglia.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    })
      .then((r) => r.json())
      .then((affluenteData: AffluenteData) => {
        // Aggiorna affluenza media regionale
        if (phase >= 0 && affluenteData.enti.ente_p.com_vot[phase]) {
          const regionalTurnout =
            parseFloat(affluenteData.enti.ente_p.com_vot[phase].perc.replace(',', '.')) || 0;
          setRegionalAvgTurnout(regionalTurnout);
        }

        // Carica scrutini per ogni provincia
        const scrutiniPromises = initialProvinces.map((province) => {
          const provinciaFileName = fileNameMap[province.slug] || province.slug;
          return fetch(
            `/data/scrutini-provincia-${provinciaFileName}.json?t=${timestamp}`,
            {
              cache: "no-store",
              headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
            }
          )
            .then((r) => r.json())
            .then((scrutiniData: ScrutiniData) => ({
              slug: province.slug,
              scrutiniData,
            }))
            .catch((error) => {
              console.error(
                `Error fetching scrutini for ${province.slug}:`,
                error
              );
              return { slug: province.slug, scrutiniData: null };
            });
        });

        Promise.all(scrutiniPromises).then((scrutiniResults) => {
          const updatedProvinces = initialProvinces.map((province) => {
            const provinciaData = affluenteData.enti.enti_f.find(
              (p) => p.desc.toLowerCase() === province.name.toLowerCase()
            );

            // Trova i dati scrutini per questa provincia
            const provinciaScrutini = scrutiniResults.find(
              (r) => r.slug === province.slug
            );
            const topTwoCandidates = provinciaScrutini?.scrutiniData
              ? [...provinciaScrutini.scrutiniData.cand]
                  .sort((a, b) => b.voti - a.voti)
                  .slice(0, 2)
              : [];

            if (provinciaData && phase >= 0) {
              const currentData = provinciaData.com_vot[phase];
              const turnout = parseFloat(currentData.perc.replace(',', '.')) || 0;
              const turnoutPrevious = parseFloat(currentData.perc_r.replace(',', '.')) || 0;
              const totalVoters = provinciaData.ele_t;
              const votedCount = Math.round((totalVoters * turnout) / 100);

              return {
                ...province,
                turnout,
                turnoutPrevious,
                totalVoters,
                votedCount,
                leadingCandidate: topTwoCandidates[0]
                  ? `${topTwoCandidates[0].nome} ${topTwoCandidates[0].cogn}`
                  : province.leadingCandidate,
                leadingPercentage: topTwoCandidates[0]
                  ? parseFloat(topTwoCandidates[0].perc.replace(',', '.')) || 0
                  : province.leadingPercentage,
                secondCandidate: topTwoCandidates[1]
                  ? `${topTwoCandidates[1].nome} ${topTwoCandidates[1].cogn}`
                  : province.secondCandidate,
                secondPercentage: topTwoCandidates[1]
                  ? parseFloat(topTwoCandidates[1].perc.replace(',', '.')) || 0
                  : province.secondPercentage,
              };
            }
            return province;
          });
          setProvinces(updatedProvinces);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [initialProvinces, phase]);
  return (
    <>
      <Meta
        ogUrl={appURL + "/province"}
        title="Province della Puglia - Elezioni Regionali 2025"
        description="Risultati elettorali suddivisi per provincia delle elezioni regionali della Puglia 2025"
      />
      <div className="min-h-screen bg-base-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[100px]" />
        </div>

        <div className="container max-w-screen-2xl mx-auto px-4 md:px-8 py-6 pt-20 relative z-10">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-3 opacity-60 hidden">
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
            className="mb-4 text-center md:text-left"
          >
            <h1 className="text-3xl font-bold mb-1 tracking-tight">
              Province della <span className="text-gradient">Puglia</span>
            </h1>
            <p className="text-sm opacity-70 max-w-2xl">
              Risultati elettorali suddivisi per provincia - Elezioni Regionali
              2025
            </p>
          </motion.div>

          {/* Regional Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            <div className="card glass-card p-4">
              <div className="flex flex-col gap-1">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg w-fit">
                  <Map size={16} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{provinces.length}</div>
                  <div className="text-xs uppercase tracking-wider opacity-60">
                    Province
                  </div>
                </div>
              </div>
            </div>

            <div className="card glass-card p-4">
              <div className="flex flex-col gap-1">
                <div className="p-1.5 bg-secondary/10 text-secondary rounded-lg w-fit">
                  <Building2 size={16} />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {totalMunicipalities}
                  </div>
                  <div className="text-xs uppercase tracking-wider opacity-60">
                    Comuni
                  </div>
                </div>
              </div>
            </div>

            <div className="card glass-card p-4">
              <div className="flex flex-col gap-1">
                <div className="p-1.5 bg-accent/10 text-accent rounded-lg w-fit">
                  <Users size={16} />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {(totalPopulation / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs uppercase tracking-wider opacity-60">
                    Abitanti
                  </div>
                </div>
              </div>
            </div>

            <div className="card glass-card p-4">
              <div className="flex flex-col gap-1">
                <div className="p-1.5 bg-info/10 text-info rounded-lg w-fit">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {regionalAvgTurnout.toFixed(2)}%
                  </div>
                  <div className="text-xs uppercase tracking-wider opacity-60">
                    Affluenza Regionale <br/> alle ore {phase >= 0 ? translatePhase(phase) : "--:--"}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {provinces.map((province) => (
              <motion.div key={province.slug} variants={item}>
                <Link
                  href={`/provincia/${province.slug}`}
                  className="card glass-card hover:shadow-xl transition-all duration-300 group h-full"
                >
                  <div className="card-body p-4">
                    {/* Province Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-xl mb-1 font-bold group-hover:text-primary transition-colors">
                          {province.name}
                        </h2>
                      </div>
                      <div className="badge badge-primary badge-outline badge-sm font-mono">
                        {province.slug.toUpperCase()}
                      </div>
                    </div>

                    {/* Province Stats */}
                    <div className="space-y-2 mb-3 bg-base-100/50 p-3 rounded-lg">
                      <div className="flex justify-between text-xs">
                        <span className="opacity-70">Elettori</span>
                        <span className="font-semibold font-mono">
                          {province.totalVoters.toLocaleString("it-IT")}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="opacity-70">Votanti</span>
                        <span className="font-semibold font-mono">
                          {province.votedCount.toLocaleString("it-IT")}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="opacity-70">Comuni</span>
                        <span className="font-semibold font-mono">
                          {province.municipalities}
                        </span>
                      </div>
                    </div>

                    {/* Turnout */}
                    <div className="mb-3">
                      <div className="flex justify-between mb-1.5 items-end">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                          Affluenza <br/> alle ore {phase >= 0 ? translatePhase(phase) : "--:--"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">
                            {province.turnout}%
                          </span>
                          {(() => {
                            const delta =
                              province.turnout - province.turnoutPrevious;
                            if (delta > 0) {
                              return (
                                <div className="flex items-center gap-0.5">
                                  <TrendingUp
                                    size={12}
                                    className="text-success"
                                  />
                                  <span className="text-success font-semibold text-xs">
                                    +{delta.toFixed(1)}%
                                  </span>
                                </div>
                              );
                            } else if (delta < 0) {
                              return (
                                <div className="flex items-center gap-0.5">
                                  <TrendingDown
                                    size={12}
                                    className="text-error"
                                  />
                                  <span className="text-error font-semibold text-xs">
                                    {delta.toFixed(1)}%
                                  </span>
                                </div>
                              );
                            } else if (province.turnoutPrevious > 0) {
                              return (
                                <div className="flex items-center gap-0.5">
                                  <Minus size={12} className="opacity-50" />
                                  <span className="opacity-50 font-semibold text-xs">
                                    0%
                                  </span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                      <progress
                        className="progress progress-primary w-full h-1.5"
                        value={province.turnout}
                        max="100"
                      ></progress>
                    </div>

                    {/* Top Two Candidates */}
                    {ShamanConfig.scrutini && (<div className="pt-3 border-t border-base-content/10">
                      <p className="text-xs opacity-60 mb-2 uppercase tracking-wider font-semibold">
                        Candidati in testa
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs truncate mr-2">
                            {province.leadingCandidate}
                          </span>
                          <span className="badge badge-primary badge-xs font-bold">
                            {province.leadingPercentage}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs opacity-80 truncate mr-2">
                            {province.secondCandidate}
                          </span>
                          <span className="badge badge-secondary badge-xs font-bold text-white!">
                            {province.secondPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>)}

                    {/* Link indicator */}
                    <div className="card-actions justify-end mt-3">
                      <div className="btn btn-ghost btn-xs gap-1 group-hover:translate-x-1 transition-transform">
                        Dettagli <ChevronRight size={14} />
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
            className="alert glass-card mt-6 border-l-4 border-l-info"
          >
            <Info className="stroke-info" />
            <span className="text-sm">
              Clicca su una provincia per visualizzare i risultati dettagliati e
              l&apos;affluenza per comune
            </span>
          </motion.div>
        </div>
      </div>
    </>
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
      secondCandidate: "Luigi Lobuono",
      secondPercentage: 38.5,
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
      secondCandidate: "Antonio Decaro",
      secondPercentage: 39.2,
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
      secondCandidate: "Luigi Lobuono",
      secondPercentage: 37.8,
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
      secondCandidate: "Antonio Decaro",
      secondPercentage: 40.1,
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
      secondCandidate: "Luigi Lobuono",
      secondPercentage: 35.2,
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
      secondCandidate: "Luigi Lobuono",
      secondPercentage: 38.9,
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

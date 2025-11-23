import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Clock, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { ShamanConfig } from "@/ShamanConfig";
import Meta from "@/components/Meta";
import { translatePhase } from "@/lib/utils";

const phase = ShamanConfig.phase

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

interface EnteP {
  desc: string;
  com_vot: ComVot[];
}

interface Province {
  enti: {
    ente_p: EnteP;
    enti_f: EntiF[];
  };
}

interface TimeStat {
  time: string;
  value: string;
  previous: string | null;
  label: string;
}



const AffluentePage: React.FC = () => {
  const [provinciesData, setProvinciesData] = useState<Province>();
  const [timeStats, setTimeStats] = useState<TimeStat[]>([]);

  useEffect(() => {
    // Cache busting: aggiungi timestamp per evitare problemi di cache
    const timestamp = new Date().getTime();
    fetch(`${ShamanConfig.fetchDataURL}/data/affluenze-puglia.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data fetched:", data.enti);
        setProvinciesData(data);
        setTimeStats([
          {
            time: "12:00",
            value: phase >= 0 ? data.enti.ente_p.com_vot[0]?.perc+"%" || "--%": "--%",
            previous: data.enti.ente_p.com_vot[0]?.perc_r || null,
            label: "Domenica",
          },
          {
            time: "19:00",
            value: phase >= 1 ? data.enti.ente_p.com_vot[1]?.perc+"%" || "--%": "--%",
            previous: data.enti.ente_p.com_vot[1]?.perc_r || null,
            label: "Domenica",
          },
          {
            time: "23:00",
            value: phase >= 2 ? data.enti.ente_p.com_vot[2]?.perc+"%" || "--%": "--%",
            previous: data.enti.ente_p.com_vot[2]?.perc_r || null,
            label: "Domenica",
          },
          {
            time: "15:00",
            value: phase >= 3 ? data.enti.ente_p.com_vot[3]?.perc+"%" || "--%": "--%",
            previous: data.enti.ente_p.com_vot[3]?.perc_r || null,
            label: "Lunedì",
          },
        ]); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (provinciesData) {
      console.log("Provinces data updated:", provinciesData);
    }
  }, [provinciesData]);

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

  return (
    <>
     <Meta
        ogUrl="https://regionali.trmnet.work/affluenze"
        title="Affluenze - Elezioni Regionali Puglia 2025"
        description="Affluenze dettagliate delle elezioni regionali della Puglia 2025"
      />

      <div className="min-h-screen bg-base-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-screen-2xl px-4 md:px-8 py-8 pt-24 relative z-10">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-4 opacity-60 hidden">
            <ul>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>Affluenze</li>
            </ul>
          </div>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex flex-col md:flex-row md:gap-4">
              <h1 className="text-3xl font-bold mb-2 md:mb-0 tracking-tight text-left">
                Affluenze{" "}
                <span className="font-bold text-gradient">Elettorali</span>
              </h1>
              <h2 className="text-xl font-light opacity-80 tracking-widest uppercase text-left md:mt-2">
                {provinciesData?.enti.ente_p.desc || "Puglia"} 2025
              </h2>
            </div>
            
            {/* Progress Bar Sezioni */}
            {provinciesData && phase >= 0 && (
              <div className="bg-base-200/50 rounded-lg p-2 md:max-w-md md:flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold opacity-70">
                    Sezioni rilevate
                  </span>
                  <span className="text-xs font-bold font-mono">
                    {provinciesData.enti.ente_p.com_vot[phase]?.enti_p.toLocaleString("it-IT") || 0} / {provinciesData.enti.ente_p.com_vot[phase]?.enti_t.toLocaleString("it-IT") || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <progress
                    className="progress progress-primary h-2 flex-1"
                    value={provinciesData.enti.ente_p.com_vot[phase]?.enti_p || 0}
                    max={provinciesData.enti.ente_p.com_vot[phase]?.enti_t || 1}
                  ></progress>
                  <span className="text-xs font-bold text-primary">
                    {provinciesData.enti.ente_p.com_vot[phase]?.enti_t > 0
                      ? ((provinciesData.enti.ente_p.com_vot[phase]?.enti_p / provinciesData.enti.ente_p.com_vot[phase]?.enti_t) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            )}
          </motion.header>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {timeStats.map((stat, index) => {
              // Rimuove il simbolo % e converte virgola in punto per il parse
              const currentValue = parseFloat(stat.value.replace('%', '').replace(',', '.')) || 0;
              const previousValue = stat.previous ? parseFloat(stat.previous.replace(',', '.')) : null;
              const delta = previousValue !== null ? currentValue - previousValue : null;
              
              return (
                <motion.div
                  key={index}
                  variants={item}
                  className={`card glass-card text-center py-6 ${index <= phase ? 'opacity-100!' : 'opacity-30!'}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 opacity-70 text-sm">
                      <Clock size={14} />
                      <span>Ore {stat.time}</span>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary">
                      {stat.value}
                    </div>
                    {previousValue !== null && index <= phase && (
                      <>
                        <div className="text-xs opacity-50">
                          Precedente: {previousValue.toFixed(2)}%
                        </div>
                        <div className="flex items-center gap-1">
                          {delta !== null && (
                            <>
                              {delta > 0 ? (
                                <TrendingUp size={14} className="text-success" />
                              ) : delta < 0 ? (
                                <TrendingDown size={14} className="text-error" />
                              ) : (
                                <Minus size={14} className="opacity-50" />
                              )}
                              <span className={`text-sm font-semibold ${
                                delta > 0 ? 'text-success' : delta < 0 ? 'text-error' : 'opacity-50'
                              }`}>
                                {delta > 0 ? '+' : ''}{delta.toFixed(2)}%
                              </span>
                            </>
                          )}
                        </div>
                      </>
                    )}
                    <div className="text-xs uppercase tracking-wider opacity-50">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card glass-card overflow-hidden"
          >
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-content/5 bg-base-100/30 flex justify-between items-center">
                <div>
                  <h3 className="card-title text-2xl font-bold">
                    Affluenza per Provincia {ShamanConfig.phase >= 0 ? `(alle ore ${translatePhase(ShamanConfig.phase)})` : ""}
                  </h3>
                  <p className="opacity-70 text-sm">
                    Dati ripartiti per circoscrizione elettorale
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary hidden md:block">
                  <Users size={24} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b-base-content/10 text-base-content/60 uppercase text-xs tracking-wider">
                      <th className="bg-transparent py-4 pl-6">Provincia</th>
                      <th className="text-right bg-transparent">
                        Comuni
                      </th>
                      <th className="text-right bg-transparent">
                        Elettori
                      </th>
                      <th className="text-right bg-transparent">Sezioni</th>
                      <th className="text-right bg-transparent">Affluenza %</th>
                      <th className="text-right bg-transparent">Precedente %</th>
                      <th className="text-right bg-transparent pr-6">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinciesData?.enti.enti_f.map((provincia, index) => {
                      const comuniMap: { [key: string]: number } = {
                        "BARI": 41,
                        "BARLETTA-ANDRIA-TRANI": 10,
                        "BRINDISI": 20,
                        "FOGGIA": 61,
                        "LECCE": 97,
                        "TARANTO": 29
                      };
                      
                      const currentData = phase >= 0 ? provincia.com_vot[phase] : null;
                      const affluenza = currentData?.perc || "--";
                      const precedente = currentData?.perc_r || "--";
                      const elettori = provincia.ele_t || "--";
                      const entiTotali = currentData?.enti_t ?? "--";
                      const entiPervenuti = currentData?.enti_p ?? "--";
                      const comuni = comuniMap[provincia.desc.toUpperCase()] || "--";
                      
                      // Calcola il delta percentuale
                      const delta = affluenza !== "--" && precedente !== "--" 
                        ? (parseFloat(affluenza.replaceAll(",", ".")) - parseFloat(precedente.replaceAll(",", ".")  )).toFixed(2)
                        : null;
                      
                      // Converti il nome provincia in slug per il link
                      const provinciaSlugMap: { [key: string]: string } = {
                        "BARI": "bari",
                        "BARLETTA-ANDRIA-TRANI": "bat",
                        "BRINDISI": "brindisi",
                        "FOGGIA": "foggia",
                        "LECCE": "lecce",
                        "TARANTO": "taranto"
                      };
                      const provinciaSlug = provinciaSlugMap[provincia.desc.toUpperCase()];
                      
                      console.log(`Provincia: ${provincia.desc}, Phase: ${phase}, Affluenza: ${affluenza}`);
                      
                      return (
                        <tr
                          key={index}
                          onClick={() => provinciaSlug && (window.location.href = `/provincia/${provinciaSlug}#affluenza-comuni`)}
                          className="hover:bg-base-content/5 transition-colors border-b-base-content/5 cursor-pointer"
                          title={`Vai ai dettagli di ${provincia.desc}`}
                        >
                          <td className="font-medium pl-6 py-4">
                            {provincia.desc}
                          </td>
                          <td className="text-right opacity-70 font-mono text-sm">
                            {comuni}
                          </td>
                          <td className="text-right opacity-70 font-mono">
                            {elettori !== "--" ? elettori.toLocaleString("it-IT") : "--"}
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="opacity-70 font-mono">
                                {entiPervenuti}/{entiTotali}
                              </span>
                              {entiPervenuti !== "--" && entiTotali !== "--" && (
                                <span className="relative flex h-2 w-2">
                                  {entiPervenuti < entiTotali ? (
                                    <>
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                                    </>
                                  )}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-right">
                            <span className="badge badge-primary font-bold text-primary-content!">
                              {affluenza !== "--" ? parseFloat(affluenza.replace(',', '.')).toFixed(2) : "--"}{affluenza !== "--" ? "%" : ""}
                            </span>
                          </td>
                          <td className="text-right opacity-70 font-mono text-sm">
                            {precedente !== "--" ? parseFloat(precedente.replace(',', '.')).toFixed(2) : "--"}{precedente !== "--" ? "%" : ""}
                          </td>
                          <td className="pr-6">
                            {delta !== null ? (
                              <div className="flex items-center justify-end gap-1">
                                {parseFloat(delta) > 0 ? (
                                  <>
                                    <TrendingUp size={16} className="text-success" />
                                    <span className="text-success font-semibold text-sm">+{delta}%</span>
                                  </>
                                ) : parseFloat(delta) < 0 ? (
                                  <>
                                    <TrendingDown size={16} className="text-error" />
                                    <span className="text-error font-semibold text-sm">{delta}%</span>
                                  </>
                                ) : (
                                  <>
                                    <Minus size={16} className="opacity-50" />
                                    <span className="opacity-50 font-semibold text-sm">{delta}%</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="opacity-30 text-sm">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-base-100/30 border-t border-base-content/5">
                <div className="alert bg-info/10 text-info border-info/20">
                  <Info size={20} />
                  <span className="text-sm">
                    I dati delle affluenze vengono aggiornati ad orari specifici
                    durante le ore di votazione.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AffluentePage;

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import { capitalizeFirstLetter } from "../../lib/utils";
import {
  MapPin,
  Users,
  Vote,
  FileText,
  AlertCircle,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { ShamanConfig } from "@/ShamanConfig";
import Meta from "@/components/Meta";

interface ProvinciaPageProps {
  provincia: string;
  phase: number;
}

interface ComVot {
  perc_r: string;
  enti_t: number;
  enti_p: number;
  perc: string;
}

interface Comune {
  tipo: string;
  desc: string;
  cod: number;
  ele_t: number;
  com_vot: ComVot[];
}

interface ProvinciaData {
  enti: {
    ente_p: {
      desc: string;
      ele_t: number;
      com_vot: ComVot[];
    };
    enti_f: Comune[];
  };
}

interface CandidateResult {
  cogn: string;
  nome: string;
  voti: number;
  perc: string;
  tot_vot_lis: number;
  perc_lis: string;
  liste: Array<{
    pos: number;
    desc_lis_c: string;
    img_lis_c: string;
    voti: number;
    perc: string;
  }>;
}

interface ScrutiniData {
  cand: CandidateResult[];
}

const ProvinciaPage: React.FC<ProvinciaPageProps> = ({ provincia, phase }) => {
  const [provinciaData, setProvinciaData] = useState<ProvinciaData>();
  const [candidatesResults, setCandidatesResults] = useState<CandidateResult[]>([]);

  useEffect(() => {
    const timestamp = new Date().getTime();
    
    // Mappa slug provincia a nome file
    const fileNameMap: { [key: string]: string } = {
      'bat': 'barletta-andria-trani',
      'bari': 'bari',
      'brindisi': 'brindisi',
      'foggia': 'foggia',
      'lecce': 'lecce',
      'taranto': 'taranto'
    };
    
    const provinciaFileName = fileNameMap[provincia] || provincia;
    
    // Carica affluenze provincia
    fetch(`/data/affluenze-${provincia}.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Data fetched for ${provincia}:`, data);
        setProvinciaData(data);
      })
      .catch((error) => {
        console.error(`Error fetching data for ${provincia}:`, error);
      });
    
    // Carica risultati candidati dalla provincia specifica
    fetch(`/data/scrutini-provincia-${provinciaFileName}.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((data: ScrutiniData) => {
        console.log(`Candidates data fetched for ${provincia}:`, data);
        // Ordina candidati per voti decrescenti
        const sortedCandidates = [...data.cand].sort((a, b) => b.voti - a.voti);
        setCandidatesResults(sortedCandidates);
      })
      .catch((error) => {
        console.error(`Error fetching candidates data for ${provincia}:`, error);
      });
  }, [provincia]);

  // Scroll to anchor with offset for navbar
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      
      if (element) {
        // Aspetta che il DOM sia completamente renderizzato
        setTimeout(() => {
          const navbarHeight = 80; // Altezza della navbar in px
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset-40;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [provinciaData]); // Esegui dopo che i dati sono caricati

  const provinciaName =
    provincia === "bat"
      ? "Barletta-Andria-Trani"
      : capitalizeFirstLetter(provincia);

  // Numero comuni per provincia (fonte: tuttitalia.it)
  const comuniMap: { [key: string]: number } = {
    bari: 41,
    bat: 10,
    brindisi: 20,
    foggia: 61,
    lecce: 97,
    taranto: 29,
  };

  const numComuni = comuniMap[provincia] || 0;

  // Calcola i dati aggregati della provincia
  const currentData = phase >= 0 && provinciaData 
    ? provinciaData.enti.ente_p.com_vot[phase] 
    : null;
  const affluenzaProvincia = currentData?.perc || "--";
  const elettoriProvincia = provinciaData?.enti.ente_p.ele_t || "--";
  const sezioniTotali = currentData?.enti_t || "--";
  const sezioniPervenute = currentData?.enti_p || "--";

  return (
    <>
      <Meta
        ogUrl={`https://regionali.trmnet.work/provincia/${provincia}`}
        title={`Provincia di ${provinciaName} - Elezioni Regionali Puglia 2025`}
        description={`Risultati e affluenze della provincia di ${provinciaName} per le elezioni regionali della Puglia 2025`}
      />

      <div className="min-h-screen bg-base-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-screen-2xl px-4 md:px-8 py-8 pt-10 relative z-10">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-4 opacity-60 hidden">
            <ul>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/province"
                  className="hover:text-primary transition-colors"
                >
                  Province
                </Link>
              </li>
              <li>{provinciaName}</li>
            </ul>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <Link
              href="/province"
              className="btn btn-ghost btn-sm gap-2 mb-4 pl-0 hover:bg-transparent hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} /> Torna alle Province
            </Link>
            <h1 className="text-4xl  font-bold mb-2 tracking-tight">
              Provincia di{" "}
              <span className="text-gradient">{provinciaName}</span>
            </h1>
            <h2 className="text-base opacity-80 font-light">
              Dettaglio risultati e affluenze
            </h2>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4"
          >
            <div className="card glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Vote size={24} />
                </div>
                <div>
                  <div className="text-sm opacity-60 uppercase tracking-wider font-semibold">
                    Affluenza
                  </div>
                  <div className="text-3xl font-bold">
                    {parseFloat(affluenzaProvincia).toFixed(2)}
                    {affluenzaProvincia !== "--" ? "%" : ""}
                  </div>
                  <div className="text-xs opacity-50">
                    su{" "}
                    {elettoriProvincia !== "--"
                      ? elettoriProvincia.toLocaleString("it-IT")
                      : "--"}{" "}
                    elettori
                  </div>
                </div>
              </div>
            </div>

            <div className="card glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="text-sm opacity-60 uppercase tracking-wider font-semibold">
                    Sezioni
                  </div>
                  <div className="text-3xl font-bold">
                    {sezioniPervenute} / {sezioniTotali}
                  </div>
                  <div className="text-xs opacity-50">scrutinate</div>
                </div>
              </div>
            </div>

            <div className="card glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 text-accent rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-sm opacity-60 uppercase tracking-wider font-semibold">
                    Comuni
                  </div>
                  <div className="text-3xl font-bold">{numComuni}</div>
                  <div className="text-xs opacity-50">coinvolti</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="card glass-card mb-8 overflow-hidden"
          >
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-content/5 bg-base-100/30">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="text-primary" size={24} />
                  Risultati per Candidato
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200/50 text-base-content/70">
                    <tr>
                      <th className="py-4 pl-6">Candidato</th>
                      <th className="py-4">Lista/Coalizione</th>
                      <th className="text-right py-4">Voti</th>
                      <th className="text-right py-4 pr-6">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatesResults.length > 0 ? (
                      candidatesResults.map((candidate, index) => {
                        const fullName = `${candidate.nome} ${candidate.cogn}`;
                        const coalitionLabel =
                          candidate.cogn.toLowerCase() === "decaro"
                            ? "Coalizione di CSX"
                            : candidate.cogn.toLowerCase() === "lobuono"
                            ? "Coalizione di CDX"
                            : "Lista civica";
                        const percentage = parseFloat(candidate.perc) || 0;

                        return (
                          <tr
                            key={index}
                            className="hover:bg-base-content/5 transition-colors border-b-base-content/5"
                          >
                            <td className="font-medium pl-6 py-4">
                              {fullName}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <div className="badge badge-outline badge-sm">
                                  {coalitionLabel}
                                </div>
                                {/* Simboli liste */}
                                <div className="flex flex-wrap gap-1">
                                  {candidate.liste.map((lista) => (
                                    <div
                                      key={lista.pos}
                                      className="tooltip tooltip-top"
                                      data-tip={lista.desc_lis_c}
                                    >
                                      <div className="size-8 relative rounded hover:opacity-80 transition-opacity">
                                        <Image
                                          src={`/img/regionali2025/${lista.img_lis_c}`}
                                          alt={lista.desc_lis_c}
                                          fill
                                          className="object-contain"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="text-right font-mono font-semibold py-4">
                              {candidate.voti.toLocaleString("it-IT")}
                            </td>
                            <td className="text-right pr-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <span className="badge badge-primary font-bold text-primary-content!">
                                  {percentage.toFixed(2)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center opacity-50 gap-3">
                            <AlertCircle size={48} className="stroke-1" />
                            <p className="text-lg">
                              Dati non ancora disponibili per la provincia di{" "}
                              {provinciaName}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Turnout Section */}
          <motion.div
            id="affluenza-comuni"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="card glass-card overflow-hidden"
          >
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-content/5 bg-base-100/30 flex gap-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Vote className="text-secondary" size={24} />
                  Affluenza per Comune
                </h3>
                <p
                  className={`translate-y-2 ${
                    Number(sezioniPervenute) > 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Ultima rilevazione:{" "}
                  {
                    [
                      "Domenica 23 novembre",
                      "Domenica 23 novembre",
                      "Domenica 23 novembre",
                      "Lunedì 24 novembre",
                    ][phase]
                  }{" "}
                  {["12:00", "19:00", "23:00", "15:00"][phase] || "--:--"}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200/50 text-base-content/70">
                    <tr>
                      <th className="py-4 pl-6">Comune</th>
                      <th className="text-right py-4">Elettori</th>
                      <th className="text-right py-4">Sezioni</th>
                      <th className="text-right py-4">Affluenza %</th>
                      <th className="text-right py-4">Precedente %</th>
                      <th className="text-right py-4 pr-6">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinciaData && provinciaData.enti.enti_f.length > 0 ? (
                      provinciaData.enti.enti_f.map((comune, index) => {
                        const comuneData =
                          phase >= 0 ? comune.com_vot[phase] : null;
                        const affluenza = comuneData?.perc || "--";
                        const precedente = comuneData?.perc_r || "--";
                        const sezioniT = comuneData?.enti_t || 0;
                        const sezioniP = comuneData?.enti_p || 0;
                        const sezioniComplete =
                          sezioniT > 0 && sezioniP === sezioniT;

                        // Calcola il delta percentuale
                        const delta =
                          affluenza !== "--" && precedente !== "--"
                            ? (
                                parseFloat(affluenza) - parseFloat(precedente)
                              ).toFixed(2)
                            : null;

                        return (
                          <tr
                            key={index}
                            className="hover:bg-base-content/5 transition-colors border-b-base-content/5"
                          >
                            <td className="font-medium pl-6 py-4">
                              {comune.desc}
                            </td>
                            <td className="text-right opacity-70 font-mono">
                              {comune.ele_t.toLocaleString("it-IT")}
                            </td>
                            <td className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="opacity-70 font-mono text-sm">
                                  {sezioniP}/{sezioniT}
                                </span>
                                {sezioniT > 0 && (
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      sezioniComplete
                                        ? "bg-success"
                                        : "bg-error animate-ping"
                                    }`}
                                    title={
                                      sezioniComplete
                                        ? "Tutte le sezioni pervenute"
                                        : "Scrutinio in corso"
                                    }
                                  />
                                )}
                              </div>
                            </td>
                            <td className="text-right">
                              <span className="badge badge-primary font-bold text-primary-content!">
                                {parseFloat(affluenza).toFixed(2)}
                                {affluenza !== "--" ? "%" : ""}
                              </span>
                            </td>
                            <td className="text-right opacity-70 font-mono text-sm">
                              {parseFloat(precedente).toFixed(2)}
                              {precedente !== "--" ? "%" : ""}
                            </td>
                            <td className="text-right pr-6">
                              {delta !== null ? (
                                <div className="flex items-center justify-end gap-1">
                                  {parseFloat(delta) > 0 ? (
                                    <>
                                      <TrendingUp
                                        size={16}
                                        className="text-success"
                                      />
                                      <span className="text-success font-semibold text-sm">
                                        +{delta}%
                                      </span>
                                    </>
                                  ) : parseFloat(delta) < 0 ? (
                                    <>
                                      <TrendingDown
                                        size={16}
                                        className="text-error"
                                      />
                                      <span className="text-error font-semibold text-sm">
                                        {delta}%
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Minus size={16} className="opacity-50" />
                                      <span className="opacity-50 font-semibold text-sm">
                                        {delta}%
                                      </span>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <span className="opacity-30 text-sm">--</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center opacity-50 gap-3">
                            <ActivityIcon />
                            <p className="text-lg">
                              Dati comunali in fase di caricamento...
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

const ActivityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { provincia } = context.params!;

  // Validazione delle province
  const validProvinces = [
    "bari",
    "bat",
    "brindisi",
    "foggia",
    "lecce",
    "taranto",
  ];

  if (!validProvinces.includes(provincia as string)) {
    return {
      notFound: true,
    };
  }

  // Il phase dovrebbe essere letto da un file di configurazione o database
  // Per ora lo impostiamo a 0 (primo checkpoint: 12:00)
  const phase = ShamanConfig.phase;

  return {
    props: {
      provincia: provincia as string,
      phase,
    },
  };
};

export default ProvinciaPage;

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import { capitalizeFirstLetter, formatItalianFloat, translatePhase } from "../../lib/utils";
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
  X,
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

interface PreferenzeCandidate {
  cod_lis: number;
  cod_cand: number;
  cogn: string;
  nome: string;
  a_nome: string | null;
  sex: string;
  d_nasc: number;
  l_nasc: string;
  voti: number;
  ele: string;
}

interface PreferenzeLista {
  cod: number;
  desc: string;
  img_lis_c: string;
  flg_ele: string;
  sez_perv: number;
  sez_tot: number;
}

interface PreferenzeData {
  liste: PreferenzeLista[];
  cand: PreferenzeCandidate[];
}

interface ElettoCandidate {
  cod_lis: number;
  cogn: string;
  nome: string;
  a_nome: string | null;
  d_nasc: number;
  cod_circ: number;
  desc_circ: string;
  sex: string;
  l_nasc: string;
}

interface ElettiLista {
  pos: number;
  desc_lis: string;
  img_lis: string;
  n_eletti: number;
}

interface ElettiCoalition {
  cod_coal: number;
  cogn: string;
  nome: string;
  a_nome: string | null;
  desc_lis_r: string | null;
  img_lis_r: string | null;
  n_eletti: number;
  liste: ElettiLista[] | null;
  cand: ElettoCandidate[] | null;
}

interface ElettiData {
  coal: ElettiCoalition[];
}

interface ScrutiniData {
  cand: CandidateResult[];
}

const ProvinciaPage: React.FC<ProvinciaPageProps> = ({ provincia, phase }) => {
  const [provinciaData, setProvinciaData] = useState<ProvinciaData>();
  const [candidatesResults, setCandidatesResults] = useState<CandidateResult[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);
  const [preferenzeData, setPreferenzeData] = useState<PreferenzeData | null>(null);
  const [selectedCandidatePreferenze, setSelectedCandidatePreferenze] = useState<CandidateResult | null>(null);
  const [elettiData, setElettiData] = useState<ElettiData | null>(null);
  const [showEletti, setShowEletti] = useState<boolean>(false);

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
    fetch(`${ShamanConfig.fetchDataURL}/data/affluenze-${provincia}.json?t=${timestamp}`, {
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
    fetch(`${ShamanConfig.fetchDataURL}/data/scrutini-provincia-${provinciaFileName}.json?t=${timestamp}`, {
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

    // Carica preferenze
    fetch(`${ShamanConfig.fetchDataURL}/data/preferenze-provincia-${provinciaFileName}.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((data: PreferenzeData) => {
        console.log(`Preferenze data fetched for ${provincia}:`, data);
        setPreferenzeData(data);
      })
      .catch((error) => {
        console.error(`Error fetching preferenze data for ${provincia}:`, error);
      });

    // Carica eletti regione Puglia
    fetch(`${ShamanConfig.fetchDataURL}/data/eletti-puglia.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((data: ElettiData) => {
        console.log('Eletti Puglia data fetched:', data);
        setElettiData(data);
      })
      .catch((error) => {
        console.error('Error fetching eletti data:', error);
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
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4"
          >
            <div className="card glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Vote size={24} />
                </div>
                <div>
                  <div className="text-sm opacity-60 uppercase tracking-wider font-semibold">
                    Affluenza alle ore {phase >= 0 ? translatePhase(phase) : "--:--"}
                  </div>
                  <div className="text-3xl font-bold">
                    {affluenzaProvincia !== "--" 
                      ? formatItalianFloat(parseFloat(affluenzaProvincia.replace(',', '.')  )) + "%"
                      : "--"}
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

            {/* Pulsante Eletti Regione */}
            <div className="card glass-card p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all border-2 border-success/20 hover:border-success/50" onClick={() => setShowEletti(true)}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 text-success rounded-xl">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-sm opacity-60 uppercase tracking-wider font-semibold">
                    Eletti Puglia
                  </div>
                  <div className="text-3xl font-bold">
                    {elettiData?.coal.reduce((sum, c) => sum + c.n_eletti, 0) || "--"}
                  </div>
                  <div className="text-xs text-success font-semibold flex items-center gap-1">
                    <span>👆</span> Clicca per dettagli
                  </div>
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Users className="text-primary" size={24} />
                      Risultati per Candidato
                    </h3>
                    <p className="text-xs text-primary mt-1 flex items-center gap-1">
                      <span>👆</span> Clicca sul nome per vedere le preferenze
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden">
                <table className="table w-full table-xs md:table-md">
                  <thead className="bg-base-200/50 text-base-content/70">
                    <tr>
                      <th className="py-4 pl-2 md:pl-6"></th>
                      <th className="py-4 pl-2 md:pl-6">Candidato</th>
                      <th className="py-4 hidden md:table-cell">Lista/Coalizione</th>
                      <th className="text-right py-4">Voti</th>
                      <th className="text-right py-4 pr-2 md:pr-6">%</th>
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
                        const percentage = parseFloat(candidate.perc.replace(',', '.')) || 0;
                        const imageSlug = candidate.cogn.toLowerCase();

                        return (
                          <tr
                            key={index}
                            className="hover:bg-base-content/5 transition-colors border-b-base-content/5"
                          >
                            <td className="pl-2 md:pl-6 py-2">
                              <div className="avatar">
                                <div className="size-12 rounded-md">
                                  <Image
                                    src={`/img/candidati/${imageSlug}.webp`}
                                    alt={fullName}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="font-medium pl-2 md:pl-6 py-4 text-xs md:text-sm">
                              <button 
                                className="hover:text-primary transition-colors underline decoration-dotted cursor-pointer"
                                onClick={() => setSelectedCandidatePreferenze(candidate)}
                                title="Clicca per vedere le preferenze"
                              >
                                {fullName}
                              </button>
                            </td>
                            <td className="py-4 hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="badge badge-outline truncate badge-sm">
                                  {coalitionLabel}
                                </div>
                                {/* Simboli liste - cliccabili */}
                                <div 
                                  className="flex-wrap gap-1 flex cursor-pointer"
                                  onClick={() => setSelectedCandidate(candidate)}
                                  title="Clicca per vedere i dettagli delle liste"
                                >
                                  {candidate.liste.map((lista) => (
                                    <div
                                      key={lista.pos}
                                      className="tooltip tooltip-top"
                                      data-tip={lista.desc_lis_c}
                                    >
                                      <div className="size-8 relative rounded hover:opacity-80 hover:ring-2 hover:ring-primary transition-all">
                                        <Image
                                          src={`/img/regionali2025/${lista.img_lis_c}`}
                                          alt={lista.desc_lis_c}
                                          fill
                                          sizes="32px"
                                          className="object-contain"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="text-right font-mono font-semibold py-4 text-xs md:text-sm">
                              {candidate.voti.toLocaleString("it-IT")}
                            </td>
                            <td className="text-right pr-2 md:pr-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <span className="badge badge-primary badge-xs md:badge-sm font-bold text-primary-content!">
                                  {formatItalianFloat(percentage)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
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
              <div className="p-6 border-b border-base-content/5 bg-base-100/30 flex gap-4 md:gap-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Vote className="text-secondary hidden md:block" size={24} />
                  Affluenza per Comune alle ore {phase >= 0 ? translatePhase(phase) : "--:--"}
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
                                parseFloat(affluenza.replace(',', '.')) - parseFloat(precedente.replace(',', '.'))
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
                                {affluenza !== "--" 
                                  ? formatItalianFloat(parseFloat(affluenza.replace(',', '.'))) + "%"
                                  : "--"}
                              </span>
                            </td>
                            <td className="text-right opacity-70 font-mono text-sm">
                              {precedente !== "--"
                                ? formatItalianFloat(parseFloat(precedente.replace(',', '.'))) + "%"
                                : "--"}
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
                                        +{formatItalianFloat(parseFloat(delta))}%
                                      </span>
                                    </>
                                  ) : parseFloat(formatItalianFloat(parseFloat(delta))) < 0 ? (
                                    <>
                                      <TrendingDown
                                        size={16}
                                        className="text-error"
                                      />
                                      <span className="text-error font-semibold text-sm">
                                        {formatItalianFloat(parseFloat(delta))}%
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

        {/* Modal dettaglio liste candidato */}
        {selectedCandidate && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl bg-base-100 overscroll-contain">
              {/* Header modale */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs opacity-50 uppercase tracking-wider mb-1">
                    Provincia di {provinciaName}
                  </p>
                  <h3 className="text-xl font-bold">
                    {selectedCandidate.nome} {selectedCandidate.cogn}
                  </h3>
                  <p className="text-sm opacity-60">
                    Dettaglio voti per lista
                  </p>
                </div>
                <button
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={() => setSelectedCandidate(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Statistiche totali */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="card bg-primary/10 border border-primary/20 p-4">
                  <div className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">
                    Voti Candidato
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {selectedCandidate.voti.toLocaleString("it-IT")}
                  </div>
                  <div className="badge badge-primary badge-sm mt-2 font-bold text-primary-content!">
                    {formatItalianFloat(parseFloat(selectedCandidate.perc.replace(',', '.')))}%
                  </div>
                </div>

                <div className="card bg-secondary/10 border border-secondary/20 p-4">
                  <div className="text-xs font-semibold text-secondary/70 uppercase tracking-wider mb-1">
                    Voti Liste
                  </div>
                  <div className="text-2xl font-bold text-secondary">
                    {selectedCandidate.tot_vot_lis.toLocaleString("it-IT")}
                  </div>
                  <div className="badge badge-secondary badge-sm mt-2 font-bold text-white">
                    {formatItalianFloat(parseFloat(selectedCandidate.perc_lis.replace(',', '.')))}%
                  </div>
                </div>
              </div>

              {/* Tabella liste */}
              <div className="overflow-x-auto">
                <table className="table table-sm">
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
                              sizes="32px"
                              className="object-contain p-0.5"
                            />
                          </div>
                        </td>
                        <td className="text-sm font-medium">{lista.desc_lis_c}</td>
                        <td className="text-right font-mono text-sm font-semibold">
                          {lista.voti.toLocaleString("it-IT")}
                        </td>
                        <td className="text-right">
                          <span className="badge badge-primary badge-sm text-primary-content!">
                            {formatItalianFloat(parseFloat(lista.perc.replace(',', '.')))}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold border-t-2">
                      <td colSpan={2} className="text-sm">
                        Totale Liste
                      </td>
                      <td className="text-right font-mono text-sm">
                        {selectedCandidate.tot_vot_lis.toLocaleString("it-IT")}
                      </td>
                      <td className="text-right">
                        <span className="badge badge-secondary badge-sm text-white">
                          {formatItalianFloat(parseFloat(selectedCandidate.perc_lis.replace(',', '.')))}%
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setSelectedCandidate(null)}
            />
          </div>
        )}

        {/* Modal preferenze candidato */}
        {selectedCandidatePreferenze && preferenzeData && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl max-h-[90vh] bg-base-100 overscroll-contain">
              {/* Header modale */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs opacity-50 uppercase tracking-wider mb-1">
                    Provincia di {provinciaName}
                  </p>
                  <h3 className="text-xl font-bold">
                    Preferenze - {selectedCandidatePreferenze.nome} {selectedCandidatePreferenze.cogn}
                  </h3>
                  <p className="text-sm opacity-60">
                    Voti di preferenza per ogni lista della coalizione
                  </p>
                </div>
                <button
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={() => setSelectedCandidatePreferenze(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabella preferenze per lista */}
              <div className="overflow-x-auto">
                {selectedCandidatePreferenze.liste.map((lista) => {
                  // Filtra i candidati di questa lista
                  const candidatiLista = preferenzeData.cand
                    .filter((c) => c.cod_lis === lista.pos)
                    .sort((a, b) => b.voti - a.voti);

                  const listaInfo = preferenzeData.liste.find((l) => l.cod === lista.pos);

                  return (
                    <div key={lista.pos} className="mb-6">
                      {/* Header lista */}
                      <div className="flex items-center gap-3 mb-3 bg-base-200/50 p-3 rounded-lg">
                        <div className="w-10 h-10 relative rounded border border-base-content/10">
                          <Image
                            src={`/img/regionali2025/${lista.img_lis_c}`}
                            alt={lista.desc_lis_c}
                            fill
                            sizes="40px"
                            className="object-contain p-0.5"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{lista.desc_lis_c}</h4>
                          <p className="text-xs opacity-60">
                            {listaInfo?.sez_perv || 0} / {listaInfo?.sez_tot || 0} sezioni pervenute
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {lista.voti.toLocaleString("it-IT")}
                          </div>
                          <div className="text-xs opacity-60">voti lista</div>
                        </div>
                      </div>

                      {/* Tabella candidati */}
                      <table className="table table-xs">
                        <thead>
                          <tr className="text-[10px]">
                            <th className="w-8">#</th>
                            <th>Candidato</th>
                            <th className="hidden md:table-cell">Nato a</th>
                            <th className="text-right">Voti preferenza</th>
                            <th className="text-center hidden md:table-cell">Eletto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidatiLista.map((cand, idx) => (
                            <tr key={cand.cod_cand} className="hover">
                              <td className="text-xs opacity-60">{idx + 1}</td>
                              <td className="text-xs">
                                <div className="font-semibold">
                                  {cand.nome} {cand.cogn}
                                  {cand.a_nome && (
                                    <span className="font-normal opacity-60 ml-1">({cand.a_nome})</span>
                                  )}
                                </div>
                              </td>
                              <td className="text-xs opacity-60 hidden md:table-cell">{cand.l_nasc}</td>
                              <td className="text-right font-mono text-xs font-semibold">
                                {cand.voti.toLocaleString("it-IT")}
                              </td>
                              <td className="text-center hidden md:table-cell">
                                {cand.ele === "S" ? (
                                  <span className="badge badge-success badge-xs text-white">{cand.sex === "F" ? "Eletta" : "Eletto"}</span>
                                ) : (
                                  <span className="opacity-30 text-xs">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setSelectedCandidatePreferenze(null)}
            />
          </div>
        )}

        {/* Modal Eletti Regione Puglia */}
        {showEletti && elettiData && (
          <div className="modal modal-open">
            <div className="modal-box max-w-6xl max-h-[90vh] bg-base-100 overscroll-contain">
              {/* Header modale */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">
                    Consiglieri Eletti - Regione Puglia
                  </h3>
                  <p className="text-sm opacity-60">
                    Totale: {elettiData.coal.reduce((sum, c) => sum + c.n_eletti, 0)} consiglieri eletti
                  </p>
                </div>
                <button
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={() => setShowEletti(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Sezioni per coalizione */}
              <div className="space-y-6">
                {elettiData.coal.map((coalizione) => {
                  if (!coalizione.liste || !coalizione.cand) return null;

                  return (
                    <div key={coalizione.cod_coal} className="card bg-base-200/30 border border-base-content/10">
                      {/* Header Coalizione */}
                      <div className="p-4 bg-base-300/30 border-b border-base-content/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-bold">
                              {coalizione.nome} {coalizione.cogn}
                            </h4>
                            <p className="text-xs opacity-60">Candidato Presidente</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-success">
                              {coalizione.n_eletti}
                            </div>
                            <div className="text-xs opacity-60">eletti</div>
                          </div>
                        </div>

                        {/* Liste della coalizione */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {coalizione.liste.map((lista) => (
                            <div
                              key={lista.pos}
                              className="badge badge-outline gap-2"
                            >
                              <div className="w-5 h-5 relative">
                                <Image
                                  src={`/img/regionali2025/${lista.img_lis}`}
                                  alt={lista.desc_lis}
                                  fill
                                  sizes="20px"
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-xs">
                                {lista.desc_lis} ({lista.n_eletti})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tabella Eletti */}
                      <div className="p-4">
                        <table className="table table-sm">
                          <thead>
                            <tr className="text-xs">
                              <th className="w-8">#</th>
                              <th>Nome</th>
                              <th className="hidden md:table-cell">Circoscrizione</th>
                              <th className="hidden lg:table-cell">Nato a</th>
                              <th className="text-center">Lista</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coalizione.cand.map((eletto, idx) => {
                              const lista = coalizione.liste?.find(l => l.pos === eletto.cod_lis);
                              return (
                                <tr key={`${eletto.cod_lis}-${eletto.cogn}-${idx}`} className="hover">
                                  <td className="text-xs opacity-60">{idx + 1}</td>
                                  <td className="font-semibold text-sm">
                                    {eletto.nome} {eletto.cogn}
                                    {eletto.a_nome && (
                                      <span className="font-normal opacity-60 ml-1">({eletto.a_nome})</span>
                                    )}
                                  </td>
                                  <td className="text-xs opacity-70 hidden md:table-cell">
                                    {eletto.desc_circ}
                                  </td>
                                  <td className="text-xs opacity-60 hidden lg:table-cell">
                                    {eletto.l_nasc}
                                  </td>
                                  <td className="text-center">
                                    {lista && (
                                      <div className="tooltip" data-tip={lista.desc_lis}>
                                        <div className="w-6 h-6 relative mx-auto">
                                          <Image
                                            src={`/img/regionali2025/${lista.img_lis}`}
                                            alt={lista.desc_lis}
                                            fill
                                            sizes="24px"
                                            className="object-contain"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setShowEletti(false)}
            />
          </div>
        )}
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

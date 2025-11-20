import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart2, PieChart, Activity, Info, AlertCircle } from "lucide-react";

const RisultatiPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Risultati Elezioni Regionali Puglia 2025</title>
        <meta
          name="description"
          content="Risultati in tempo reale delle elezioni regionali della Puglia 2025"
        />
      </Head>

      <div className="min-h-screen bg-base-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-4 opacity-60">
            <ul>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>Risultati</li>
            </ul>
          </div>

          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                Risultati{" "}
                <span className="font-light text-gradient">Elettorali</span>
              </h1>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-light opacity-80 tracking-widest uppercase">
                  Puglia 2025
                </h2>
                <div className="badge badge-info gap-2 animate-pulse">
                  <Activity size={12} /> Scrutinio in corso
                </div>
              </div>
            </motion.div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card glass-card"
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <PieChart size={24} />
                  </div>
                  <h3 className="card-title">Affluenza Generale</h3>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <span className="opacity-70">Totale votanti</span>
                  <span className="text-4xl font-bold">-- %</span>
                </div>
                <progress
                  className="progress progress-primary w-full h-3"
                  value={0}
                  max="100"
                ></progress>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card glass-card"
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                    <BarChart2 size={24} />
                  </div>
                  <h3 className="card-title">Sezioni Scrutinate</h3>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <span className="opacity-70">Avanzamento spoglio</span>
                  <span className="text-4xl font-bold">
                    0 <span className="text-lg opacity-50 font-sans">/ 0</span>
                  </span>
                </div>
                <progress
                  className="progress progress-secondary w-full h-3"
                  value={0}
                  max="100"
                ></progress>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card glass-card overflow-hidden"
          >
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-content/5 bg-base-100/30">
                <h3 className="card-title text-2xl font-bold">
                  Riepilogo Presidente
                </h3>
                <p className="opacity-70 text-sm">
                  Dati aggregati a livello regionale
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="alert bg-info/10 text-info border-info/20">
                  <AlertCircle size={20} />
                  <span>
                    I risultati ufficiali saranno disponibili a partire dalle
                    ore 15:00 di lunedì.
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="border-b-base-content/10 text-base-content/60 uppercase text-xs tracking-wider">
                        <th className="bg-transparent">Candidato</th>
                        <th className="bg-transparent">Lista/Coalizione</th>
                        <th className="text-right bg-transparent">Voti</th>
                        <th className="text-right bg-transparent">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-12 text-base-content/40"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <BarChart2 size={48} className="opacity-20" />
                            <span>Dati non ancora disponibili</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RisultatiPage;

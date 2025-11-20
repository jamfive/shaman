import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Clock, TrendingUp, Info } from "lucide-react";

const AffluentePage: React.FC = () => {
  const provinces = [
    { name: "Bari", votanti: 0, aventi_diritto: 0, percentuale: 0 },
    {
      name: "Barletta-Andria-Trani",
      votanti: 0,
      aventi_diritto: 0,
      percentuale: 0,
    },
    { name: "Brindisi", votanti: 0, aventi_diritto: 0, percentuale: 0 },
    { name: "Foggia", votanti: 0, aventi_diritto: 0, percentuale: 0 },
    { name: "Lecce", votanti: 0, aventi_diritto: 0, percentuale: 0 },
    { name: "Taranto", votanti: 0, aventi_diritto: 0, percentuale: 0 },
  ];

  const timeStats = [
    { time: "12:00", value: "--%", label: "Domenica" },
    { time: "19:00", value: "--%", label: "Domenica" },
    { time: "23:00", value: "--%", label: "Domenica" },
    { time: "15:00", value: "--%", label: "Lunedì" },
  ];

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
      <Head>
        <title>Affluenze Elezioni Regionali Puglia 2025</title>
        <meta
          name="description"
          content="Affluenze in tempo reale delle elezioni regionali della Puglia 2025 per provincia"
        />
      </Head>

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
              <li>Affluenze</li>
            </ul>
          </div>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Affluenze{" "}
              <span className="font-light text-gradient">Elettorali</span>
            </h1>
            <h2 className="text-xl font-light opacity-80 tracking-widest uppercase">
              Puglia 2025
            </h2>
          </motion.header>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {timeStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={item}
                className="card glass-card text-center py-6"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 opacity-70 text-sm">
                    <Clock size={14} />
                    <span>Ore {stat.time}</span>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider opacity-50">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
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
                    Affluenza per Provincia
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
                        Aventi diritto
                      </th>
                      <th className="text-right bg-transparent">Votanti</th>
                      <th className="text-right bg-transparent">Affluenza %</th>
                      <th className="bg-transparent pr-6">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinces.map((provincia, index) => (
                      <tr
                        key={index}
                        className="hover:bg-base-content/5 transition-colors border-b-base-content/5"
                      >
                        <td className="font-medium pl-6 py-4">
                          {provincia.name}
                        </td>
                        <td className="text-right opacity-70 font-mono">
                          {provincia.aventi_diritto.toLocaleString("it-IT") ||
                            "--"}
                        </td>
                        <td className="text-right opacity-70 font-mono">
                          {provincia.votanti.toLocaleString("it-IT") || "--"}
                        </td>
                        <td className="text-right">
                          <span className="badge badge-primary badge-outline font-bold">
                            {provincia.percentuale}%
                          </span>
                        </td>
                        <td className="pr-6 w-32">
                          <progress
                            className="progress progress-primary w-full h-2"
                            value={provincia.percentuale}
                            max="100"
                          ></progress>
                        </td>
                      </tr>
                    ))}
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

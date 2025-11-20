import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Map, BarChart2, ArrowRight, Activity } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Elezioni Regionali Puglia 2025</title>
        <meta
          name="description"
          content="Risultati e affluenze delle elezioni regionali della Puglia 2025"
        />
      </Head>

      <div className="min-h-screen bg-base-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <main className="container mx-auto px-4 py-12 pt-24 relative z-10">
          {/* Hero Section */}
          <div className="hero min-h-[60vh] flex flex-col justify-center items-center text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-content/5 backdrop-blur-sm border border-base-content/10 mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                </span>
                <span className="text-sm font-medium tracking-wide uppercase">
                  Live Update
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                Elezioni Regionali <br />
                <span className="text-gradient">Puglia 2025</span>
              </h1>

              <p className="py-6 text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
                La piattaforma ufficiale per seguire in tempo reale lo spoglio,
                le affluenze e i risultati definitivi delle elezioni regionali.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  href="/risultati"
                  className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                  <BarChart2 size={20} />
                  Risultati in Diretta
                </Link>
                <Link
                  href="/affluenze"
                  className="btn btn-outline btn-lg gap-2 backdrop-blur-sm hover:bg-base-content/5"
                >
                  <Activity size={20} />
                  Dati Affluenza
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Link href="/candidati" className="group">
              <div className="card glass-card h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Users size={150} />
                </div>
                <div className="card-body relative z-10">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-primary" size={24} />
                  </div>
                  <h3 className="card-title text-2xl mb-2">Candidati</h3>
                  <p className="opacity-70 mb-4">
                    Profili completi dei candidati alla presidenza e liste
                    collegate.
                  </p>
                  <div className="card-actions justify-end mt-auto">
                    <span className="btn btn-ghost btn-sm gap-2 group-hover:translate-x-2 transition-transform">
                      Esplora <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/province" className="group">
              <div className="card glass-card h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Map size={150} />
                </div>
                <div className="card-body relative z-10">
                  <div className="p-3 bg-secondary/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Map className="text-secondary" size={24} />
                  </div>
                  <h3 className="card-title text-2xl mb-2">Province</h3>
                  <p className="opacity-70 mb-4">
                    Dati dettagliati suddivisi per le 6 province pugliesi.
                  </p>
                  <div className="card-actions justify-end mt-auto">
                    <span className="btn btn-ghost btn-sm gap-2 group-hover:translate-x-2 transition-transform">
                      Mappa <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/affluenze" className="group">
              <div className="card glass-card h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Activity size={150} />
                </div>
                <div className="card-body relative z-10">
                  <div className="p-3 bg-accent/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Activity className="text-accent" size={24} />
                  </div>
                  <h3 className="card-title text-2xl mb-2">Affluenze</h3>
                  <p className="opacity-70 mb-4">
                    Monitoraggio costante della partecipazione al voto.
                  </p>
                  <div className="card-actions justify-end mt-auto">
                    <span className="btn btn-ghost btn-sm gap-2 group-hover:translate-x-2 transition-transform">
                      Dati <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default HomePage;

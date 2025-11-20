import React from "react";
import Head from "next/head";
import Link from "next/link";
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
} from "lucide-react";

interface ProvinciaPageProps {
  provincia: string;
}

const ProvinciaPage: React.FC<ProvinciaPageProps> = ({ provincia }) => {
  const provinciaName =
    provincia === "bat"
      ? "Barletta-Andria-Trani"
      : capitalizeFirstLetter(provincia);

  return (
    <>
      <Head>
        <title>
          Provincia di {provinciaName} - Elezioni Regionali Puglia 2025
        </title>
        <meta
          name="description"
          content={`Risultati e affluenze della provincia di ${provinciaName} per le elezioni regionali della Puglia 2025`}
        />
      </Head>

      <div className="min-h-screen bg-base-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]" />
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
            className="mb-12"
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
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
                  <div className="text-3xl font-bold">--%</div>
                  <div className="text-xs opacity-50">su -- aventi diritto</div>
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
                  <div className="text-3xl font-bold">-- / --</div>
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
                  <div className="text-3xl font-bold">--</div>
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
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Turnout Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="card glass-card overflow-hidden"
          >
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-content/5 bg-base-100/30">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Vote className="text-secondary" size={24} />
                  Affluenza per Comune
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200/50 text-base-content/70">
                    <tr>
                      <th className="py-4 pl-6">Comune</th>
                      <th className="text-right py-4">Aventi diritto</th>
                      <th className="text-right py-4">Votanti</th>
                      <th className="text-right py-4 pr-6">Affluenza %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center opacity-50 gap-3">
                          <ActivityIcon />
                          <p className="text-lg">
                            Dati comunali in fase di caricamento...
                          </p>
                        </div>
                      </td>
                    </tr>
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

  return {
    props: {
      provincia: provincia as string,
    },
  };
};

export default ProvinciaPage;

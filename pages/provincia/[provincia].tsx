import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { capitalizeFirstLetter } from '../../lib/utils';

interface ProvinciaPageProps {
  provincia: string;
}

const ProvinciaPage: React.FC<ProvinciaPageProps> = ({ provincia }) => {
  const provinciaName = provincia === 'bat' ? 'Barletta-Andria-Trani' : capitalizeFirstLetter(provincia);

  return (
    <>
      <Head>
        <title>Provincia di {provinciaName} - Elezioni Regionali Puglia 2025</title>
        <meta name="description" content={`Risultati e affluenze della provincia di ${provinciaName} per le elezioni regionali della Puglia 2025`} />
      </Head>

      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Provincia di {provinciaName}</h1>
            <h2 className="text-2xl font-light text-primary">Elezioni Regionali Puglia 2025</h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Affluenza</h3>
                <div className="stat-value text-primary">--%</div>
                <div className="stat-desc">su -- aventi diritto</div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Sezioni</h3>
                <div className="stat-value text-secondary">-- / --</div>
                <div className="stat-desc">scrutinate</div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Comuni</h3>
                <div className="stat-value text-accent">--</div>
                <div className="stat-desc">coinvolti</div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">Risultati per Candidato</h3>
              
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Candidato</th>
                      <th>Lista/Coalizione</th>
                      <th className="text-right">Voti</th>
                      <th className="text-right">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500">
                        Dati non ancora disponibili per la provincia di {provinciaName}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">Affluenza per Comune</h3>
              
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Comune</th>
                      <th className="text-right">Aventi diritto</th>
                      <th className="text-right">Votanti</th>
                      <th className="text-right">Affluenza %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500">
                        Dati comunali in fase di caricamento...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { provincia } = context.params!;
  
  // Validazione delle province
  const validProvinces = ['bari', 'bat', 'brindisi', 'foggia', 'lecce', 'taranto'];
  
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
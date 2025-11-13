import React from 'react';
import Head from 'next/head';

const RisultatiPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Risultati Elezioni Regionali Puglia 2025</title>
        <meta name="description" content="Risultati in tempo reale delle elezioni regionali della Puglia 2025" />
      </Head>
      
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Risultati Elezioni Regionali</h1>
            <h2 className="text-2xl font-light text-primary">Puglia 2025</h2>
            <div className="badge badge-info mt-4">Scrutinio in corso...</div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Affluenza Generale</h3>
                <div className="flex justify-between items-center">
                  <span>Totale votanti:</span>
                  <span className="font-bold">-- %</span>
                </div>
                <progress className="progress progress-primary w-full" value={0} max="100"></progress>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Sezioni Scrutinate</h3>
                <div className="flex justify-between items-center">
                  <span>Sezioni:</span>
                  <span className="font-bold">0 / 0</span>
                </div>
                <progress className="progress progress-secondary w-full" value={0} max="100"></progress>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">Candidati Presidente</h3>
              
              <div className="space-y-4">
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>I risultati saranno disponibili a partire dalle ore 15:00 di lunedì.</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
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
                          Dati non ancora disponibili
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RisultatiPage;
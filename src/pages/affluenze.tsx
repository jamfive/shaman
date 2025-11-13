import React from 'react';
import Head from 'next/head';

const AffluentePage: React.FC = () => {
  const provinces = [
    { name: 'Bari', votanti: 0, aventi_diritto: 0, percentuale: 0 },
    { name: 'Barletta-Andria-Trani', votanti: 0, aventi_diritto: 0, percentuale: 0 },
    { name: 'Brindisi', votanti: 0, aventi_diritto: 0, percentuale: 0 },
    { name: 'Foggia', votanti: 0, aventi_diritto: 0, percentuale: 0 },
    { name: 'Lecce', votanti: 0, aventi_diritto: 0, percentuale: 0 },
    { name: 'Taranto', votanti: 0, aventi_diritto: 0, percentuale: 0 },
  ];

  return (
    <>
      <Head>
        <title>Affluenze Elezioni Regionali Puglia 2025</title>
        <meta name="description" content="Affluenze in tempo reale delle elezioni regionali della Puglia 2025 per provincia" />
      </Head>
      
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Affluenze <span className="font-light">Elezioni Regionali</span></h1>
            <h2 className="text-2xl font-light text-primary">Puglia 2025</h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat bg-base-200 rounded-box shadow">
              <div className="stat-title">Ore 12:00</div>
              <div className="stat-value text-primary">--%</div>
            </div>
            <div className="stat bg-base-200 rounded-box shadow">
              <div className="stat-title">Ore 19:00</div>
              <div className="stat-value text-primary">--%</div>
            </div>
            <div className="stat bg-base-200 rounded-box shadow">
              <div className="stat-title">Ore 23:00</div>
              <div className="stat-value text-primary">--%</div>
            </div>
            <div className="stat bg-base-200 rounded-box shadow">
              <div className="stat-title">Ore 15:00 (Lun)</div>
              <div className="stat-value text-primary">--%</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">Affluenza per Provincia</h3>
              
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Provincia</th>
                      <th className="text-right">Aventi diritto</th>
                      <th className="text-right">Votanti</th>
                      <th className="text-right">Affluenza %</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinces.map((provincia, index) => (
                      <tr key={index} className="hover:bg-base-50">
                        <td className="font-medium">{provincia.name}</td>
                        <td className="text-right">{provincia.aventi_diritto.toLocaleString('it-IT') || '--'}</td>
                        <td className="text-right">{provincia.votanti.toLocaleString('it-IT') || '--'}</td>
                        <td className="text-right">
                          <span className="badge badge-primary text-primary-content!">
                            {provincia.percentuale}%
                          </span>
                        </td>
                        <td>
                          <progress 
                            className="progress progress-primary w-20" 
                            value={provincia.percentuale} 
                            max="100"
                          ></progress>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="alert alert-info mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>I dati delle affluenze vengono aggiornati ad orari spcifici durante le ore di votazione.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AffluentePage;
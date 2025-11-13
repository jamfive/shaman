import React from 'react';
import Head from 'next/head';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Elezioni Regionali Puglia 2025</title>
        <meta name="description" content="Risultati e affluenze delle elezioni regionali della Puglia 2025" />
      </Head>
      
      <div className="min-h-screen bg-base-100">
        <main className="container mx-auto px-4 py-8">
          <div className="hero min-h-96">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">Elezioni Regionali</h1>
                <h2 className="text-3xl font-light text-primary">Puglia 2025</h2>
                <p className="py-6">
                  Segui in tempo reale i risultati delle elezioni regionali della Puglia.
                  Risultati, affluenze e analisi complete.
                </p>
                <div className="flex gap-4 justify-center">
                  <a href="/risultati" className="btn btn-primary">
                    Risultati
                  </a>
                  <a href="/affluenze" className="btn btn-outline">
                    Affluenze
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Candidati</h3>
                <p>Visualizza tutti i candidati alla presidenza della Regione Puglia</p>
                <div className="card-actions justify-end">
                  <a href="/candidati" className="btn btn-sm btn-primary">Vedi</a>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Province</h3>
                <p>Risultati divisi per provincia: Bari, BAT, Brindisi, Foggia, Lecce, Taranto</p>
                <div className="card-actions justify-end">
                  <a href="/province" className="btn btn-sm btn-primary">Vedi</a>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Affluenze</h3>
                <p>Partecipazione al voto in tempo reale per tutte le province</p>
                <div className="card-actions justify-end">
                  <a href="/affluenze" className="btn btn-sm btn-primary">Vedi</a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;
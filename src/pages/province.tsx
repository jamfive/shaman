import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';

interface Province {
  name: string;
  slug: string;
  capital: string;
  population: number;
  municipalities: number;
  turnout: number;
  votedCount: number;
  totalVoters: number;
  leadingCandidate: string;
  leadingPercentage: number;
}

interface ProvincePageProps {
  provinces: Province[];
  totalPopulation: number;
  totalMunicipalities: number;
  avgTurnout: number;
}

const ProvincePage: React.FC<ProvincePageProps> = ({ 
  provinces, 
  totalPopulation, 
  totalMunicipalities, 
  avgTurnout 
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li>Province</li>
        </ul>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Province della Puglia</h1>
        <p className="text-lg opacity-80">
          Risultati elettorali suddivisi per provincia - Elezioni Regionali 2025
        </p>
      </div>

      {/* Regional Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow mb-8 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div className="stat-title">Province</div>
          <div className="stat-value text-primary">{provinces.length}</div>
          <div className="stat-desc">Territori della Puglia</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <div className="stat-title">Comuni</div>
          <div className="stat-value text-secondary">{totalMunicipalities}</div>
          <div className="stat-desc">Totale comuni pugliesi</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Popolazione</div>
          <div className="stat-value">{totalPopulation.toLocaleString('it-IT')}</div>
          <div className="stat-desc">Abitanti totali</div>
        </div>

        <div className="stat">
          <div className="stat-title">Affluenza Media</div>
          <div className="stat-value">{avgTurnout.toFixed(1)}%</div>
          <div className="stat-desc">Media regionale</div>
        </div>
      </div>

      {/* Provinces Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {provinces.map((province) => (
          <Link 
            key={province.slug} 
            href={`/provincia/${province.slug}`}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
          >
            <div className="card-body">
              {/* Province Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="card-title text-2xl mb-1">{province.name}</h2>
                  <p className="text-sm opacity-70">Capoluogo: {province.capital}</p>
                </div>
                <div className="badge badge-lg badge-primary">{province.slug.toUpperCase()}</div>
              </div>

              {/* Province Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Popolazione:</span>
                  <span className="font-semibold">{province.population.toLocaleString('it-IT')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Comuni:</span>
                  <span className="font-semibold">{province.municipalities}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Votanti:</span>
                  <span className="font-semibold">{province.votedCount.toLocaleString('it-IT')}</span>
                </div>
              </div>

              {/* Turnout */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Affluenza</span>
                  <span className="text-lg font-bold text-primary">{province.turnout}%</span>
                </div>
                <progress 
                  className="progress progress-primary w-full" 
                  value={province.turnout} 
                  max="100"
                ></progress>
              </div>

              {/* Leading Candidate */}
              <div className="divider my-2"></div>
              <div>
                <p className="text-xs opacity-70 mb-1">Candidato in testa:</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">{province.leadingCandidate}</span>
                  <span className="badge badge-success">{province.leadingPercentage}%</span>
                </div>
              </div>

              {/* Link indicator */}
              <div className="card-actions justify-end mt-4">
                <div className="btn btn-primary btn-sm">
                  Vedi dettagli
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Alert */}
      <div className="alert alert-info mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Clicca su una provincia per visualizzare i risultati dettagliati e l&apos;affluenza per comune</span>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ProvincePageProps> = async () => {
  const provinces: Province[] = [
    {
      name: "Bari",
      slug: "bari",
      capital: "Bari",
      population: 1234567,
      municipalities: 41,
      turnout: 68.5,
      votedCount: 845678,
      totalVoters: 1234567,
      leadingCandidate: "Michele Emiliano",
      leadingPercentage: 45.2,
    },
    {
      name: "Barletta-Andria-Trani",
      slug: "bat",
      capital: "Andria",
      population: 392863,
      municipalities: 10,
      turnout: 62.3,
      votedCount: 244714,
      totalVoters: 392863,
      leadingCandidate: "Raffaele Fitto",
      leadingPercentage: 41.8,
    },
    {
      name: "Brindisi",
      slug: "brindisi",
      capital: "Brindisi",
      population: 392598,
      municipalities: 20,
      turnout: 65.7,
      votedCount: 257897,
      totalVoters: 392598,
      leadingCandidate: "Michele Emiliano",
      leadingPercentage: 43.5,
    },
    {
      name: "Foggia",
      slug: "foggia",
      capital: "Foggia",
      population: 621877,
      municipalities: 61,
      turnout: 59.8,
      votedCount: 371882,
      totalVoters: 621877,
      leadingCandidate: "Raffaele Fitto",
      leadingPercentage: 46.7,
    },
    {
      name: "Lecce",
      slug: "lecce",
      capital: "Lecce",
      population: 795134,
      municipalities: 97,
      turnout: 71.2,
      votedCount: 566175,
      totalVoters: 795134,
      leadingCandidate: "Michele Emiliano",
      leadingPercentage: 48.3,
    },
    {
      name: "Taranto",
      slug: "taranto",
      capital: "Taranto",
      population: 565842,
      municipalities: 29,
      turnout: 64.9,
      votedCount: 367252,
      totalVoters: 565842,
      leadingCandidate: "Michele Emiliano",
      leadingPercentage: 44.1,
    },
  ];

  const totalPopulation = provinces.reduce((sum, p) => sum + p.population, 0);
  const totalMunicipalities = provinces.reduce((sum, p) => sum + p.municipalities, 0);
  const avgTurnout = provinces.reduce((sum, p) => sum + p.turnout, 0) / provinces.length;

  return {
    props: {
      provinces,
      totalPopulation,
      totalMunicipalities,
      avgTurnout,
    },
  };
};

export default ProvincePage;

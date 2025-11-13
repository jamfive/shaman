import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';

interface Candidate {
  id: number;
  name: string;
  party: string;
  coalition: string;
  votes: number;
  percentage: number;
  image?: string;
}

interface CandidatiPageProps {
  candidates: Candidate[];
  totalVotes: number;
}

const CandidatiPage: React.FC<CandidatiPageProps> = ({ candidates, totalVotes }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>Candidati</li>
        </ul>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Candidati alla Presidenza</h1>
        <p className="text-lg opacity-80">
          Elezioni Regionali <span className="font-bold">Puglia 2025</span> - Lista completa dei candidati
        </p>
      </div>

      {/* Stats Card */}
      <div className="stats stats-vertical lg:stats-horizontal shadow mb-8 w-full">
        <div className="stat">
          <div className="stat-title">Totale Voti</div>
          <div className="stat-value text-primary">
            {totalVotes.toLocaleString("it-IT")}
          </div>
          <div className="stat-desc">Voti espressi</div>
        </div>

        <div className="stat">
          <div className="stat-title">Candidati</div>
          <div className="stat-value text-secondary">{candidates.length}</div>
          <div className="stat-desc">In competizione</div>
        </div>

        <div className="stat">
          <div className="stat-title">Coalizioni</div>
          <div className="stat-value">3</div>
          <div className="stat-desc">Schieramenti politici</div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Candidate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="card-title text-2xl mb-2">{candidate.name}</h2>
                  <div className="badge badge-primary mb-2">
                    {candidate.party}
                  </div>
                  <p className="text-sm opacity-70">
                    Coalizione: {candidate.coalition}
                  </p>
                </div>
                
                <div className="avatar avatar-placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-16">
                    <span className="text-3xl">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Votes and Percentage */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Voti ottenuti</span>
                    <span className="font-bold text-lg">
                      {candidate.votes.toLocaleString("it-IT")}
                    </span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value={candidate.percentage}
                    max="100"
                  ></progress>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Percentuale</span>
                  <span className="text-3xl font-bold text-primary">
                    {candidate.percentage}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline btn-sm">Dettagli</button>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Alert */}
      <div className="alert alert-info mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>
          I dati visualizzati sono aggiornati in tempo reale. Ultimo
          aggiornamento: 13 novembre 2025, ore 20:00
        </span>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<CandidatiPageProps> = async () => {
  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Antonio Decaro",
      party: "Partito Democratico",
      coalition: "Centro-sinistra",
      votes: 0,
      percentage: 0,
    },
    {
      id: 2,
      name: "Luigi Lobuono",
      party: "Fratelli d'Italia",
      coalition: "Centro-destra",
      votes: 0,
      percentage: 0,
    },
    {
      id: 3,
      name: "Sabino Mangano",
      party: "Alleanza civica per la Puglia",
      coalition: "Lista civica",
      votes: 0,
      percentage: 0,
    },
    {
      id: 4,
      name: "Ada Donno",
      party: "Puglia pacifista e popolare",
      coalition: "Lista civica",
      votes: 0,
      percentage: 0,
    },
  ];

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return {
    props: {
      candidates,
      totalVotes,
    },
  };
};

export default CandidatiPage;

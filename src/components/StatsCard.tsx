

interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
}

const StatsCard = ({ totalVotes, candidates }: { totalVotes: number; candidates: Candidate[] }) => {
  return (
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
  );
}

export default StatsCard
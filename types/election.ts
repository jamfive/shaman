export interface Candidato {
  id: string;
  nome: string;
  cognome: string;
  eta?: number;
  professione?: string;
  voti: number;
  percentuale: number;
  liste: Lista[];
}

export interface Lista {
  id: string;
  nome: string;
  simbolo?: string;
  voti: number;
  percentuale: number;
  seggi: number;
}

export interface DatiProvincia {
  nome: string;
  codice: string;
  aventi_diritto: number;
  votanti: number;
  affluenza_percentuale: number;
  sezioni_totali: number;
  sezioni_scrutinate: number;
  voti_validi: number;
  voti_nulli: number;
  voti_bianchi: number;
  candidati: Candidato[];
  comuni: DatiComune[];
}

export interface DatiComune {
  nome: string;
  provincia: string;
  aventi_diritto: number;
  votanti: number;
  affluenza_percentuale: number;
  sezioni_totali: number;
  sezioni_scrutinate: number;
}

export interface DatiRegionali {
  puglia: {
    aventi_diritto: number;
    votanti: number;
    affluenza_percentuale: number;
    sezioni_totali: number;
    sezioni_scrutinate: number;
    voti_validi: number;
    voti_nulli: number;
    voti_bianchi: number;
    candidati: Candidato[];
    province: DatiProvincia[];
  };
}
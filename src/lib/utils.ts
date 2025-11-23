export const appURL = process.env.NODE_ENV === 'production' 
  ? 'https://regionali.trmnet.work' 
  : 'http://localhost:3000';

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatNumber(num: number): string {
  return num.toLocaleString('it-IT');
}

export const translatePhase = (phase: number): string => {
  switch (phase) {
    case 0:
      return "12:00 di Domenica";
    case 1:
      return "19:00 di Domenica";
    case 2:
      return "23:00 di Domenica";
    case 3:
      return "15:00 di Lunedì";
    default:
      return "";
  }
};

export const formatItalianFloat = (num: number): string => {
  return num.toFixed(2).replace('.', ',');
}
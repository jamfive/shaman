export const appURL = process.env.NODE_ENV === 'production' 
  ? 'https://regionali.trmnet.work' 
  : 'http://localhost:3000';

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatNumber(num: number): string {
  return num.toLocaleString('it-IT');
}
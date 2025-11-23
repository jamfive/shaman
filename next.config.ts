import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  turbopack:{},
  
  // Rewrites per proxy le richieste ai dati senza CORS
  async rewrites() {
    // Solo in produzione, proxy le richieste /data/* al server remoto
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/data/:path*',
          destination: 'https://www.trmnet.work/_regionali2025/data/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

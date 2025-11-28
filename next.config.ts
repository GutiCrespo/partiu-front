// next.config.js
/** @type {import('next').NextConfig} */

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
// const apiProd = process.env.NEXT_PUBLIC_API_PRODUCAO;

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh6.googleusercontent.com' },
      { protocol: 'https', hostname: 'places.googleapis.com' },

      // Acesso ao nosso backend
      { protocol: 'https', hostname: apiUrl},
      // { protocol: 'https', hostname: apiProd },
    ],
    domains: ['lh3.googleusercontent.com'] 
  },
};

module.exports = nextConfig;
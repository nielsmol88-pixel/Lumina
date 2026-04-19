/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Doctoralia redirect
      {
        source: '/dra-carolina',
        destination:
          'https://www.doctoralia.es/carolina-franco-ruedas/oftalmologo/sevilla',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

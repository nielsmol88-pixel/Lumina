/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Option B: institutolumina.es public pages redirect to claritasinstitute.es
      // until the full rebrand is complete. Admin subdomain is NOT redirected.
      // Remove these once institutolumina.es has its own public site.
      {
        source: '/',
        destination: 'https://claritasinstitute.es',
        permanent: false,
        has: [{ type: 'host', value: 'institutolumina.es' }],
      },
      {
        source: '/:path*',
        destination: 'https://claritasinstitute.es/:path*',
        permanent: false,
        has: [{ type: 'host', value: 'institutolumina.es' }],
      },
      {
        source: '/',
        destination: 'https://claritasinstitute.es',
        permanent: false,
        has: [{ type: 'host', value: 'www.institutolumina.es' }],
      },
      {
        source: '/:path*',
        destination: 'https://claritasinstitute.es/:path*',
        permanent: false,
        has: [{ type: 'host', value: 'www.institutolumina.es' }],
      },
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

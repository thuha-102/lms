
/** @type {import('next').NextConfig} */

const { withNextVideo } = require('next-video/process')


const config = {
  swcMinify: true,
  reactStrictMode: false,
  experimental: {
    appDir: false
  },
  // transpilePackages: ['@mui/x-charts'],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
      
    });
    return config;
  },

  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/welcome',
        permanent: true,
        
      }
    ];
  }
};

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline'
]);

module.exports = {
  ...withTM(config), 
  ...withNextVideo(config),
  images: {
    unoptimized: true
  },
  // pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js']
}

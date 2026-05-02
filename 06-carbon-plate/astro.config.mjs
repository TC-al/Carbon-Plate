import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// Carbon Plate — handmade, no SaaS energy.
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [tailwind({ applyBaseStyles: false })],
  server: { port: 4321, host: true },
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
});

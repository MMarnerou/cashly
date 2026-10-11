import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // SVG imports become components in Next.js (see next.config.ts), so tests use a stub.
      { find: /^.+\.svg$/, replacement: path.resolve(__dirname, 'tests/__mocks__/svgStub.tsx') },
      { find: '@', replacement: path.resolve(__dirname) },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['components/**/*.test.tsx', 'hooks/**/*.test.ts', 'lib/**/*.test.ts', 'tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['app/**', 'components/**', 'hooks/**', 'lib/**', 'mocks/**'],
      exclude: ['**/*.test.{ts,tsx}', 'tests/**'],
      // Fails the run if coverage drops below 80%.
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})

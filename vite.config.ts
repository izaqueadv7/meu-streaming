import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true' && Boolean(repositoryName);

export default defineConfig({
  plugins: [react()],
  base: isGitHubPagesBuild ? `/${repositoryName}/` : '/',
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'] },
});

import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    reporter: 'html',
    workers: 1,
    use: {
        baseURL: 'http://localhost:3001',
    },
    webServer: {
        command: 'node server/server.js',
        url: 'http://localhost:3001/api/books',
        reuseExistingServer: !process.env.CI,
    },
});

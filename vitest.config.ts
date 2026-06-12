import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
    plugins: [
        swc.vite({ module: { type: 'es6' } }),
    ],
    test: {
        projects: [
            {
                test: {
                    name: 'Service testing (unit testing - White box)',
                    include: ['./test/**/*.service.spec.ts'],
                },
            },
            {
                test: {
                    name: 'Controller testing (integration testing - Gray box)',
                    include: ['./test/**/*.controller.spec.ts'], 
                },
            },
            {
                test: {
                    name: 'Controller testing (End-to-End testing - Black Box)', // Perbaikan nama tipe test
                    include: ['./test/**/*.e2e-spec.ts'], // Perbaikan typo ekstensi .e2e-spes.ts
                },
            },
        ],        
        globals: true,
        include: [
            './src/**/*.spec.ts',
            './test/**/*.spec.ts',
        ],
        environment: 'node',
        root: './',
        env: {
            DATABASE_URL: 'postgresql://mock_user:mock_password@localhost:5432/mock_db',
            JWT_SECRET: 'mock_jwt_secret_key',
            JWT_REFRESH_TOKEN: 'mock_jwt_refresh_token_secret_key',
            THROTTLE_TTL: '60',
            THROTTLE_LIMIT: '10',
        },
    }
})

import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 70,
            statements: 70,
        },
    },
    collectCoverageFrom: [
        '**/*.(t)s',
        '!main.(t|j)s',
        '!**/*.module.(t|j)s',
        '!**/*.dto.(t|j)s',
        '!**/*.enum.(t|j)s',
        '!**/*.entity.(t|j)s',
        '!**/*.model.(t|j)s',
        '!**/*.interface.(t|j)s',
        '!.eslintrc.js',
        '!jest.config.(t|j)s',
    ],
    coveragePathIgnorePatterns: [
        'node_modules',
        'dist',
        'test-config',
        'interfaces',
        'jestGlobalMocks.ts',
        '.module.ts',
        '.dto.ts',
        '.enum.ts',
        '.entity.ts',
        '.model.ts',
        '.interface.ts',
        '<rootDir>/src/main.ts',
        '.mock.ts',
        '.json',
        'docs',
    ],
    moduleFileExtensions: ['js', 'json', 'ts'],
    coverageReporters: ['text', 'lcov', 'cobertura'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};

export default jestConfig;

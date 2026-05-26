// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import rxjs from '@smarttools/eslint-plugin-rxjs';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importNewlines from 'eslint-plugin-import-newlines';
import unusedImports from 'eslint-plugin-unused-imports';
import lodash from 'eslint-plugin-lodash';
import jsdoc from 'eslint-plugin-jsdoc';
import jsonc from 'eslint-plugin-jsonc';
import dspaceTs from 'eslint-plugin-dspace-angular-ts';
import dspaceHtml from 'eslint-plugin-dspace-angular-html';

export default tseslint.config(
  // ── Global ignores (replaces ignorePatterns) ──────────────
  {
    ignores: ['lint/test/fixture/**'],
  },

  // ── TypeScript files ──────────────────────────────────────
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.json',
          './cypress/tsconfig.json',
          './lint/tsconfig.json',
        ],
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      'import': importPlugin,
      'simple-import-sort': simpleImportSort,
      'import-newlines': importNewlines,
      'unused-imports': unusedImports,
      'lodash': lodash,
      'jsdoc': jsdoc,
      '@smarttools/rxjs': rxjs,
      'dspace-angular-ts': dspaceTs,
    },
    rules: {
      'indent': [
        'error',
        2,
        {
          'SwitchCase': 1,
          'ignoredNodes': [
            'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
          ],
        },
      ],
      'max-classes-per-file': [
        'error',
        1,
      ],
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
      'object-curly-spacing': [
        'error',
        'always',
      ],
      'eol-last': [
        'error',
        'always',
      ],
      'no-console': [
        'error',
        {
          'allow': [
            'log',
            'warn',
            'dir',
            'timeLog',
            'assert',
            'clear',
            'count',
            'countReset',
            'group',
            'groupEnd',
            'table',
            'debug',
            'info',
            'dirxml',
            'error',
            'groupCollapsed',
            'Console',
            'profile',
            'profileEnd',
            'timeStamp',
            'context',
          ],
        },
      ],
      'curly': 'error',
      'brace-style': [
        'error',
        '1tbs',
        {
          'allowSingleLine': true,
        },
      ],
      'eqeqeq': [
        'error',
        'always',
        {
          'null': 'ignore',
        },
      ],
      'radix': 'error',
      'guard-for-in': 'error',
      'no-bitwise': 'error',
      'no-restricted-imports': 'error',
      'no-caller': 'error',
      'no-debugger': 'error',
      'no-redeclare': 'error',
      'no-eval': 'error',
      'no-fallthrough': 'error',
      'no-trailing-spaces': 'error',
      'space-infix-ops': 'error',
      'keyword-spacing': 'error',
      'no-var': 'error',
      'no-unused-expressions': [
        'error',
        {
          'allowTernary': true,
        },
      ],
      'prefer-const': 'error',
      'no-case-declarations': 'error',
      'no-extra-boolean-cast': 'error',
      'prefer-spread': 'off',
      'no-underscore-dangle': 'off',
      'no-prototype-builtins': 'off',
      'no-useless-escape': 'off',

      '@angular-eslint/directive-selector': [
        'error',
        {
          'type': 'attribute',
          'prefix': 'ds',
          'style': 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          'type': 'element',
          'prefix': 'ds',
          'style': 'kebab-case',
        },
      ],
      '@angular-eslint/pipe-prefix': [
        'error',
        {
          'prefixes': [
            'ds',
          ],
        },
      ],
      '@angular-eslint/prefer-standalone': [
        'error',
      ],
      '@angular-eslint/no-attribute-decorator': 'error',
      '@angular-eslint/no-output-native': 'warn',
      '@angular-eslint/no-output-on-prefix': 'warn',
      '@angular-eslint/no-conflicting-lifecycle': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'error',

      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          'ignoreParameters': true,
        },
      ],
      '@angular-eslint/prefer-inject': 'off',
      '@stylistic/quotes': [
        'error',
        'single',
        {
          'avoidEscape': true,
          'allowTemplateLiterals': true,
        },
      ],
      '@stylistic/semi': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          'selector': 'property',
          'format': null,
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          'default': [
            'static-field',
            'instance-field',
            'static-method',
            'instance-method',
          ],
        },
      ],
      '@stylistic/type-annotation-spacing': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-restricted-types': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/restrict-plus-operands': 'warn',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-base-to-string': [
        'error',
        {
          'ignoredTypeNames': [
            'ResourceType',
            'Error',
          ],
        },
      ],

      '@typescript-eslint/no-deprecated': 'warn',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-deprecated': 'warn',
      'import/no-namespace': 'error',
      'import-newlines/enforce': [
        'error',
        {
          'items': 1,
          'semi': true,
          'forceSingleLine': true,
        },
      ],
      'import/enforce-node-protocol-usage': [
        'error',
        'always',
      ],

      'unused-imports/no-unused-imports': 'error',
      'lodash/import-scope': [
        'error',
        'method',
      ],

      // todo: go over _all_ cases
      '@smarttools/rxjs/no-nested-subscribe': 'off',

      // Custom DSpace Angular rules
      'dspace-angular-ts/alias-imports': [
        'error',
        {
          'aliases': [
            {
              'package': 'rxjs',
              'imported': 'of',
              'local': 'of',
            },
          ],
        },
      ],
      'dspace-angular-ts/no-default-standalone-value': 'error',
      'dspace-angular-ts/themed-component-selectors': 'error',
      'dspace-angular-ts/themed-component-usages': 'error',
      'dspace-angular-ts/themed-decorators': [
        'off',
        {
          'decorators': {
            'listableObjectComponent': 3,
            'rendersSectionForMenu': 2,
          },
        },
      ],
      'dspace-angular-ts/themed-wrapper-no-input-defaults': 'error',
      'dspace-angular-ts/unique-decorators': [
        'off',
        {
          'decorators': [
            'listableObjectComponent',
          ],
        },
      ],
      'dspace-angular-ts/sort-standalone-imports': [
        'error',
        {
          'locale': 'en-US',
          'maxItems': 0,
          'indent': 2,
          'trailingComma': true,
        },
      ],
    },
  },

  // ── Spec files (overrides for test files) ─────────────────
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.json',
          './cypress/tsconfig.json',
        ],
        createDefaultProgram: true,
      },
    },
    rules: {
      'prefer-const': 'off',

      // Custom DSpace Angular rules
      'dspace-angular-ts/themed-component-usages': 'error',
    },
  },

  // ── HTML template files ───────────────────────────────────
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
    ],
    plugins: {
      'dspace-angular-html': dspaceHtml,
    },
    rules: {
      // Custom DSpace Angular rules
      'dspace-angular-html/themed-component-usages': 'error',
      'dspace-angular-html/no-disabled-attribute-on-button': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },

  // ── JSON5 files ───────────────────────────────────────────
  {
    files: ['**/*.json5'],
    extends: [
      ...jsonc.configs['flat/recommended-with-json5'],
    ],
    rules: {
      // The ESLint core no-irregular-whitespace rule doesn't work well in JSON
      // See: https://ota-meshi.github.io/eslint-plugin-jsonc/rules/no-irregular-whitespace.html
      'no-irregular-whitespace': 'off',
      'jsonc/no-irregular-whitespace': 'error',
      'no-trailing-spaces': 'error',
      'jsonc/comma-dangle': [
        'error',
        'always-multiline',
      ],
      'jsonc/indent': [
        'error',
        2,
      ],
      'jsonc/key-spacing': [
        'error',
        {
          'beforeColon': false,
          'afterColon': true,
          'mode': 'strict',
        },
      ],
      'jsonc/no-dupe-keys': 'off',
      'jsonc/quotes': [
        'error',
        'double',
        {
          'avoidEscape': false,
        },
      ],
    },
  },
);
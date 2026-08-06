import { execSync } from 'child_process';
import { Compiler } from 'webpack';

/**
 * Triggers the `generate:decorator:registries` script on every rebuild to synchronize the registry files.
 */
export class GenerateDecoratorRegistriesPlugin {

  apply(compiler: Compiler): void {
    compiler.hooks.watchRun.tap('GenerateDecoratorRegistries', () => {
      execSync('npm run generate:decorator:registries', { stdio: 'inherit' });
    });

    let firstRun = true;
    compiler.hooks.beforeCompile.tap('GenerateDecoratorRegistries', (c) => {
      if (firstRun) {
        execSync('npm run generate:decorator:registries', { stdio: 'inherit' });
        firstRun = false;
      }
    });
  }

}

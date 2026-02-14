import 'reflect-metadata';

import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import deepmerge from 'deepmerge';

const publicMetadataKey = Symbol('public');
const envMetadataKey = Symbol('env');
const arrayMetadataKey = Symbol('arrayType');

export class Config {
  /**
   * Decorator that marks a config property as public
   *
   * The method 'Config#toPublic' will return a plain object with only
   * properties that are marked as public.
   */
  static publish(){
    return Reflect.metadata(publicMetadataKey, true);
  }

  /**
   * Decorator for changing a config property via an environment variable
   *
   * The method 'Config#applyEnv' will load properties with this
   * decoration from the environment object passed in.
   *
   * @param name The name of the environment variable that can
   *   override this config property.
   *
   * @param loader A transformation function which takes the string
   *   value of the environment variable and returns the appropriate
   *   type to use for the config property.
   */
  static env(name: string, loader?: (val: string) => any) {
    return Reflect.metadata(envMetadataKey, { name, loader });
  }

  /**
   * Decorator to mark a config property as an array of another type of Config
   *
   * The method 'Config#merge' will use this value to instantiate the
   * correct type of Config for each array property.
   *
   * @param configClass The class to instantiate when merging a plain
   *   array into this property.
   */
  static arrayOf<T extends Config>(configClass: new() => T) {
    return Reflect.metadata(arrayMetadataKey, configClass);
  }

  /**
   * Create an instance of a Config, passing in its initial value.
   *
   * This helper function allows Configs to be instantiated from a
   * plain object which matches its structure, while enforcing strict
   * typing and maintaining the decorated properties of the Config.
   *
   * @param configClass The subclass of Config to instantiate.
   *
   * @param config A plain object which at least partially matches the
   *   structure of configClass.
   *
   * @returns An instance of configClass with initial values set to
   *   those in config.
   */
  static assign<T extends Config>(
    configClass: new() => T, config: Partial<T>,
  ): T {
    return Object.assign(new configClass(), config);
  }

  /**
   * Convert an array of plain objects to an array of Configs
   *
   * This helper function allows an array of Configs to be
   * instantiated from an array of plain objects which match its
   * structure, while enforcing strict typing and maintaing the
   * decorated properties of the Config.
   *
   * @param configClass The sublcass of Config to instantiate an array of
   *
   * @param configs An array of plain objects which at least partially
   *   match the structure of configClass.
   *
   * @returns An array of configClass instances with their initial
   *   values set to those in configs.
   */
  static assignArray<T extends Config>(
    configClass: new() => T, configs: Partial<T>[],
  ): T[] {
    return configs.map(c => Object.assign(new configClass(), c));
  }

  /**
   * Apply the values of an object to the current config
   *
   * If an array is included in the new config, overwrite the entire
   * array instead of concatenating, and use the class given by
   * @Config.arrayOf() to instantiate each element, if supplied.
   *
   * @param config An object with a structure that partially matches
   *   the current config object.
   */
  apply<T extends Config>(config: Partial<T>) {
    Object.keys(config).forEach(k => {
      const arrayType = Reflect.getMetadata(arrayMetadataKey, this, k);

      if (this[k] instanceof Config) {
        this[k].apply(config[k]);
      } else if (arrayType) {
        this[k] = config[k].map(
          (c: Partial<typeof arrayType>) => Config.assign(
            arrayType, c,
          ),
        );
      } else if (typeof this[k] === 'object') {
        this[k] = deepmerge.all([this[k], config[k]], {
          arrayMerge: (_target: [], source: []) => source,
        });
      } else {
        this[k] = config[k];
      }
    });
  }

  // Return a plain object with only those properties marked with the
  // 'public' metadata key.
  protected toPublic(): any {
    return {
      ...Object.keys(this).reduce((result, k) => {
        if (Reflect.getMetadata(publicMetadataKey, this, k)) {
          if (this[k] instanceof Config) {
            result[k] = this[k].toPublic();
          } else if (Reflect.getMetadata(arrayMetadataKey, this, k)) {
            result[k] = this[k].map((c: Config) => c.toPublic());
          } else {
            result[k] = this[k];
          }
        }
        return result;
      }, {}),
    };
  }

  // Apply an environment to the current config. The env object should
  // be a map of environment variable names to their values, such as
  // in `process.env`.
  protected applyEnvironment(env: { [k: string]: string }) {
    Object.keys(this).forEach(k => {
      const envMeta = Reflect.getMetadata(envMetadataKey, this, k);
      if (envMeta) {
        const val = env[envMeta.name];
        if (isNotEmpty(val)) {
          this[k] = envMeta.loader ? envMeta.loader(val) : val;
        }
      }
    });
  }
}

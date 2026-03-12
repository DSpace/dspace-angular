import 'reflect-metadata';

import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import deepmerge from 'deepmerge';

const publicMetadataKey = Symbol('public');
const envMetadataKey = Symbol('env');
const arrayMetadataKey = Symbol('arrayType');

type DSpaceEnvVar = `DSPACE_${string}`;

interface DeepEnvSpec {
  [k: string]: DeepEnvSpec | DSpaceEnvVar | [DSpaceEnvVar, (val: string) => any];
}

export const toBoolean = (val: string) => (
  val === 'true' || val === '1');

export class Config {
  /**
   * Decorator that marks a config property as public
   *
   * The method 'Config#toPublic' will return a plain object with only
   * properties that are marked as public.
   */
  static public = Reflect.metadata(publicMetadataKey, true);

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
  static env(name: DSpaceEnvVar, loader?: (val: string) => any) {
    return Reflect.metadata(envMetadataKey, { name, loader });
  }

  /**
   * Decorator for changing a deeply nested config property via an environment variable
   *
   * The method 'Config#applyEnv' will load object properties with
   * this decoration from the environment object passed in.
   *
   * @param spec A plain object whose structure at least partially
   *   matches that of the property being decorated, with values being
   *   either a string environment variable name for that nested
   *   property, or an array of a string environment variable name and
   *   loader function which can transform the environment variable
   *   value into the desired type.
   */
  static deepEnv(spec: DeepEnvSpec) {
    return Reflect.metadata(envMetadataKey, { deep: true, spec });
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
    const conf = new configClass();
    conf.apply(config);
    return conf;
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
    return configs.map(c => Config.assign(configClass, c));
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
    Object.entries(config).forEach(([k, val]) => {
      const arrayType = Reflect.getMetadata(arrayMetadataKey, this, k);

      if (this[k] instanceof Config) {
        this[k].apply(val);
      } else if (arrayType) {
        this[k] = val.map(
          (c: Partial<typeof arrayType>) => Config.assign(
            arrayType, c,
          ),
        );
      } else if (isNotEmpty(this[k]) && typeof this[k] === 'object') {
        this[k] = deepmerge.all([this[k], val], {
          arrayMerge: (_target: [], source: []) => source,
        });
      } else {
        this[k] = val;
      }
    });
  }

  /**
   * Return a plain object with only 'public' properties
   *
   * Only properties decorated with @Config.public will be added to
   * the result.
   *
   * @returns A plain object of publicly available config properties
   */
  toPublic(): any {
    const result = {};

    const handleGetters = (obj: object) => {
      if (obj && obj !== Object.prototype) {
        Object.entries(Object.getOwnPropertyDescriptors(obj))
          .forEach(([k, desc]) => {
            if (Reflect.getMetadata(publicMetadataKey, this, k)
              && typeof desc.get === 'function') {
              result[k] = desc.get.bind(this)();
            }
          });
        handleGetters(Object.getPrototypeOf(obj));
      }
    };
    handleGetters(this);

    Object.entries(this).forEach(([k, prop]) => {
      if (Reflect.getMetadata(publicMetadataKey, this, k)) {
        if (prop instanceof Config) {
          result[k] = prop.toPublic();
        } else if (Reflect.getMetadata(arrayMetadataKey, this, k)) {
          result[k] = prop.map((c: Config) => c.toPublic());
        } else if (typeof prop !== 'function')  {
          result[k] = prop;
        }
      }
    });

    return result;
  }

  /**
   * Apply an environment object to the current config
   *
   * @param env a map of environment variable names to their values,
   *   such as in `process.env`.
   * @return void Modifies this config in-place
   **/
  applyEnvironment(env: { [k: string]: string }) {
    const deepEnv = (target: any, spec: DeepEnvSpec) => {
      Object.entries(spec).forEach(([k, desc]) => {
        if (target.hasOwnProperty(k)) {
          if (typeof desc === 'string') {
            const val = env[desc];
            if (isNotEmpty(val)) {
              target[k] = val;
            }
          } else if (Array.isArray(desc) && typeof desc[0] === 'string') {
            const val = env[desc[0]];
            if (isNotEmpty(val)) {
              target[k] = desc[1](val);
            }
          } else {
            deepEnv(target[k], desc as DeepEnvSpec);
          }
        }
      });
    };

    Object.entries(this).forEach(([k, prop]) => {
      if (prop instanceof Config) {
        prop.applyEnvironment(env);
      } else if (Reflect.getMetadata(arrayMetadataKey, this, k)) {
        prop.forEach((c: Config) => c.applyEnvironment(env));
      } else {
        const envMeta = Reflect.getMetadata(envMetadataKey, this, k);
        if (envMeta) {
          if (envMeta.deep) {
            deepEnv(prop, envMeta.spec);
          } else {
            const val = env[envMeta.name];
            if (isNotEmpty(val)) {
              this[k] = envMeta.loader ? envMeta.loader(val) : val;
            }
          }
        }
      }
    });
  }
}

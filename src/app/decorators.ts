import { DecoratorConfig } from '../../scripts/config/decorator-config.interface';

/**
 * This list contains the dynamic components decorator configuration that will be used to generate the registry files
 * in `src/decorator-registries`.
 *
 * If you want to create a new decorator, you need to extend this list and add your custom decorator to it. Afterwards
 * a registry file will be generated inside the `src/decorator-registries` folder, which exports the Map that you can
 * then use this inside your decorator file to dynamically retrieve the desired component.
 */
export const DECORATORS: DecoratorConfig[] = [
];

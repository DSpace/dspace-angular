import { hasNoValue } from '../../../empty.util';

const map = new Map();

/**
 * Decorator used for rendering ClaimedTaskActions pages by option type
 */
export function rendersWorkflowTaskOption(option: string) {
  return function decorator(component: any) {
    if (hasNoValue(map.get(option))) {
      map.set(option, component);
    } else {
      throw new Error(`There can't be more than one component to render ClaimedTaskActions for option "${option}"`);
    }
  };
}

/**
 * Get the component used for rendering a ClaimedTaskActions page by option type
 */
export function getComponentByWorkflowTaskOption(option: string) {
  return map.get(option);
}

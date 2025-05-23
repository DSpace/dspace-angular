import { URLCombiner } from '../core/url-combiner/url-combiner';

export const SUGGESTION_MODULE_PATH = 'suggestions';

export function getSuggestionModuleRoute() {
  return `/${SUGGESTION_MODULE_PATH}`;
}

export function getSuggestionPageRoute(SuggestionId: string) {
  return new URLCombiner(getSuggestionModuleRoute(), SuggestionId).toString();
}

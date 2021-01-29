/**
 * Interface representing a single suggestion for the input suggestions component
 */
export interface InputSuggestion {
  /**
   * The displayed value of the suggestion
   */
  displayValue: string;

  /**
   * The actual value of the suggestion
   */
  value: string;
}

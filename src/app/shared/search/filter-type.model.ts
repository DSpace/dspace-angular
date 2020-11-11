/**
 * Enumeration containing all possible types for filters
 */
export enum FilterType {
  /**
   * Represents authority facets
   */
  authority = 'authority',

  /**
   * Represents simple text facets
   */
  text = 'text',

  /**
   * Represents date facets
   */
  range = 'date',

  /**
   * Represents hierarchically structured facets
   */
  hierarchy = 'hierarchical',

  /**
   * Represents binary facets
   */
  boolean = 'standard',

  /**
   * Represents bar chart
   */
  'chart.bar' = 'chart.bar',

  /**
   * Represents pie chart
   */
  'chart.pie' = 'chart.pie',

  /**
   * Represents line chart
   */
  'chart.line' = 'chart.line'
}

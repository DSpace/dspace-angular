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
   * Represents a vertical bar chart facet
   */
  'chart.bar' = 'chart.bar',

  /**
   * Represents a reversed vertical bar chart facet
   */
  'chart.reverse-bar' = 'chart.reverse-bar',

  /**
   * Represents a horizontal bar chart facet
   */
  'chart.bar.horizontal' = 'chart.bar.horizontal',

  /**
   * Represents a reversed horizontal bar chart facet
   */
  'chart.reverse-bar.horizontal' = 'chart.reverse-bar.horizontal',

  /**
   * Represents a right-to-left bar chart facet
   */
  'chart.bar.right-to-left' = 'chart.bar.right-to-left',

  /**
   * Represents a left-to-right bar chart facet
   */
  'chart.bar.left-to-right' = 'chart.bar.left-to-right',

  /**
   * Represents a line chart facet
   */
  'chart.line' = 'chart.line',

  /**
   * Represents a pie chart facet
   */
  'chart.pie' = 'chart.pie'
}

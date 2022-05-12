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
  'chart.line' = 'chart.line',

  /**
   * Represents horizontal bar chart
   */
  'chart.bar.horizontal' = 'chart.bar.horizontal',

  /**
   * Represents bar chart with more button on left side
   */
  'chart.bar.right-to-left' = 'chart.bar.right-to-left',

  /**
   * Represents bar chart with more button on right side
   */
  'chart.bar.left-to-right' = 'chart.bar.left-to-right',

  /**
   * Represents a reversed horizontal bar chart
   */
  'chart.reverse-bar.horizontal' = 'chart.reverse-bar.horizontal',

  /**
   * Represents a reversed bar chart
   */
  'chart.reverse-bar' = 'chart.reverse-bar'
}

import { Config } from './config.interface';

/**
 * Config related to search engine optimization (SEO).
 */
export interface SeoConfig extends Config {

  /**
   * Configuration for canonical link tags.
   */
  canonical: {

    /**
     * Whether to add {@code <link rel="canonical">} to item pages.
     * The canonical URL points to the simple item view (e.g. {@code /items/{uuid}} or {@code /entities/{type}/{uuid}}).
     */
    items: boolean;

    /**
     * Whether to add a canonical {@code Link} HTTP header and {@code <link rel="canonical">} to bitstream download responses.
     * The canonical URL points to {@code /bitstreams/{uuid}/download}.
     */
    bitstreams: boolean;
  };
}

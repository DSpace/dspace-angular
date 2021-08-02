import { Config } from './config.interface';
import { BrowseByType } from '../app/browse-by/browse-by-switcher/browse-by-decorator';

/**
 * Config used for rendering Browse-By pages and links
 */
export interface  BrowseByTypeConfig extends Config {
  /**
   * The browse id used for fetching browse data from the rest api
   * e.g. author
   */
  id: string;

  /**
   * The type of Browse-By page to render
   */
  type: BrowseByType | string;

  /**
   * The metadata field to use for rendering starts-with options (only necessary when type is set to BrowseByType.Date)
   */
  metadataField?: string;
}

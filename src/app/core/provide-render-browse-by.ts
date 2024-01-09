import {
  ThemedBrowseByMetadataPageComponent
} from '../browse-by/browse-by-metadata-page/themed-browse-by-metadata-page.component';
import { ThemedBrowseByDatePageComponent } from '../browse-by/browse-by-date-page/themed-browse-by-date-page.component';
import {
  ThemedBrowseByTitlePageComponent
} from '../browse-by/browse-by-title-page/themed-browse-by-title-page.component';
import {
  ThemedBrowseByTaxonomyPageComponent
} from '../browse-by/browse-by-taxonomy-page/themed-browse-by-taxonomy-page.component';


/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const renderBrowseBy =
  [
    ThemedBrowseByMetadataPageComponent,
    ThemedBrowseByDatePageComponent,
    ThemedBrowseByTitlePageComponent,
    ThemedBrowseByTaxonomyPageComponent,
  ];

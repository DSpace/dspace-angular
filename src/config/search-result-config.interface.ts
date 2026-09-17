import { Config } from './config.interface';
import { FollowAuthorityMetadata } from './search-follow-metadata.interface';

export interface SearchResultConfig extends Config {
  authorMetadata: string[];
  followAuthorityMetadata: FollowAuthorityMetadata[];
  followAuthorityMaxItemLimit: number;
  followAuthorityMetadataValuesLimit: number;
}

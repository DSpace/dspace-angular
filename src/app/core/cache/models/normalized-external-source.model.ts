import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedObject } from './normalized-object.model';
import { ExternalSource } from '../../shared/external-source.model';
import { mapsTo } from '../builders/build-decorators';

@mapsTo(ExternalSource)
@inheritSerialization(NormalizedObject)
export class NormalizedExternalSource extends NormalizedObject<ExternalSource> {
  /**
   * Unique identifier
   */
  @autoserialize
  id: string;

  /**
   * The name of this external source
   */
  @autoserialize
  name: string;

  /**
   * Is the source hierarchical?
   */
  @autoserialize
  hierarchical: boolean;
}

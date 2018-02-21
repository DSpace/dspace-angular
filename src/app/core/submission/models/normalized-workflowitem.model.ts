import { inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { Workflowitem } from './workflowitem.model';
import { NormalizedWorkspaceItem } from './normalized-workspaceitem.model';

@mapsTo(Workflowitem)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedWorkflowItem extends NormalizedWorkspaceItem {

}

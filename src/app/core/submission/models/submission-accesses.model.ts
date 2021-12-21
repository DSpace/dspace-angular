import { autoserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { HALResource } from '../../shared/hal-resource.model';
import { SUBMISSION_ACCESSES } from 'src/app/core/submission/models/submission-accesses.resource-type';

@typedObject
@inheritSerialization(HALResource)
export class SubmissionAccesses extends HALResource {

    static type = SUBMISSION_ACCESSES;

    /**
     * The object type
     */
    @excludeFromEquals
    @autoserialize
    type: ResourceType;

    @autoserialize
    discoverable: boolean;

    @autoserialize
    accessConditions: AccessConditions[];
}

export interface AccessConditions {
    name: string;
    startDate?: Date;
    hasStartDate?: boolean;
    maxStartDate?: string;
    hasEndDate?: boolean;
    maxEndDate?: string;
    endDate?: Date;
}


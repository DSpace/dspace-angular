/**
 * An interface to represent the submission's creative commons license section data.
 */
export interface WorkspaceitemSectionAccessesObject {
  id: string;
  discoverable: boolean;
  accessConditions: [
    {
      name: string;
      startDate?: Date;
      hasStartDate?: boolean;
      maxStartDate?: string;
      hasEndDate?: boolean;
      maxEndDate?: string;
      endDate?: Date;
    }
  ];
}

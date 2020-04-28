/**
 * An interface to represent the submission's creative commons license section data.
 */
export interface WorkspaceitemSectionCcLicenseObject {
  ccLicense: {
    name: string;
    fields: {
      [field: string]: string;
    }
  };
}

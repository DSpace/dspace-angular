import { SubmissionSectionAccessesComponent } from './accesses/section-accesses.component';
import { SubmissionSectionCcLicensesComponent } from './cc-license/submission-section-cc-licenses.component';
import { SubmissionSectionDuplicatesComponent } from './duplicates/section-duplicates.component';
import { SubmissionSectionFormComponent } from './form/section-form.component';
import { SubmissionSectionIdentifiersComponent } from './identifiers/section-identifiers.component';
import { SubmissionSectionLicenseComponent } from './license/section-license.component';
import { SubmissionSectionCoarNotifyComponent } from './section-coar-notify/section-coar-notify.component';
import { SectionsType } from './sections-type';
import { SubmissionSectionSherpaPoliciesComponent } from './sherpa-policies/section-sherpa-policies.component';
import { SubmissionSectionUploadComponent } from './upload/section-upload.component';

const submissionSectionsMap = new Map();

submissionSectionsMap.set(SectionsType.AccessesCondition, SubmissionSectionAccessesComponent);
submissionSectionsMap.set(SectionsType.License, SubmissionSectionLicenseComponent);
submissionSectionsMap.set(SectionsType.CcLicense, SubmissionSectionCcLicensesComponent);
submissionSectionsMap.set(SectionsType.SherpaPolicies, SubmissionSectionSherpaPoliciesComponent);
submissionSectionsMap.set(SectionsType.Upload, SubmissionSectionUploadComponent);
submissionSectionsMap.set(SectionsType.SubmissionForm, SubmissionSectionFormComponent);
submissionSectionsMap.set(SectionsType.Identifiers, SubmissionSectionIdentifiersComponent);
submissionSectionsMap.set(SectionsType.CoarNotify, SubmissionSectionCoarNotifyComponent);
submissionSectionsMap.set(SectionsType.Duplicates, SubmissionSectionDuplicatesComponent);

/**
 * @deprecated
 */
export function renderSectionFor(sectionType: SectionsType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    submissionSectionsMap.set(sectionType, objectElement);
  };
}

export function rendersSectionType(sectionType: SectionsType) {
  return submissionSectionsMap.get(sectionType);
}

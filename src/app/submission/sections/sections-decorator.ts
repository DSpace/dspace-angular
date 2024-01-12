
import { SectionsType } from './sections-type';
import { defer } from 'rxjs';

const submissionSectionsMap = {
  [SectionsType.AccessesCondition]: defer(() => import('./accesses/section-accesses.component').then(m => m.SubmissionSectionAccessesComponent)),
  [SectionsType.License]: defer(() => import('./license/section-license.component').then(m => m.SubmissionSectionLicenseComponent)),
  [SectionsType.CcLicense]: defer(() => import('./cc-license/submission-section-cc-licenses.component').then(m => m.SubmissionSectionCcLicensesComponent)),
  [SectionsType.SherpaPolicies]: defer(() => import('./sherpa-policies/section-sherpa-policies.component').then(m => m.SubmissionSectionSherpaPoliciesComponent)),
  [SectionsType.Upload]: defer(() => import('./upload/file/section-upload-file.component').then(m => m.SubmissionSectionUploadFileComponent)),
  [SectionsType.SubmissionForm]: defer(() => import('./form/section-form.component').then(m => m.SubmissionSectionFormComponent)),
  [SectionsType.Identifiers]: defer(() => import('./identifiers/section-identifiers.component').then(m => m.SubmissionSectionIdentifiersComponent))
};
export function renderSectionFor(sectionType: SectionsType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    // submissionSectionsMap.set(sectionType, objectElement);
  };
}

export function rendersSectionType(sectionType: SectionsType) {
  return submissionSectionsMap[sectionType];
}

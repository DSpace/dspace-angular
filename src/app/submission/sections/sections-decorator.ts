import { SectionsType } from './sections-type';
import { defer } from 'rxjs';

const submissionSectionsMap = new Map();

submissionSectionsMap.set(SectionsType.AccessesCondition, defer(() => import('./accesses/section-accesses.component').then(m => m.SubmissionSectionAccessesComponent)));
submissionSectionsMap.set(SectionsType.License, defer(() => import('./license/section-license.component').then(m => m.SubmissionSectionLicenseComponent)));
submissionSectionsMap.set(SectionsType.CcLicense, defer(() => import('./cc-license/submission-section-cc-licenses.component').then(m => m.SubmissionSectionCcLicensesComponent)));
submissionSectionsMap.set(SectionsType.SherpaPolicies, defer(() => import('./sherpa-policies/section-sherpa-policies.component').then(m => m.SubmissionSectionSherpaPoliciesComponent)));
submissionSectionsMap.set(SectionsType.Upload, defer(() => import('./upload/section-upload.component').then(m => m.SubmissionSectionUploadComponent)));
submissionSectionsMap.set(SectionsType.SubmissionForm, defer(() => import('./form/section-form.component').then(m => m.SubmissionSectionFormComponent)));
submissionSectionsMap.set(SectionsType.Identifiers, defer(() => import('./identifiers/section-identifiers.component').then(m => m.SubmissionSectionIdentifiersComponent)));

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

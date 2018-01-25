import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubmissionRestService } from '../../submission-rest.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionState } from '../../submission.reducers';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { SaveSubmissionFormAction } from '../../objects/submission-objects.actions';
import { SectionService } from '../../section/section.service';

@Component({
  selector: 'ds-submission-submit-form-footer',
  styleUrls: [ './submission-submit-form-footer.component.scss' ],
  templateUrl: './submission-submit-form-footer.component.html'
})
export class SubmissionSubmitFormFooterComponent implements OnChanges {

  @Input() submissionId;

  public saving = false;
  private submissionIsInvalid = true;

  constructor(private modalService: NgbModal,
              private restService: SubmissionRestService,
              private router: Router,
              private formBuilderService: FormBuilderService,
              private sectionService: SectionService,
              private submissionService: SubmissionService,
              private store: Store<SubmissionState>) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!this.submissionId) {
      this.submissionService.getSectionsState(this.submissionId)
        .subscribe((isValid) => {
          this.submissionIsInvalid = isValid === false;
        });
      this.submissionService.getSubmissionSaveStatus(this.submissionId)
        .subscribe((status: boolean) => {
          console.log('footer', status);
          this.saving = status
        });
    }
  }

  saveLater(event) {
    this.saving = true
    /*this.restService.jsonPatchByResourceType(this.submissionId, 'sections')
      .subscribe((response) => {
        if (isNotEmpty(response)) {
          const errorsList = {};

          // to avoid dispatching an action for every error, create an array of errors per section
          (response as Workspaceitem[]).forEach((item: Workspaceitem) => {
            const {sections} = item;
            if (sections && isNotEmpty(sections)) {
              Object.keys(sections)
                .forEach((sectionId) => this.sectionService.updateSectionData(this.submissionId, sectionId, sections[sectionId]))
            }

            const {errors} = item;

            if (errors && !isEmpty(errors)) {
              errors.forEach((error: WorkspaceItemError) => {
                const paths: SectionErrorPath[] = parseSectionErrorPaths(error.paths);

                paths.forEach((path: SectionErrorPath) => {
                  const sectionError = {path: path.originalPath, message: error.message};
                  if (!errorsList[path.sectionId]) {
                    errorsList[path.sectionId] = {errors: []};
                  }
                  errorsList[path.sectionId].errors.push(sectionError);
                });
              });
            }
          });

          // and now dispatch an action with an array of errors for every section
          if (!isEmpty(errorsList)) {
            Object.keys(errorsList).forEach((sectionId) => {
              const {errors} = errorsList[sectionId];
              const action = new InertSectionErrorsAction(this.submissionId, sectionId, errors);

              this.store.dispatch(action);
            });
          }
        }
        this.saving = false;
      });*/
    this.store.dispatch(new SaveSubmissionFormAction(this.submissionId));
  }

  public resourceDeposit() {
    alert('Feature is actually in development...');
  }

  protected resourceDiscard() {
    this.router.navigate([ '/mydspace' ]);
  }

  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.restService.deleteById(this.submissionId)
            .subscribe((response) => {
              this.resourceDiscard();
            })
        }
      }
    );
  }
}

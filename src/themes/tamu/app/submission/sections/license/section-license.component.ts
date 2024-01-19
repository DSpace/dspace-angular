import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicCheckboxModel, DynamicFormLayout, DynamicRadioGroupModel, MATCH_DISABLED } from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../../../../../../app/core/auth/auth.service';
import { BitstreamDataService } from '../../../../../../app/core/data/bitstream-data.service';
import { CollectionDataService } from '../../../../../../app/core/data/collection-data.service';
import { PaginatedList } from '../../../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../../../app/core/data/remote-data';
import { JsonPatchOperationsBuilder } from '../../../../../../app/core/json-patch/builder/json-patch-operations-builder';
import { Bitstream } from '../../../../../../app/core/shared/bitstream.model';
import { Collection } from '../../../../../../app/core/shared/collection.model';
import { HALEndpointService } from '../../../../../../app/core/shared/hal-endpoint.service';
import { Item } from '../../../../../../app/core/shared/item.model';
import { License } from '../../../../../../app/core/shared/license.model';
import { WorkspaceitemSectionLicenseObject } from '../../../../../../app/core/submission/models/workspaceitem-section-license.model';
import { WorkspaceItem } from '../../../../../../app/core/submission/models/workspaceitem.model';
import { isNotEmpty, isNotUndefined } from '../../../../../../app/shared/empty.util';
import { FormBuilderService } from '../../../../../../app/shared/form/builder/form-builder.service';
import { FormService } from '../../../../../../app/shared/form/form.service';
import { NotificationsService } from '../../../../../../app/shared/notifications/notifications.service';
import { UploaderOptions } from '../../../../../../app/shared/upload/uploader/uploader-options.model';
import { followLink } from '../../../../../../app/shared/utils/follow-link-config.model';
import { SectionFormOperationsService } from '../../../../../../app/submission/sections/form/section-form-operations.service';
import { SubmissionSectionLicenseComponent as BaseComponent } from '../../../../../../app/submission/sections/license/section-license.component';
import { SectionDataObject } from '../../../../../../app/submission/sections/models/section-data.model';
import { renderSectionFor } from '../../../../../../app/submission/sections/sections-decorator';
import { SectionsType } from '../../../../../../app/submission/sections/sections-type';
import { SectionsService } from '../../../../../../app/submission/sections/sections.service';
import { SubmissionService } from '../../../../../../app/submission/submission.service';
import { SECTION_LICENSE_FORM_LAYOUT } from './section-license.model';

/**
 * This component represents a section that contains the submission license form.
 */
@Component({
  selector: 'ds-submission-section-license',
  // styleUrls: ['./section-license.component.scss'],
  templateUrl: './section-license.component.html',
  // templateUrl: '../../../../../../app/submission/sections/license/section-license.component.html',
})
@renderSectionFor(SectionsType.License)
export class SubmissionSectionLicenseComponent extends BaseComponent {

  /**
  * The [[DynamicFormLayout]] object
  * @type {DynamicFormLayout}
  */
  public formLayout: DynamicFormLayout = SECTION_LICENSE_FORM_LAYOUT;

  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  public uploadFilesOptions: UploaderOptions = new UploaderOptions();

  /**
   * A boolean representing if is possible to active drop zone over the document page
   * @type {boolean}
   */
  public enableDragOverDocument = true;

  /**
   * i18n message label
   * @type {string}
   */
  public dropMsg = 'submission.sections.proxy-license.permission-upload-drop-message';

  /**
   * i18n message label
   * @type {string}
   */
  public dropOverDocumentMsg = 'submission.sections.proxy-license.permission-upload-drop-message';

  public proxyLicense: Observable<any>;

  public get license(): Observable<string> {
    return this._license.asObservable();
  }

  public get selected(): Observable<string> {
    return this._selected.asObservable();
  }

  public get removingProxy(): Observable<boolean> {
    return this._removing_proxy.asObservable();
  }

  /**
   * The license label wrapper element reference
   */
  @ViewChild('labelWrapper') private labelWrapper: ElementRef;

  /**
   * The license text wrapper element reference
   */
  @ViewChild('licenseWrapper') private licenseWrapper: ElementRef;

  /**
   * The proxy permission license uploader wrapper element reference
   */
  @ViewChild('uploaderWrapper') private uploaderWrapper: ElementRef;

  /**
   * The license step form wrapper element reference
   */
  @ViewChild('formWrapper') private formWrapper: ElementRef;

  private _license: BehaviorSubject<string>;

  private _selected: BehaviorSubject<string>;

  private _removing_proxy: BehaviorSubject<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private bitstreamService: BitstreamDataService,
    private halEndpointService: HALEndpointService,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected collectionDataService: CollectionDataService,
    protected formBuilderService: FormBuilderService,
    protected formOperationsService: SectionFormOperationsService,
    protected formService: FormService,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    protected sectionService: SectionsService,
    protected submissionService: SubmissionService,
    protected translateService: TranslateService,
    @Inject('collectionIdProvider') public injectedCollectionId: string,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string
  ) {
    super(
      changeDetectorRef,
      collectionDataService,
      formBuilderService,
      formOperationsService,
      formService,
      operationsBuilder,
      sectionService,
      submissionService,
      translateService,
      injectedCollectionId,
      injectedSectionData,
      injectedSubmissionId
    );
    this._license = new BehaviorSubject<string>(undefined);
    this._selected = new BehaviorSubject<string>(undefined);
    this._removing_proxy = new BehaviorSubject<boolean>(false);
  }

  ngOnInit(): void {
    this.subs.push(
      this.halEndpointService.getEndpoint(this.submissionService.getSubmissionObjectLinkName()).pipe(
        filter((href: string) => isNotEmpty(href)),
        distinctUntilChanged())
        .subscribe((endpointURL) => {
          this.uploadFilesOptions.additionalParameter = {
            sectionId: this.sectionData.id
          };
          this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
          this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
          this.changeDetectorRef.detectChanges();
        })
    );

    // observe the proxy bitstream
    this.proxyLicense = this.activatedRoute.data.pipe(
      map((data: Data) => data.wsi),
      tap((d) => console.log('1', d)),
      filter((wsird: RemoteData<WorkspaceItem>) => !!wsird && wsird.isSuccess),
      tap((d) => console.log('2', d)),
      map((wsird: RemoteData<WorkspaceItem>) => wsird.payload),
      tap((d) => console.log('3', d)),
      switchMap((wi: WorkspaceItem) => wi.item.pipe(
        tap((d) => console.log('4', d)),
        filter((ird: RemoteData<Item>) => !!ird && ird.isSuccess),
        tap((d) => console.log('5', d)),
        map((ird: RemoteData<Item>) => ird.payload),
        tap((d) => console.log('6', d)),
        switchMap((item: Item) => this.bitstreamService
          .findAllByItemAndBundleName(item, 'LICENSE', {}, true, true).pipe(
            tap((d) => console.log('7', d)),
            filter((bplrd: RemoteData<PaginatedList<Bitstream>>) => !!bplrd && bplrd.isSuccess),
            tap((d) => console.log('8', d)),
            map((bplrd: RemoteData<PaginatedList<Bitstream>>) => bplrd.payload),
            tap((d) => console.log('9', d)),
            map((bpl: PaginatedList<Bitstream>) => bpl.page),
            tap((d) => console.log('10', d)),
            map((bitstreams: Array<Bitstream>) => bitstreams
              .find((bitstream: Bitstream) => bitstream.name.startsWith('PERMISSION')))))))
    );

    this.proxyLicense.subscribe((b) => {
      console.log('result', b);
    });

    // get the license by following collection licenses link
    this.collectionDataService.findById(this.collectionId, true, true, followLink('licenses')).pipe(
      filter((collectionData: RemoteData<Collection>) => isNotUndefined((collectionData.payload))),
      take(1),
      switchMap((collectionData: RemoteData<Collection>) => (collectionData.payload as any).licenses),
      filter((licenseData: RemoteData<PaginatedList<License>>) => licenseData.hasSucceeded),
      map((licenseData: RemoteData<PaginatedList<License>>) => licenseData.payload.page),
      filter((licences: License[]) => !!licences && Array.isArray(licences) && licences.length > 0),
      take(1)
    ).subscribe((licences: License[]) => {

      // initialize the base component
      this.onSectionInit();

      // create a license form model with license options
      const licenseFormModel = this.formBuilderService.fromJSON([
        {
          id: 'selected',
          options: licences.map((license: License) => {
            return {
              label: license.label,
              value: license.name
            };
          }),
          type: 'RADIO_GROUP',
        }
      ]);

      const getLicense = (name: string) => licences.find((license: License) => license.name === name);

      // get the license granted form control model
      const grantedFormControlModel = this.formBuilderService.findById('granted', this.formModel);

      // get the license selected form control model
      const selectionFormControlModel = this.formBuilderService.findById('selected', licenseFormModel);

      this.subs.push(
        // listen license selected/change and show license
        (selectionFormControlModel as DynamicRadioGroupModel<string>).valueChanges.pipe(
          filter((name: string) => !!name)
        ).subscribe((name: string) => {

          if (name !== (this.sectionData.data as WorkspaceitemSectionLicenseObject).selected) {
            (grantedFormControlModel as DynamicCheckboxModel).value = false;
          }

          setTimeout(() => {
            let children = this.formWrapper.nativeElement.children;
            while (!!children && children.length > 0 && !children[0].classList.contains('tamu-control')) {
              children = children[0].children;
            }
            let control = children[children.length - 1];
            while (control.classList.contains('tamu-control-license')) {
              control.remove();
              control = children[children.length - 1];
            }

            control.parentNode.insertBefore(this.labelWrapper.nativeElement, control.nextSibling);

            if (name === 'proxy') {
              control.parentNode.insertBefore(this.uploaderWrapper.nativeElement, control.nextSibling);
            }

            control.parentNode.insertBefore(this.licenseWrapper.nativeElement, control.nextSibling);

            const license = getLicense(name);
            this._license.next(license.text.replace(/\n/g, '<br>'));

            this._selected.next(name);
          });
        })
      );

      (selectionFormControlModel as DynamicRadioGroupModel<string>).value = (this.sectionData.data as WorkspaceitemSectionLicenseObject).selected;

      grantedFormControlModel.relations.push({
        match: MATCH_DISABLED,
        when: [{ id: 'selected', value: null }],
      });

      // add the license form control model to the base component form model
      this.formModel.unshift(selectionFormControlModel);

      this.updateSectionStatus();
    });
  }

  /**
   * Open confirm modal and remove when confirmed.
   *
   * @param content element reference for modal
   * @param bitstream proxy license bitstream
   */
  public confirmRemoveProxy(content, bitstream): void {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this._removing_proxy.next(true);
          this.bitstreamService.delete(bitstream.id).pipe(take(1)).subscribe((results) => {
            this._removing_proxy.next(false);
            // this.notificationsService.success(null, this.translateService.get('submission.sections.proxy-license.permission-upload-successful'));
          });
        }
      }
    );
  }

  /**
   * Nothing to do here
   *
   * @returns empty observable
   */
  public onBeforeUpload = () => {
    return of();
  };

  /**
   * Show success notification on upload successful
   */
  public onCompleteItem(workspaceitem: WorkspaceItem) {
    const { sections } = workspaceitem;
    if (sections && isNotEmpty(sections)) {
      this.notificationsService.success(null, this.translateService.get('submission.sections.proxy-license.permission-upload-successful'));
    }
  }

  /**
   * Show error notification on upload failed
   */
  public onUploadError() {
    this.notificationsService.error(null, this.translateService.get('submission.sections.proxy-license.permission-upload-failed'));
  }

}

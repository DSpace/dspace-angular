import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';
import { ActivatedRoute, Router } from '@angular/router';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { notifyPatterns } from '../ldn-services-patterns/ldn-service-coar-patterns';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { LdnService } from '../ldn-services-model/ldn-services.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Operation } from 'fast-json-patch';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { LdnItemfiltersService } from '../ldn-services-data/ldn-itemfilters-data.service';
import { Itemfilter } from '../ldn-services-model/ldn-service-itemfilters';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Observable } from 'rxjs';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';

@Component({
    selector: 'ds-ldn-service-form-edit',
    templateUrl: './ldn-service-form-edit.component.html',
    styleUrls: ['./ldn-service-form-edit.component.scss'],
    animations: [
        trigger('toggleAnimation', [
            state('true', style({})),
            state('false', style({})),
            transition('true <=> false', animate('300ms ease-in')),
        ]),
    ],
})
export class LdnServiceFormEditComponent implements OnInit {
    formModel: FormGroup;
    @ViewChild('confirmModal', {static: true}) confirmModal: TemplateRef<any>;
    @ViewChild('resetFormModal', {static: true}) resetFormModal: TemplateRef<any>;

    public inboundPatterns: object[] = notifyPatterns;
    public outboundPatterns: object[] = notifyPatterns;
    itemfiltersRD$: Observable<RemoteData<PaginatedList<Itemfilter>>>;
    config: FindListOptions = Object.assign(new FindListOptions(), {
        elementsPerPage: 20
    });
    pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
        id: 'po',
        pageSize: 20
    });
    @Input() public name: string;
    @Input() public description: string;
    @Input() public url: string;
    @Input() public ldnUrl: string;
    @Input() public score: number;
    @Input() public inboundPattern: string;
    @Input() public outboundPattern: string;
    @Input() public constraint: string;
    @Input() public automatic: boolean;
    @Input() public headerKey: string;
    markedForDeletionInboundPattern: number[] = [];
    markedForDeletionOutboundPattern: number[] = [];
    protected serviceId: string;
    private originalInboundPatterns: any[] = [];
    private originalOutboundPatterns: any[] = [];
    private deletedInboundPatterns: number[] = [];
    private deletedOutboundPatterns: number[] = [];
    private modalRef: any;
    private service: LdnService;

    constructor(
        protected ldnServicesService: LdnServicesService,
        private ldnItemfiltersService: LdnItemfiltersService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
        protected modalService: NgbModal,
        private notificationService: NotificationsService,
        private translateService: TranslateService,
        protected paginationService: PaginationService
    ) {

        this.formModel = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            description: ['', Validators.required],
            url: ['', Validators.required],
            ldnUrl: ['', Validators.required],
            score: ['', [Validators.required, Validators.pattern('^0*(\.[0-9]+)?$|^1(\.0+)?$')]],
            inboundPattern: [''],
            outboundPattern: [''],
            constraintPattern: [''],
            enabled: [''],
            notifyServiceInboundPatterns: this.formBuilder.array([this.createInboundPatternFormGroup()]),
            notifyServiceOutboundPatterns: this.formBuilder.array([this.createOutboundPatternFormGroup()]),
            type: LDN_SERVICE.value,
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.serviceId = params.serviceId;
            if (this.serviceId) {
                this.fetchServiceData(this.serviceId);
            }
        });
        this.setItemfilters();
    }

    setItemfilters() {
        this.itemfiltersRD$ = this.ldnItemfiltersService.findAll().pipe(
            getFirstCompletedRemoteData());
    }


    fetchServiceData(serviceId: string): void {
        this.ldnServicesService.findById(serviceId).pipe(
            getFirstCompletedRemoteData()
        ).subscribe(
            (data: RemoteData<LdnService>) => {
                if (data.hasSucceeded) {
                    this.service = data.payload;

                    this.formModel.patchValue({
                        id: this.service.id,
                        name: this.service.name,
                        description: this.service.description,
                        url: this.service.url,
                        score: this.service.score,
                        ldnUrl: this.service.ldnUrl,
                        type: this.service.type,
                        enabled: this.service.enabled
                    });

                    const inboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
                    inboundPatternsArray.clear();

                    this.service.notifyServiceInboundPatterns.forEach((pattern: any) => {
                        const patternFormGroup = this.initializeInboundPatternFormGroup();
                        patternFormGroup.patchValue(pattern);
                        inboundPatternsArray.push(patternFormGroup);
                        this.cdRef.detectChanges();
                    });

                    const outboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
                    outboundPatternsArray.clear();

                    this.service.notifyServiceOutboundPatterns.forEach((pattern: any) => {
                        const patternFormGroup = this.initializeOutboundPatternFormGroup();
                        patternFormGroup.patchValue(pattern);
                        outboundPatternsArray.push(patternFormGroup);

                        this.cdRef.detectChanges();
                    });
                    this.originalInboundPatterns = [...this.service.notifyServiceInboundPatterns];
                    this.originalOutboundPatterns = [...this.service.notifyServiceOutboundPatterns];
                }
            },
        );
    }

    generatePatchOperations(): any[] {
        const patchOperations: any[] = [];

        this.createReplaceOperation(patchOperations, 'name', '/name');
        this.createReplaceOperation(patchOperations, 'description', '/description');
        this.createReplaceOperation(patchOperations, 'ldnUrl', '/ldnurl');
        this.createReplaceOperation(patchOperations, 'url', '/url');
        this.createReplaceOperation(patchOperations, 'score', '/score');


        this.handlePatterns(patchOperations, 'notifyServiceInboundPatterns');
        this.handlePatterns(patchOperations, 'notifyServiceOutboundPatterns');

        this.deletedInboundPatterns.forEach(index => {
            const removeOperation: Operation = {
                op: 'remove',
                path: `notifyServiceInboundPatterns[${index}]`
            };
            patchOperations.push(removeOperation);
        });

        this.deletedOutboundPatterns.forEach(index => {
            const removeOperation: Operation = {
                op: 'remove',
                path: `notifyServiceOutboundPatterns[${index}]`
            };
            patchOperations.push(removeOperation);
        });

        return patchOperations;
    }

    onSubmit() {
        this.openConfirmModal(this.confirmModal);
    }

    addInboundPattern() {
        const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
        notifyServiceInboundPatternsArray.push(this.createInboundPatternFormGroup());
    }

    addOutboundPattern() {
        const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
        notifyServiceOutboundPatternsArray.push(this.createOutboundPatternFormGroup());
    }


    toggleAutomatic(i: number) {
        const automaticControl = this.formModel.get(`notifyServiceInboundPatterns.${i}.automatic`);
        if (automaticControl) {
            automaticControl.setValue(!automaticControl.value);
        }
    }

    toggleEnabled() {
        const newStatus = !this.formModel.get('enabled').value;

        const patchOperation: Operation = {
            op: 'replace',
            path: '/enabled',
            value: newStatus,
        };

        this.ldnServicesService.patch(this.service, [patchOperation]).pipe(
            getFirstCompletedRemoteData()
        ).subscribe(
            () => {

                this.formModel.get('enabled').setValue(newStatus);
                this.cdRef.detectChanges();
            }
        );
    }


    closeModal() {
        this.modalRef.close();
        this.cdRef.detectChanges();
    }

    openConfirmModal(content) {
        this.modalRef = this.modalService.open(content);
    }

    openResetFormModal(content) {
        this.modalRef = this.modalService.open(content);
    }

    patchService() {
        this.deleteMarkedInboundPatterns();
        this.deleteMarkedOutboundPatterns();
        const patchOperations = this.generatePatchOperations();


        this.ldnServicesService.patch(this.service, patchOperations).pipe(
            getFirstCompletedRemoteData()
        ).subscribe((rd: RemoteData<LdnService>) => {
          if (rd.hasSucceeded) {
            this.closeModal();
            this.sendBack();
            this.notificationService.success(this.translateService.get('admin.registries.services-formats.modify.success.head'),
              this.translateService.get('admin.registries.services-formats.modify.success.content'));
          } else {
            this.notificationService.error(this.translateService.get('admin.registries.services-formats.modify.failure.head'),
              this.translateService.get('admin.registries.services-formats.modify.failure.content'));
            this.closeModal();
          }
        });
    }

    resetFormAndLeave() {
        this.sendBack();
        this.closeModal();
    }

    markForInboundPatternDeletion(index: number) {
        if (!this.markedForDeletionInboundPattern.includes(index)) {
            this.markedForDeletionInboundPattern.push(index);
        }
    }

    unmarkForInboundPatternDeletion(index: number) {
        const i = this.markedForDeletionInboundPattern.indexOf(index);
        if (i !== -1) {
            this.markedForDeletionInboundPattern.splice(i, 1);
        }
    }

    markForOutboundPatternDeletion(index: number) {
        if (!this.markedForDeletionOutboundPattern.includes(index)) {
            this.markedForDeletionOutboundPattern.push(index);
        }
    }

    unmarkForOutboundPatternDeletion(index: number) {
        const i = this.markedForDeletionOutboundPattern.indexOf(index);
        if (i !== -1) {
            this.markedForDeletionOutboundPattern.splice(i, 1);
        }
    }

    deleteMarkedInboundPatterns() {
        this.markedForDeletionInboundPattern.sort((a, b) => b - a);
        const patternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;

        for (const index of this.markedForDeletionInboundPattern) {
            if (index >= 0 && index < patternsArray.length) {
                const patternGroup = patternsArray.at(index) as FormGroup;
                const patternValue = patternGroup.value;
                if (patternValue.isNew) {
                    patternsArray.removeAt(index);
                } else {
                    this.deletedInboundPatterns.push(index);
                }
            }
        }

        this.markedForDeletionInboundPattern = [];
    }


    deleteMarkedOutboundPatterns() {
        this.markedForDeletionOutboundPattern.sort((a, b) => b - a);
        const patternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;

        for (const index of this.markedForDeletionOutboundPattern) {
            if (index >= 0 && index < patternsArray.length) {
                const patternGroup = patternsArray.at(index) as FormGroup;
                const patternValue = patternGroup.value;
                if (patternValue.isNew) {
                    patternsArray.removeAt(index);
                } else {

                    this.deletedOutboundPatterns.push(index);
                }
            }
        }

        this.markedForDeletionOutboundPattern = [];
    }

    private createReplaceOperation(patchOperations: any[], formControlName: string, path: string): void {
        if (this.formModel.get(formControlName).dirty) {
            patchOperations.push({
                op: 'replace',
                path,
                value: this.formModel.get(formControlName).value,
            });
        }
    }

    private handlePatterns(patchOperations: any[], formArrayName: string): void {
        const patternsArray = this.formModel.get(formArrayName) as FormArray;

        for (let i = 0; i < patternsArray.length; i++) {
            const patternGroup = patternsArray.at(i) as FormGroup;
            const patternValue = patternGroup.value;

            if (patternGroup.dirty) {
                if (patternValue.isNew) {
                    delete patternValue.isNew;
                    const addOperation = {
                        op: 'add',
                        path: `${formArrayName}/-`,
                        value: patternValue,
                    };
                    patchOperations.push(addOperation);
                } else {
                    const replaceOperation = {
                        op: 'replace',
                        path: `${formArrayName}[${i}]`,
                        value: patternValue,
                    };
                    patchOperations.push(replaceOperation);
                }
            }
        }
    }

    private sendBack() {
        this.router.navigateByUrl('admin/ldn/services');
    }

    private createOutboundPatternFormGroup(): FormGroup {
        return this.formBuilder.group({
            pattern: '',
            constraint: '',
            isNew: true,
        });
    }

    private createInboundPatternFormGroup(): FormGroup {
        return this.formBuilder.group({
            pattern: '',
            constraint: '',
            automatic: false,
            isNew: true
        });
    }

    private initializeOutboundPatternFormGroup(): FormGroup {
        return this.formBuilder.group({
            pattern: '',
            constraint: '',
        });
    }

    private initializeInboundPatternFormGroup(): FormGroup {
        return this.formBuilder.group({
            pattern: '',
            constraint: '',
            automatic: '',
        });
    }
}

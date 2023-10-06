import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LdnDirectoryService } from '../ldn-services-services/ldn-directory.service';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { LdnServiceConstraint } from '../ldn-services-model/ldn-service-constraint.model';
import { notifyPatterns } from '../ldn-services-patterns/ldn-service-coar-patterns';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
export class LdnServiceFormEditComponent {
    formModel: FormGroup;

    showItemFilterDropdown = false;

    private originalInboundPatterns: any[] = [];
    private originalOutboundPatterns: any[] = [];
    public inboundPatterns: object[] = notifyPatterns;
    public outboundPatterns: object[] = notifyPatterns;
    public itemFilterList: LdnServiceConstraint[];

    @Input() public name: string;
    @Input() public description: string;
    @Input() public url: string;
    @Input() public ldnUrl: string;
    @Input() public inboundPattern: string;
    @Input() public outboundPattern: string;
    @Input() public constraint: string;
    @Input() public automatic: boolean;

    @Input() public headerKey: string;
    private serviceId: string;

    constructor(
        private ldnServicesService: LdnServicesService,
        private ldnDirectoryService: LdnDirectoryService,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef
    ) {

        this.formModel = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            description: ['', Validators.required],
            url: ['', Validators.required],
            ldnUrl: ['', Validators.required],
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
        this.ldnDirectoryService.getItemFilters().subscribe((itemFilters) => {
            this.itemFilterList = itemFilters._embedded.itemfilters.map((filter: { id: string; }) => ({
                name: filter.id
            }));
            this.cdRef.detectChanges();

        });
    }

    private getOriginalPattern(formArrayName: string, patternId: number): any {
        let originalPatterns: any[] = [];

        if (formArrayName === 'notifyServiceInboundPatterns') {
            originalPatterns = this.originalInboundPatterns;
        } else if (formArrayName === 'notifyServiceOutboundPatterns') {
            originalPatterns = this.originalOutboundPatterns;
        }

        return originalPatterns.find((pattern) => pattern.id === patternId);
    }

    private patternsAreEqual(patternA: any, patternB: any): boolean {
        return (
            patternA.pattern === patternB.pattern &&
            patternA.constraint === patternB.constraint &&
            patternA.automatic === patternB.automatic
        );
    }

    fetchServiceData(serviceId: string): void {
        const apiUrl = `http://localhost:8080/server/api/ldn/ldnservices/${serviceId}`;

        this.http.get(apiUrl).subscribe(
            (data: any) => {
                console.log(data);

                this.formModel.patchValue({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    url: data.url,
                    ldnUrl: data.ldnUrl,
                    type: data.type,
                    enabled: data.enabled
                });

                const inboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
                inboundPatternsArray.clear(); // Clear existing rows

                data.notifyServiceInboundPatterns.forEach((pattern: any) => {
                    console.log(pattern);
                    const patternFormGroup = this.initializeInboundPatternFormGroup();
                    console.log();
                    patternFormGroup.patchValue(pattern);
                    inboundPatternsArray.push(patternFormGroup);
                    this.cdRef.detectChanges();
                });

                const outboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
                outboundPatternsArray.clear();

                data.notifyServiceOutboundPatterns.forEach((pattern: any) => {
                    const patternFormGroup = this.initializeOutboundPatternFormGroup();
                    patternFormGroup.patchValue(pattern);
                    outboundPatternsArray.push(patternFormGroup);

                    this.cdRef.detectChanges();
                });
                this.originalInboundPatterns = [...data.notifyServiceInboundPatterns];

                this.originalOutboundPatterns = [...data.notifyServiceOutboundPatterns];
            },
            (error) => {
                console.error('Error fetching service data:', error);
            }
        );
    }


    generatePatchOperations(): any[] {
        const patchOperations: any[] = [];

        this.addReplaceOperation(patchOperations, 'name', '/name');
        this.addReplaceOperation(patchOperations, 'description', '/description');
        this.addReplaceOperation(patchOperations, 'ldnUrl', '/ldnurl');
        this.addReplaceOperation(patchOperations, 'url', '/url');

        this.handlePatterns(patchOperations, 'notifyServiceInboundPatterns');

        this.handlePatterns(patchOperations, 'notifyServiceOutboundPatterns');

        return patchOperations;
    }

    private addReplaceOperation(patchOperations: any[], formControlName: string, path: string): void {
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

        if (patternsArray.dirty) {
            for (let i = 0; i < patternsArray.length; i++) {
                const patternGroup = patternsArray.at(i) as FormGroup;
                const patternValue = patternGroup.value;

                if (patternValue.isNew) {
                  console.log(this.getOriginalPatternsForFormArray(formArrayName));
                  console.log(patternGroup);
                  delete patternValue.isNew;
                    const addOperation = {
                        op: 'add',
                        path: `${formArrayName}/-`,
                        value: patternValue,
                    };
                    patchOperations.push(addOperation);
                } else if (patternGroup.dirty) {
                    const replaceOperation = {
                        op: 'replace',
                        path: `${formArrayName}[${i}]`,
                        value: patternValue,
                    };
                    patchOperations.push(replaceOperation);
                    console.log(patternValue.id);
                }
            }
        }
    }

    private getOriginalPatternsForFormArray(formArrayName: string): any[] {
        if (formArrayName === 'notifyServiceInboundPatterns') {
            return this.originalInboundPatterns;
        } else if (formArrayName === 'notifyServiceOutboundPatterns') {
            return this.originalOutboundPatterns;
        }
        return [];
    }

    submitForm() {
        const apiUrl = `http://localhost:8080/server/api/ldn/ldnservices/${this.serviceId}`;
        const patchOperations = this.generatePatchOperations();

        this.http.patch(apiUrl, patchOperations).subscribe(
            (response) => {
                console.log('Service updated successfully:', response);
                this.sendBack();
            },
            (error) => {
                console.error('Error updating service:', error);
            }
        );

    }


    addInboundPattern() {
        const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
        notifyServiceInboundPatternsArray.push(this.createInboundPatternFormGroup());
    }

    removeInboundPattern(index: number) {
        const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
        if (index >= 0 && index < notifyServiceInboundPatternsArray.length) {
            const serviceId = this.formModel.get('id').value;

            const patchOperation = [
                {
                    op: 'remove',
                    path: `notifyServiceInboundPatterns[${index}]`
                }
            ];

            const apiUrl = `http://localhost:8080/server/api/ldn/ldnservices/${serviceId}`;

            this.http.patch(apiUrl, patchOperation).subscribe(
                (response) => {
                    console.log('Pattern removed successfully:', response);

                    notifyServiceInboundPatternsArray.removeAt(index);
                },
                (error) => {
                    console.error('Error removing pattern:', error);
                }
            );
        }
    }

    addOutboundPattern() {
        const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
        notifyServiceOutboundPatternsArray.push(this.createOutboundPatternFormGroup());
    }

    removeOutboundPattern(index: number) {
        const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
        if (index >= 0 && index < notifyServiceOutboundPatternsArray.length) {
            const serviceId = this.formModel.get('id').value;


            const patchOperation = [
                {
                    op: 'remove',
                    path: `notifyServiceOutboundPatterns[${index}]`
                }
            ];

            const apiUrl = `http://localhost:8080/server/api/ldn/ldnservices/${serviceId}`;

            this.http.patch(apiUrl, patchOperation).subscribe(
                (response) => {
                    console.log('Pattern removed successfully:', response);

                    notifyServiceOutboundPatternsArray.removeAt(index);
                },
                (error) => {
                    console.error('Error removing pattern:', error);
                }
            );
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
            automatic: '',
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

    toggleAutomatic(i: number) {
        const automaticControl = this.formModel.get(`notifyServiceInboundPatterns.${i}.automatic`);
        if (automaticControl) {
            automaticControl.setValue(!automaticControl.value);
        }
    }

  toggleEnabled() {
    const newStatus = !this.formModel.get('enabled').value;
    const serviceId = this.formModel.get('id').value;
    const status = this.formModel.get('enabled').value;

    const apiUrl = `http://localhost:8080/server/api/ldn/ldnservices/${serviceId}`;
    const patchOperation = {
      op: 'replace',
      path: '/enabled',
      value: newStatus,
    };

    this.http.patch(apiUrl, [patchOperation]).subscribe(
      () => {
        console.log('Status updated successfully.');
        this.formModel.get('enabled').setValue(newStatus);
        console.log(this.formModel.get('enabled'));
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }
}

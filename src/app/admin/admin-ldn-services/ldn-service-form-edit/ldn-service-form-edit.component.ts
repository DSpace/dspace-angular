import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LdnDirectoryService } from '../ldn-services-services/ldn-directory.service';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { LdnServiceConstraint } from '../ldn-services-model/ldn-service-constraint.model';
import { notifyPatterns } from '../ldn-services-patterns/ldn-service-coar-patterns';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute and Params

@Component({
    selector: 'ds-ldn-service-form-edit',
    templateUrl: './ldn-service-form-edit.component.html',
    styleUrls: ['./ldn-service-form-edit.component.scss']
})
export class LdnServiceFormEditComponent {
    formModel: FormGroup;

    showItemFilterDropdown = false;

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
        private route: ActivatedRoute
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
            console.log(itemFilters);
            this.itemFilterList = itemFilters._embedded.itemfilters.map((filter: { id: string; }) => ({
                name: filter.id
            }));
            console.log(this.itemFilterList);
        });
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
                    notifyServiceInboundPatterns: data.notifyServiceInboundPatterns,
                    notifyServiceOutboundPatterns: data.notifyServiceOutboundPatterns
                });
            },
            (error) => {
                console.error('Error fetching service data:', error);
            }
        );
    }

    generatePatchOperations(): any[] {
        const patchOperations: any[] = [];

        if (this.formModel.get('name').dirty) {
            patchOperations.push({
                op: 'replace',
                path: '/name',
                value: this.formModel.get('name').value,
            });
        }

        if (this.formModel.get('description').dirty) {
            patchOperations.push({
                op: 'replace',
                path: '/description',
                value: this.formModel.get('description').value,
            });
        }

        if (this.formModel.get('ldnUrl').dirty) {
            patchOperations.push({
                op: 'replace',
                path: '/ldnUrl',
                value: this.formModel.get('ldnUrl').value,
            });
        }

        if (this.formModel.get('url').dirty) {
            patchOperations.push({
                op: 'replace',
                path: '/url',
                value: this.formModel.get('url').value,
            });
        }

        const inboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
        const inboundPatternsControls = inboundPatternsArray.controls;

        if (inboundPatternsArray.dirty) {
            const inboundPatternsValue = [];

            for (let i = 0; i < inboundPatternsControls.length; i++) {
                const patternGroup = inboundPatternsControls[i] as FormGroup;
                const patternValue = patternGroup.value;

                if (patternGroup.dirty) {
                    inboundPatternsValue.push(patternValue);
                }
            }

            if (inboundPatternsValue.length > 0) {
                patchOperations.push({
                    op: 'replace',
                    path: '/notifyServiceInboundPatterns',
                    value: inboundPatternsValue,
                });
            } else {
                patchOperations.push({
                    op: 'remove',
                    path: '/notifyServiceInboundPatterns',
                });
            }
        }


        const outboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
        const outboundPatternsControls = outboundPatternsArray.controls;

        if (outboundPatternsArray.dirty) {
            const outboundPatternsValue = [];

            for (let i = 0; i < outboundPatternsControls.length; i++) {
                const patternGroup = outboundPatternsControls[i] as FormGroup;
                const patternValue = patternGroup.value;

                if (patternGroup.dirty) {
                    outboundPatternsValue.push(patternValue);
                }
            }

            if (outboundPatternsValue.length > 0) {
                patchOperations.push({
                    op: 'replace',
                    path: '/notifyServiceOutboundPatterns',
                    value: outboundPatternsValue,
                });
            } else {
                patchOperations.push({
                    op: 'remove',
                    path: '/notifyServiceOutboundPatterns',
                });
            }
        }

        return patchOperations;
    }

    submitForm() {
        const apiUrl = `http://localhost:8080/server/api/ldn/ldnservices/${this.serviceId}`;
        const patchOperations = this.generatePatchOperations();

        this.http.patch(apiUrl, patchOperations).subscribe(
            (response) => {
                console.log('Service updated successfully:', response);
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

    removeInboundPattern(patternGroup: FormGroup) {
        const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
        notifyServiceInboundPatternsArray.removeAt(notifyServiceInboundPatternsArray.controls.indexOf(patternGroup));
    }

    addOutboundPattern() {
        const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
        notifyServiceOutboundPatternsArray.push(this.createOutboundPatternFormGroup());
    }

    removeOutboundPattern(patternGroup: FormGroup) {
        const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
        notifyServiceOutboundPatternsArray.removeAt(notifyServiceOutboundPatternsArray.controls.indexOf(patternGroup));
    }

    private sendBack() {
        this.router.navigateByUrl('admin/ldn/services');
    }

    private createOutboundPatternFormGroup(): FormGroup {
        return this.formBuilder.group({
            pattern: '',
            constraint: ''
        });
    }

    private createInboundPatternFormGroup(): FormGroup {
        return this.formBuilder.group({
            pattern: '',
            constraint: '',
            automatic: ''
        });
    }
}

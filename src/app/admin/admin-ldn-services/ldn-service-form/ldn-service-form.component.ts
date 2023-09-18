import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { LdnServiceConstraint } from '../ldn-services-model/ldn-service-constraint.model';
import { notifyPatterns } from '../ldn-services-patterns/ldn-service-coar-patterns';
import { LdnDirectoryService } from '../ldn-services-services/ldn-directory.service';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';

@Component({
    selector: 'ds-ldn-service-form',
    templateUrl: './ldn-service-form.component.html',
    styleUrls: ['./ldn-service-form.component.scss'],
})
export class LdnServiceFormComponent implements OnInit {
    formModel: FormGroup;

    showItemFilterDropdown = false;

    public inboundPatterns: object[] = notifyPatterns;
    public outboundPatterns: object[] = notifyPatterns;
    public itemFilterList: LdnServiceConstraint[];
    additionalOutboundPatterns: FormGroup[] = [];
    additionalInboundPatterns: FormGroup[] = [];

    @Input() public name: string;
    @Input() public description: string;
    @Input() public url: string;
    @Input() public ldnUrl: string;
    @Input() public inboundPattern: string;
    @Input() public outboundPattern: string;
    @Input() public constraint: string;
    @Input() public automatic: boolean;

    @Input() public headerKey: string;

    constructor(
        private ldnServicesService: LdnServicesService,
        private ldnDirectoryService: LdnDirectoryService,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router
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
        this.ldnDirectoryService.getItemFilters().subscribe((itemFilters) => {
            console.log(itemFilters);
            this.itemFilterList = itemFilters._embedded.itemfilters.map((filter: { id: string; }) => ({
                name: filter.id
            }));
            console.log(this.itemFilterList);
        });

    }

    submitForm() {
        this.formModel.removeControl('inboundPattern');
        this.formModel.removeControl('outboundPattern');
        this.formModel.removeControl('constraintPattern');
        console.log('JSON Data:', this.formModel.value);

        const apiUrl = 'http://localhost:8080/server/api/ldn/ldnservices';

        this.http.post(apiUrl, this.formModel.value ).subscribe(
            (response) => {
                console.log('Service created successfully:', response);
                this.formModel.reset();
                this.sendBack();
            },
            (error) => {
                console.error('Error creating service:', error);
            }
        );
    }

    private validateForm(form: FormGroup): boolean {
        let valid = true;
        Object.keys(form.controls).forEach((key) => {
            if (form.controls[key].invalid) {
                form.controls[key].markAsDirty();
                valid = false;
            }
        });
        return valid;
    }

    private sendBack() {
        this.router.navigateByUrl('admin/ldn/services');
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

    private createOutboundPatternFormGroup(): FormGroup {
        return this.formBuilder.group({
            pattern: [''],
            constraint: [''],
        });
    }

    private createInboundPatternFormGroup(): FormGroup {
        return this.formBuilder.group({
            pattern: [''],
            constraint: [''],
            automatic: [true]
        });
    }
}

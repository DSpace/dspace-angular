import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LdnServiceFormComponent} from './ldn-service-form.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LdnItemfiltersService} from '../ldn-services-data/ldn-itemfilters-data.service';
import {LdnServicesService} from '../ldn-services-data/ldn-services-data.service';
import {NotificationsService} from 'src/app/shared/notifications/notifications.service';
import {Router} from '@angular/router';
import {RouterStub} from 'src/app/shared/testing/router.stub';
import {createPaginatedList} from 'src/app/shared/testing/utils.test';
import {Itemfilter} from '../ldn-services-model/ldn-service-itemfilters';
import {createSuccessfulRemoteDataObject$} from 'src/app/shared/remote-data.utils';
import {of} from 'rxjs';
import {EventEmitter} from '@angular/core';

describe('LdnServiceFormComponent', () => {
    let component: LdnServiceFormComponent;
    let fixture: ComponentFixture<LdnServiceFormComponent>;

    let ldnServicesService: any;
    let ldnItemfiltersService: any;
    let notificationsService: any;

    const itemFiltersRdPL$ = createSuccessfulRemoteDataObject$(createPaginatedList([new Itemfilter()]));
    const translateServiceStub = {
        get: () => of('translated-text'),
        onLangChange: new EventEmitter(),
        onTranslationChange: new EventEmitter(),
        onDefaultLangChange: new EventEmitter()
    };

    beforeEach(async () => {
        ldnItemfiltersService = jasmine.createSpyObj('ldnItemfiltersService', {
            findAll: jasmine.createSpy('findAll'),
        });

        ldnServicesService = jasmine.createSpyObj('ldnServicesService', {
            create: jasmine.createSpy('create'),
        });

        notificationsService = jasmine.createSpyObj('notificationsService', {
            success: jasmine.createSpy('success'),
            error: jasmine.createSpy('error'),
        });

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                NgbModalModule,
                TranslateModule.forRoot()
            ],
            providers: [
                {provide: LdnItemfiltersService, useValue: ldnItemfiltersService},
                {provide: LdnServicesService, useValue: ldnServicesService},
                {provide: NotificationsService, useValue: notificationsService},
                {provide: TranslateService, useValue: translateServiceStub},
                {provide: Router, useValue: new RouterStub()},
                {
                    provide: NgbModal, useValue: {
                        open: () => {/*comment*/
                        }
                    }
                },
                FormBuilder
            ],
            declarations: [LdnServiceFormComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LdnServiceFormComponent);
        component = fixture.componentInstance;
        ldnItemfiltersService.findAll.and.returnValue(itemFiltersRdPL$);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

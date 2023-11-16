import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LdnServicesOverviewComponent} from './ldn-services-directory.component';
import {ChangeDetectorRef, EventEmitter} from '@angular/core';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {NotificationsServiceStub} from '../../../shared/testing/notifications-service.stub';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LdnServicesService} from '../ldn-services-data/ldn-services-data.service';
import {PaginationService} from '../../../core/pagination/pagination.service';
import {PaginationServiceStub} from '../../../shared/testing/pagination-service.stub';
import {of} from 'rxjs';

describe('LdnServicesOverviewComponent', () => {
    let component: LdnServicesOverviewComponent;
    let fixture: ComponentFixture<LdnServicesOverviewComponent>;

    const translateServiceStub = {
        get: () => of('translated-text'),
        onLangChange: new EventEmitter(),
        onTranslationChange: new EventEmitter(),
        onDefaultLangChange: new EventEmitter()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [LdnServicesOverviewComponent],
            providers: [
                {provide: LdnServicesService, useValue: {}},
                {provide: PaginationService, useValue: new PaginationServiceStub()},
                {
                    provide: NgbModal, useValue: {
                        open: () => {/*comment*/
                        }
                    }
                },
                {provide: ChangeDetectorRef, useValue: {}},
                {provide: NotificationsService, useValue: NotificationsServiceStub},
                {provide: TranslateService, useValue: translateServiceStub},
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LdnServicesOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

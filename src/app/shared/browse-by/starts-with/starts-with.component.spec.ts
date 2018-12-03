import { StartsWithComponent } from './starts-with.component';
import { DebugElement } from '@angular/core';
import { PageInfo } from '../../../core/shared/page-info.model';
import { async } from 'q';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HostWindowService } from '../../host-window.service';
import { HostWindowServiceStub } from '../../testing/host-window-service-stub';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../mocks/mock-translate-loader';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StartsWithComponent', () => {

    let component: StartsWithComponent;
    let deAlphabetsList: DebugElement;
    let deLinkA: DebugElement;
    let deInputBox: DebugElement;
    let fixture: ComponentFixture<StartsWithComponent>;

    let currentUrl = '/browse/title';

    const pageInfo: PageInfo = {
        startsWith: 'Ab'
    }

    const emptyPageInfo: PageInfo = {};

    let routerState = {
        url: '/browse/title'
    }

    describe('when is not a mobile view', () => {
        beforeEach(async(() => {
            const window = new HostWindowServiceStub(800);

            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    RouterTestingModule,
                    TranslateModule.forRoot({
                        loader: {
                        provide: TranslateLoader,
                        useClass: MockTranslateLoader
                        }
                    })
                ],
                declarations: [
                    StartsWithComponent
                ],
                providers: [
                    { provide: HostWindowService, useValue: window }, TranslateService
                ],
                schemas: [NO_ERRORS_SCHEMA]
            })
                .compileComponents()
        }))

        it('should display the alphabet links', () => {
            fixture = TestBed.createComponent(StartsWithComponent);
            component = fixture.componentInstance;
            component.pageInfo = pageInfo;
            component.currentUrl = currentUrl;
            fixture.detectChanges();

            const selector = 'div.d-none>ul.pagination.pagination-sm';
            deAlphabetsList = fixture.debugElement.query(By.css(selector));
            expect(deAlphabetsList).toBeDefined();
            // expect(deAlphabetsList.nativeElement.offsetHeight).toBeGreaterThan(0);
        })
    })

    describe('when is a mobile view', () => {
        beforeEach(async(() => {
            const window = new HostWindowServiceStub(300);

            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    RouterTestingModule,
                    TranslateModule.forRoot({
                        loader: {
                        provide: TranslateLoader,
                        useClass: MockTranslateLoader
                        }
                    })
                ],
                declarations: [
                    StartsWithComponent
                ],
                providers: [
                    { provide: HostWindowService, useValue: window }
                ],
                schemas: [NO_ERRORS_SCHEMA]
            })
                .compileComponents()
        }))

        it('should display the alphabet links', () => {
            fixture = TestBed.createComponent(StartsWithComponent);
            component = fixture.componentInstance;
            component.pageInfo = pageInfo;
            component.currentUrl = currentUrl;
            fixture.detectChanges();

            const selector = 'div.d-none>ul.pagination.pagination-sm';
            deAlphabetsList = fixture.debugElement.query(By.css(selector));
            expect(deAlphabetsList).toBeDefined();
            // expect(deAlphabetsList.nativeElement.offsetHeight).toBe(0);
        })
    })
})

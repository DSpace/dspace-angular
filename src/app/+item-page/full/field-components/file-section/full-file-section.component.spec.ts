import {FullFileSectionComponent} from './full-file-section.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {createSuccessfulRemoteDataObject$} from '../../../../shared/remote-data.utils';
import {createPaginatedList} from '../../../../shared/testing/utils.test';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateLoaderMock} from '../../../../shared/mocks/translate-loader.mock';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {VarDirective} from '../../../../shared/utils/var.directive';
import {FileSizePipe} from '../../../../shared/utils/file-size-pipe';
import {MetadataFieldWrapperComponent} from '../../../field-components/metadata-field-wrapper/metadata-field-wrapper.component';
import {BitstreamDataService} from '../../../../core/data/bitstream-data.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Bitstream} from '../../../../core/shared/bitstream.model';
import {of as observableOf} from 'rxjs';
import {MockBitstreamFormat1} from '../../../../shared/mocks/item.mock';
import {By} from '@angular/platform-browser';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';

describe('FullFileSectionComponent', () => {
    let comp: FullFileSectionComponent;
    let fixture: ComponentFixture<FullFileSectionComponent>;

    const mockBitstream: Bitstream = Object.assign(new Bitstream(),
        {
            sizeBytes: 10201,
            content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
            format: observableOf(MockBitstreamFormat1),
            bundleName: 'ORIGINAL',
            _links: {
                self: {
                    href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713'
                },
                content: {
                    href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content'
                }
            },
            id: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
            uuid: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
            type: 'bitstream',
            metadata: {
                'dc.title': [
                    {
                        language: null,
                        value: 'test_word.docx'
                    }
                ]
            }
        });

    const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
        findAllByItemAndBundleName: createSuccessfulRemoteDataObject$(createPaginatedList([mockBitstream, mockBitstream, mockBitstream]))
    });

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useClass: TranslateLoaderMock
                }
            }), BrowserAnimationsModule],
            declarations: [FullFileSectionComponent, VarDirective, FileSizePipe, MetadataFieldWrapperComponent],
            providers: [
                {provide: BitstreamDataService, useValue: bitstreamDataService},
                {provide: NotificationsService, useValue: new NotificationsServiceStub()}
            ],

            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(FullFileSectionComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    }));

    describe('when the full file section gets loaded with bitstreams available', () => {
        it ('should contain a list with bitstreams', () => {
            const fileSection = fixture.debugElement.queryAll(By.css('.file-section'));
            expect(fileSection.length).toEqual(6);
        });

        describe('when we press the pageChange button for original bundle', () => {
            beforeEach(() => {
                comp.switchOriginalPage(2);
                fixture.detectChanges();
            });

            it ('should give the value to the currentpage', () => {
                expect(comp.originalOptions.currentPage).toBe(2);
            })
            it ('should call the next function on the originalCurrentPage', (done) => {
                comp.originalCurrentPage$.subscribe((event) => {
                    expect(event).toEqual(2);
                    done();
                })
            })
        })

        describe('when we press the pageChange button for license bundle', () => {
            beforeEach(() => {
                comp.switchLicensePage(2);
                fixture.detectChanges();
            });

            it ('should give the value to the currentpage', () => {
                expect(comp.licenseOptions.currentPage).toBe(2);
            })
            it ('should call the next function on the licenseCurrentPage', (done) => {
                comp.licenseCurrentPage$.subscribe((event) => {
                    expect(event).toEqual(2);
                    done();
                })
            })
        })
    })
})

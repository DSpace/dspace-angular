import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  delay,
  of,
  throwError,
} from 'rxjs';

import { ItemBibliographyService } from '../../../../../core/data/bibliography-data.service';
import { Bibliography } from '../../../../../core/shared/bibliography/bibliography.model';
import { BibliographyData } from '../../../../../core/shared/bibliography/bibliography-data.model';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageBibliographyComponent } from './item-page-bibliography.component';

describe('ItemPageBibliographyComponent', () => {
  let component: ItemPageBibliographyComponent;
  let fixture: ComponentFixture<ItemPageBibliographyComponent>;
  let mockService: jasmine.SpyObj<ItemBibliographyService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;
  let testItem: Item;

  beforeEach(waitForAsync(() => {
    mockService = jasmine.createSpyObj('ItemBibliographyService', ['getBibliographies']);
    mockModalService = jasmine.createSpyObj('NgbModal', ['open']);

    void TestBed.configureTestingModule({
      imports: [
        ItemPageBibliographyComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
      providers: [
        { provide: ItemBibliographyService, useValue: mockService },
        { provide: NgbModal, useValue: mockModalService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ItemPageBibliographyComponent, {
        set: { providers: [{ provide: NgbModal, useValue: mockModalService }] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPageBibliographyComponent);
    component = fixture.componentInstance;
    testItem = new Item();
    component.item = testItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bibliographies and open modal', fakeAsync(() => {
    const mockBibliographies: Bibliography[] = [
      { style: 'bibtex', value: '@article{test}' },
      { style: 'apa', value: 'Author, 2025' },
    ];
    const mockData = { bibliographies: mockBibliographies };
    mockService.getBibliographies.and.returnValue(of(mockData as BibliographyData).pipe(delay(0)));
    const modalContent = {};

    component.openModal(modalContent);
    expect(component.loading).toBeTrue();
    expect(component.error).toBeFalse();

    tick();
    expect(component.bibliographies).toEqual(mockBibliographies);
    expect(component.loading).toBeFalse();
    expect(mockModalService.open).toHaveBeenCalledWith(modalContent, { size: 'lg' });
  }));

  it('should handle error when loading bibliographies', fakeAsync(() => {
    const mockError = new Error('Failed');
    mockService.getBibliographies.and.returnValue(throwError(() => mockError));
    const modalContent = {};

    component.openModal(modalContent);
    tick();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeTrue();
    expect(mockModalService.open).not.toHaveBeenCalled();
  }));

  it('should copy text to clipboard', () => {
    const text = 'Some text to copy';
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    component.copyToClipboard(text);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
  });

  it('should copy HTML text to clipboard as plain text', () => {
    const htmlText = '<p>HTML text</p>';
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    component.copyToClipboard(htmlText);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('HTML text');
  });
});

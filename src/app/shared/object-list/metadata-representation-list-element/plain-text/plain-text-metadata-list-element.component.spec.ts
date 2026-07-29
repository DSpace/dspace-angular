import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MetadatumRepresentation } from '@dspace/core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { mockData } from '@dspace/core/testing/browse-definition-data-service.stub';

import { PlainTextMetadataListElementComponent } from './plain-text-metadata-list-element.component';

// Render the mock representation with the default mock author browse definition so it is also rendered as a link
// without affecting other tests
const mockMetadataRepresentation = Object.assign(new MetadatumRepresentation('type', mockData[1]), {
  key: 'dc.contributor.author',
  value: 'Test Author',
});

describe('PlainTextMetadataListElementComponent', () => {
  let comp: PlainTextMetadataListElementComponent;
  let fixture: ComponentFixture<PlainTextMetadataListElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PlainTextMetadataListElementComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(PlainTextMetadataListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PlainTextMetadataListElementComponent);
    comp = fixture.componentInstance;
    comp.mdRepresentation = mockMetadataRepresentation;
    fixture.detectChanges();
  }));

  it('should contain the value as plain text', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain(mockMetadataRepresentation.value);
  });

  it('should contain the browse link as plain text', () => {
    expect(fixture.debugElement.query(By.css('a.ds-browse-link')).nativeElement.innerHTML).toContain(mockMetadataRepresentation.value);
  });

  it('should set lang attribute when language is provided', () => {
    (comp.mdRepresentation as any).language = 'en';
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.nativeElement.querySelector('.dont-break-out');
    expect(el.getAttribute('lang')).toBe('en');
  });

  it('should remove lang attribute when language becomes undefined', () => {
    (comp.mdRepresentation as any).language = 'fr';
    fixture.detectChanges();
    (comp.mdRepresentation as any).language = undefined;
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.nativeElement.querySelector('.dont-break-out');
    expect(el.getAttribute('lang')).toBeNull();
  });

});

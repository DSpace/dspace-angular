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
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Item } from '../../../../core/shared/item.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';
import { OrgUnitItemMetadataListElementComponent } from './org-unit-item-metadata-list-element.component';

const description = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.';
const organisation = 'Anonymous';
const mockItem = Object.assign(new Item(), { metadata: { 'dc.description': [{ value: description }], 'organization.legalName': [{ value: organisation }] } });
const virtMD = Object.assign(new MetadataValue(), { value: organisation });
const mockItemMetadataRepresentation = Object.assign(new ItemMetadataRepresentation(virtMD), mockItem);

describe('OrgUnitItemMetadataListElementComponent', () => {
  let comp: OrgUnitItemMetadataListElementComponent;
  let fixture: ComponentFixture<OrgUnitItemMetadataListElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        OrgUnitItemMetadataListElementComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(OrgUnitItemMetadataListElementComponent, {
      remove: {
        imports: [TruncatableComponent, RouterLink],
      },
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUnitItemMetadataListElementComponent);
    comp = fixture.componentInstance;
    comp.mdRepresentation = mockItemMetadataRepresentation;
    fixture.detectChanges();
  });

  it('should show the name of the organisation as a link', () => {
    const linkText = fixture.debugElement.query(By.css('a')).nativeElement.textContent;
    expect(linkText).toBe(organisation);
  });

  it('should show the description on hover over the link in a tooltip', () => {
    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    const tooltip = fixture.debugElement.query(By.css('.item-list-job-title')).nativeElement.textContent;
    expect(tooltip).toBe(description);
  });
});

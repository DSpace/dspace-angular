import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { MetadataLinkViewComponent } from '../../../metadata-link-view/metadata-link-view.component';
import { ThemedTypeBadgeComponent } from '../../../object-collection/shared/badges/type-badge/themed-type-badge.component';
import { ItemSubmitterComponent } from '../../../object-collection/shared/mydspace-item-submitter/item-submitter.component';
import { TruncatableComponent } from '../../../truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../truncatable/truncatable-part/truncatable-part.component';
import { VarDirective } from '../../../utils/var.directive';
import { RelationshipsItemsListPreviewComponent } from './relationships-items-list-preview.component';

describe('RelationshipsItemsListPreviewComponent', () => {
  let component: RelationshipsItemsListPreviewComponent;
  let fixture: ComponentFixture<RelationshipsItemsListPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarDirective, RelationshipsItemsListPreviewComponent],
    })
      .overrideComponent(RelationshipsItemsListPreviewComponent, { remove: { imports: [ThemedTypeBadgeComponent, TruncatableComponent, TruncatablePartComponent, MetadataLinkViewComponent, ItemSubmitterComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipsItemsListPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

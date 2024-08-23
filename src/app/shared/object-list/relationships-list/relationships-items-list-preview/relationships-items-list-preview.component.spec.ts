import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { VarDirective } from '../../../utils/var.directive';
import { RelationshipsItemsListPreviewComponent } from './relationships-items-list-preview.component';

describe('RelationshipsItemsListPreviewComponent', () => {
  let component: RelationshipsItemsListPreviewComponent;
  let fixture: ComponentFixture<RelationshipsItemsListPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VarDirective],
    declarations: [RelationshipsItemsListPreviewComponent],
})
      .compileComponents();
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

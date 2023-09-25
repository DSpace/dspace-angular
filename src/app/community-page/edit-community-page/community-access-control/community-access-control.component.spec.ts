import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityAccessControlComponent } from './community-access-control.component';

xdescribe('CommunityAccessControlComponent', () => {
  let component: CommunityAccessControlComponent;
  let fixture: ComponentFixture<CommunityAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CommunityAccessControlComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ActivatedRoute, Router } from '@angular/router';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ClaimItemSelectorComponent } from './claim-item-selector.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileClaimService } from 'src/app/profile-page/profile-claim/profile-claim.service';
import { of } from 'rxjs/internal/observable/of';

describe('ClaimItemSelectorComponent', () => {
  let component: ClaimItemSelectorComponent;
  let fixture: ComponentFixture<ClaimItemSelectorComponent>;

  const profileClaimService = jasmine.createSpyObj('profileClaimService', {
    search: of({ payload: {page: []}})
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ ClaimItemSelectorComponent ],
      providers: [
        { provide: NgbActiveModal, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ProfileClaimService, useValue: profileClaimService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
//   FIXME: to be completed
});

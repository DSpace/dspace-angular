import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ClaimItemSelectorComponent } from './claim-item-selector.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileClaimService } from '../../../../profile-page/profile-claim/profile-claim.service';
import { of } from 'rxjs';

describe('ClaimItemSelectorComponent', () => {
  let component: ClaimItemSelectorComponent;
  let fixture: ComponentFixture<ClaimItemSelectorComponent>;

  const profileClaimService = jasmine.createSpyObj('profileClaimService', {
    searchForSuggestions: of({ payload: {page: []}})
  });

  beforeEach(waitForAsync(() => {
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

});

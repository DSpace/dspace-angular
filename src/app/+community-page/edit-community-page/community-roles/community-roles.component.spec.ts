import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommunityRolesComponent } from './community-roles.component';
import { Community } from '../../../core/shared/community.model';
import { By } from '@angular/platform-browser';
import { RemoteData } from '../../../core/data/remote-data';

describe('CommunityRolesComponent', () => {

  let fixture: ComponentFixture<CommunityRolesComponent>;
  let comp: CommunityRolesComponent;
  let de: DebugElement;

  beforeEach(() => {

    const route = {
      parent: {
        data: observableOf({
          dso: new RemoteData(
            false,
            false,
            true,
            undefined,
            new Community(),
          )
        })
      }
    };

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        CommunityRolesComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityRolesComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should display a community admin role component', () => {
    expect(de.query(By.css('ds-comcol-role.admin'))).toBeDefined();
  });
});

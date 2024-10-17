import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSubmissionPageComponent } from './share-submission-page.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('ShareSubmissionPageComponent', () => {
  let component: ShareSubmissionPageComponent;
  let fixture: ComponentFixture<ShareSubmissionPageComponent>;
  let activatedRoute;

  beforeEach(async () => {
    activatedRoute = {
      snapshot: {
        queryParams: new Map([
          ['shareToken', 'fake-share-token'],
        ])
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ ShareSubmissionPageComponent ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareSubmissionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

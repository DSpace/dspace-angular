import { ChangeDetectorRef, Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Store } from '@ngrx/store';

import { SectionDirective } from '../section.directive';
import { SectionDataObject } from '../section-data.model';
import { SubmissionState } from '../../submission.reducers';
import { rendersSectionType } from '../section-decorator';
import { SectionType } from '../section-type';

@Component({
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss'],
  /* The element here always has the state "in" when it
   * is present. We animate two transitions: From void
   * to in and from in to void, to achieve an animated
   * enter and leave transition. The element enters from
   * the left and leaves to the right using translateX.
   */
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class SectionContainerComponent implements OnInit {
  @Input() collectionId: string;
  @Input() sectionData: SectionDataObject;
  @Input() store: Store<SubmissionState>;
  @Input() submissionId: string;

  public active = true;
  public objectInjector: Injector;
  public sectionComponentType: SectionType;

  @ViewChild('sectionRef') sectionRef: SectionDirective;

  constructor(private injector: Injector) {
  }

  ngOnInit() {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'collectionIdProvider', useFactory: () => (this.collectionId), deps:[] },
        { provide: 'sectionDataProvider', useFactory: () => (this.sectionData), deps:[] },
        { provide: 'submissionIdProvider', useFactory: () => (this.submissionId), deps:[] },
      ],
      parent: this.injector
    });
  }

  public removeSection(event) {
    event.preventDefault();
    event.stopPropagation();
    this.sectionRef.removeSection(this.submissionId, this.sectionData.id);
  }

  getSectionContent(): string {
    return rendersSectionType(this.sectionComponentType);
  }
}

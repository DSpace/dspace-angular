import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { BoxModel } from '../box.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ds-submission-submit',
  styleUrls: ['./submission-submit-form-box-basic-information.component.scss'],
  templateUrl: './submission-submit-form-box-basic-information.component.html',
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

export class BasicInformationBoxComponent implements  BoxModel {
  @Input() data: any;
  @Input() animations: boolean;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    console.log(this.data);
    this.cd.detectChanges();
  }

  public panelChange(event) {
    console.log(event);
  }
}

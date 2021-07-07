import {ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
@Component({
  selector: 'ds-edit-metadata-security',
  templateUrl: './edit-metadata-security.component.html',
  styleUrls: ['./edit-metadata-security.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class EditMetadataSecurityComponent implements OnInit {

  @Input() securityLevel: number;
  @Input() securityConfigLevel: number;
  @Output() changeSecurityLevel = new EventEmitter<number>()

  constructor() {
  }

  ngOnInit(): void {

  }

  changeSelectedSecurity(number: number) {
    this.changeSecurityLevel.emit(number);
  }

}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {ObjectUpdatesService} from "../../../core/data/object-updates/object-updates.service";
import {Observable} from "rxjs/internal/Observable";
import {FieldUpdates} from "../../../core/data/object-updates/object-updates.reducer";
import {Subject} from "rxjs";

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

  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {

  }

  changeSelectedSecurity(number: number) {
    this.changeSecurityLevel.emit(number);
  }



}

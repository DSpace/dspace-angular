import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../../submission.reducers';
import {BitstreamService} from '../../bitstream/bitstream.service';
import { hasValue } from '../../../../shared/empty.util';

@Component({
  selector: 'ds-submission-submit-form-box-files-edit',
  // styleUrls: ['./files-edit.component.scss'],
  templateUrl: './files-edit.component.html',
})
export class FilesEditComponent {

  @Input() bitstreamId;
  @Input() submissionId;
  public bitstream;
  public readMode = true;

  protected subscriptions = [];

  constructor(private modalService: NgbModal,
              private bitstreamService: BitstreamService,
              protected submissionState: Store<SubmissionState>) { }

  ngOnInit() {
    this.subscriptions.push(
      this.bitstreamService
        .getBitstream(this.submissionId, this.bitstreamId)
        .subscribe((bitstream) => {
                                         this.bitstream = bitstream;
                                        }
        )
    );
  }

  public switchMode(mode:boolean) {
    this.readMode = mode;
  }

  public deleteBitstream() {
    this.bitstreamService.deleteBitstream(this.submissionId, this.bitstreamId);
  }

  public editBitstream() {
    this.switchMode(true);
    const data = Object.assign(
      {},
      this.bitstream,
      {
        title: 'titolo modificato'
      }
    );
    this.bitstreamService.editBitstream(this.submissionId, this.bitstreamId, data);
  }

  public openModal(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.deleteBitstream();
        }
      }
    );
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subscriptions
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}

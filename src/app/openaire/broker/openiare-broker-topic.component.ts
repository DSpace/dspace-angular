import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
// import { SignatureObject } from '../../core/deduplication/models/signature.model';

/**
 * Component to display the deduplication signatures cards.
 */
@Component({
  selector: 'ds-openaire-broker-topic',
  templateUrl: './openaire-broker-topic.component.html',
  styleUrls: ['./openaire-broker-topic.component.scss'],
})
export class OpenaireBrokerTopicComponent implements OnInit {

  /**
   * Initialize the component variables.
   * @param {openaireStateService} openaireStateService
   */
  constructor(
    // private openaireStateService: OpenaireStateService
  ) { }

  /**
   * Component intitialization.
   */
  public ngOnInit(): void {

  }
}

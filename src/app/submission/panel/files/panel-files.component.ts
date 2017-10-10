import { Component } from '@angular/core';
import { PanelModelComponent } from '../panel.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-submission-submit-form-box-files',
  styleUrls: ['./panel-files.component.scss'],
  templateUrl: './panel-files.component.html',
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
export class FilesPanelComponent extends PanelModelComponent {

  public bitstreamsKeys;
  public bitstreamsList;
  public collectionPolicies;
  public collectionName;
  public collectionPoliciesMessageType;

  protected subscriptions = [];

  ngOnInit() {
    // ToRemove
    /*this.bitstreamService.setNewBitstream(
      this.submissionId,
      '10b6a835-ef81-4cff-8acb-020314145b92',
      {
        name: 'File_uno.tif',
        title: 'Titolo file uno',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non scelerisque risus, a aliquet justo. Etiam ac ligula ac sem accumsan molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus turpis diam, aliquam id cursus laoreet, sagittis mollis sem. Fusce nec molestie tortor. Fusce non nisi neque. Etiam vulputate nulla a eros tempus tincidunt. Praesent eget pharetra erat, sed varius enim. Fusce bibendum lacinia rutrum.',
        size: 1245432,
        hash: '197573be473bda8429ad0c89a13b4ddf',
        thumbnail: null,
        policies: [
          {
            type: 1,
            name: 'Open Access',
            date: null,
            availableGroups: []
          }
        ]
      }
    );
    this.bitstreamService.setNewBitstream(
      this.submissionId,
      '20b6a835-ef81-4cff-8acb-020314145b92',
      {
        name: 'File_due.tif',
        title: 'Titolo file due',
        description: 'Aliquam non vestibulum nunc, eget ornare est. Aenean tellus risus, rhoncus eget blandit nec, vulputate ut eros. Cras ullamcorper ac tellus eu laoreet. Donec dapibus urna sit amet condimentum porttitor. Ut a velit vestibulum, elementum ligula in, pellentesque diam. Maecenas eget gravida massa. Fusce et mauris erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam et risus tristique, efficitur magna ut, mattis enim.',
        size: 22454032,
        hash: '297573be473bda8429ad0c89a13b4ddf',
        thumbnail: null,
        policies: [
          {
            type: 2,
            name: 'Institutional network',
            date: null,
            availableGroups: []
          },
          {
            type: 3,
            name: 'Embargo',
            date: '15/10/2018',
            availableGroups: [
              {
                id: 10,
                name: 'Administrators',
                selected: false
              },
              {
                id: 20,
                name: 'Customers',
                selected: true
              },
              {
                id: 30,
                name: 'Other',
                selected: false
              }
            ]
          }
        ]
      },
    );
    this.bitstreamService.setNewBitstream(
      this.submissionId,
      '30b6a835-ef81-4cff-8acb-020314145b92',
      {
        name: 'File_tre.tif',
        title: 'Titolo file tre',
        description: 'Aliquam bibendum vel magna et cursus. Phasellus eu dolor in est lacinia ultrices non et nibh. Maecenas venenatis pellentesque urna faucibus scelerisque. Phasellus eget erat nisl. Phasellus varius erat a leo vulputate lobortis. Quisque eu dui vitae nibh suscipit sollicitudin. Etiam ut congue nibh. Pellentesque aliquet aliquam tellus. Sed in tortor sed neque sodales blandit. Integer vulputate sagittis facilisis. Nunc lobortis bibendum sem vel pretium.',
        size: 5245432,
        hash: '397573be473bda8429ad0c89a13b4ddf',
        thumbnail: null,
        policies: [
          {
            type: 1,
            name: 'Open Access',
            date: null,
            availableGroups: []
          }
        ]
      }
    );*/
    // END
    this.subscriptions.push(
      this.bitstreamService
        .getBitstreamList(this.submissionId)
        .subscribe((bitstreamList) => {
                                             this.bitstreamsList = bitstreamList;
                                             this.bitstreamsKeys = Object.keys(bitstreamList);
                                            }
        )
    );
    this.subscriptions.push(
      this.submissionService
        .getCollectionPolicies(this.submissionId)
        .subscribe((policies) => {
                                         this.collectionPolicies = policies;
                                       }
        )
    );
    this.subscriptions.push(
      this.submissionService
        .getCollectionName(this.submissionId)
        .subscribe((collectionName) => {
            this.collectionName = collectionName;
          }
        )
    );
    this.subscriptions.push(
      this.submissionService
        .getCollectionPoliciesMessageType(this.submissionId)
        .subscribe((collectionPoliciesMessageType) => {
            this.collectionPoliciesMessageType = collectionPoliciesMessageType;
          }
        )
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

import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { SearchResultAdditionalMetadataEntityTypeConfig } from '../../../../../config/search-result-config.interface';
import { environment } from '../../../../../environments/environment';
import { MetadataLinkValue } from '../../../../cris-layout/models/cris-layout-metadata-link-value.model';
import { hasValue, isNotEmpty } from '../../../empty.util';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { ResolverStrategyService } from '../../../../cris-layout/services/resolver-strategy.service';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { AdditionalMetadataConfig } from '../../../../../config/additional-metadata.config';
import { getFirstSucceededRemoteDataPayload, getPaginatedListPayload } from '../../../../core/shared/operators';
import {map, mapTo, take} from 'rxjs/operators';
import {interval, Observable, race} from 'rxjs';
import { VocabularyService } from '../../../../core/submission/vocabularies/vocabulary.service';

interface LinkData {
  href: string,
  text: string,
}

@Component({
  selector: 'ds-additional-metadata',
  templateUrl: './additional-metadata.component.html',
  styleUrls: ['./additional-metadata.component.scss']
})
export class AdditionalMetadataComponent implements OnInit {

  DEFAULT_CONFIG_NAME = 'default';
  dateFormat = 'yyyy-MM-dd';

  @Input() object: Item | DSpaceObject;

  /**
   * A list of additional metadata fields to display
   */
  public additionalMetadataFields: Array<AdditionalMetadataConfig>[];

  constructor(
    protected resolver: ResolverStrategyService,
    protected vocabularyService: VocabularyService,
  ) {
  }

  ngOnInit(): void {

    const entityTypeConfig = environment.searchResult.additionalMetadataFields.filter(
      (field: SearchResultAdditionalMetadataEntityTypeConfig) => field.entityType.toLocaleLowerCase() === (this.object as Item).entityType.toLocaleLowerCase()
    );

    const defaultConfig = environment.searchResult.additionalMetadataFields.filter(
      (field: SearchResultAdditionalMetadataEntityTypeConfig) => field.entityType.toLocaleLowerCase() === this.DEFAULT_CONFIG_NAME
    );

    let unfilteredAdditionalMetadataFields: Array<AdditionalMetadataConfig>[] = [];

    if (entityTypeConfig.length > 0) {
      unfilteredAdditionalMetadataFields = entityTypeConfig[0].metadataConfiguration;
    } else if (defaultConfig.length > 0) {
      unfilteredAdditionalMetadataFields = defaultConfig[0].metadataConfiguration;
    }

    this.additionalMetadataFields = unfilteredAdditionalMetadataFields.map(field => {
      const fields = field?.length ? field : [field];
      return (fields as AdditionalMetadataConfig[]).filter(item =>
        this.object.hasMetadata(item?.name)
      );
    }).filter(field => !!field.length);

  }

  metadataRenderingType(metadata: AdditionalMetadataConfig): string {
    return metadata.rendering.split('.')[0];
  }

  metadataRenderingSubtype(metadata: AdditionalMetadataConfig): string {
    return metadata.rendering.split('.')[1];
  }

  linkData(configuration: AdditionalMetadataConfig, metadataValue: MetadataValue): LinkData {

    const renderingSubtype = this.metadataRenderingSubtype(configuration);
    let linkData = {} as LinkData;

    if (renderingSubtype?.toLocaleLowerCase() === 'email') {
      linkData.href = `mailto:${metadataValue.value}`;
      linkData.text = metadataValue.value;
    } else {
      const startsWithProtocol = [/^https?:\/\//, /^ftp:\/\//];
      linkData.href = startsWithProtocol.some(rx => rx.test(metadataValue.value)) ? metadataValue.value : `http://${metadataValue.value}`;
      linkData.text = metadataValue.value;
    }

    return linkData;
  }

  identifierData(configuration: AdditionalMetadataConfig, metadataValue: MetadataValue): LinkData {
    // TODO needs to be refactored (code from identifier.component.ts)
    const renderingSubtype = this.metadataRenderingSubtype(configuration);
    let linkData: LinkData;
    if (isNotEmpty(renderingSubtype)) {
      linkData = this.composeLink(metadataValue.value, renderingSubtype);
    } else {
      if (this.resolver.checkLink(metadataValue.value)) {
        linkData = {
          href: metadataValue.value,
          text: metadataValue.value
        };
      } else {
        for (const urn of this.resolver.managedUrn) {
          if (hasValue(metadataValue.value) && metadataValue.value.toLowerCase().startsWith(urn)) {
            linkData = this.composeLink(metadataValue.value, urn);
            break;
          }
        }
        if (!linkData) {
          linkData = {
            href: metadataValue.value,
            text: metadataValue.value
          };
        }
      }
    }
    return linkData;
  }

  composeLink(metadataValue: string, urn: string): MetadataLinkValue {
    // TODO needs to be refactored (code from identifier.component.ts)
    let value = metadataValue;
    const rep = urn + ':';
    if (metadataValue.startsWith(rep)) {
      value = metadataValue.replace(rep, '');
    }
    const shouldKeepWhiteSpaces = environment.crisLayout
      .urn?.find((urnConfig) => urnConfig.name === urn)?.shouldKeepWhiteSpaces;
    const href = this.resolver.getBaseUrl(urn) + (shouldKeepWhiteSpaces ? value : value.replace(/\s/g, ''));
    const text = isNotEmpty(value) && value !== '' ? value : href;
    return {
      href,
      text
    };
  }

  valuepairData(metadataValue: MetadataValue, vocabularyName: string): Observable<string> {

    const authority = metadataValue.authority ? metadataValue.authority.split(':') : undefined;
    const isControlledVocabulary = authority?.length > 1 && authority[0] === vocabularyName;
    const value = isControlledVocabulary ? authority[1] : metadataValue.value;

    const entry$ = this.vocabularyService.getPublicVocabularyEntryByValue(vocabularyName, value).pipe(
      getFirstSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      map((res) => res[0]?.display ?? metadataValue.value),
    );

    // fallback values to be shown if the display value cannot be retrieved
    const initValue$ = interval(1000).pipe(mapTo(metadataValue.value));

    return race([entry$, initValue$]).pipe(
      take(1)
    );

  }

  currentRoleData(object: Item | DSpaceObject) {
    const currentAffiliation = object.firstMetadataValue('person.affiliation.name');
    const allAffiliations = object.allMetadataValues('oairecerif.person.affiliation');
    const allRoles = object.allMetadataValues('oairecerif.affiliation.role');

    const lastIndexOfCurrentAffiliation = allAffiliations.lastIndexOf(currentAffiliation);

    if (lastIndexOfCurrentAffiliation !== -1) {
      return allRoles[lastIndexOfCurrentAffiliation];
    }
  }

  lastRoleData(object: Item | DSpaceObject) {
    const currentAffiliation = object.firstMetadataValue('person.affiliation.name');
    const allAffiliations = object.allMetadataValues('oairecerif.person.affiliation');
    const allRoles = object.allMetadataValues('oairecerif.affiliation.role');

    const lastIndexOfCurrentAffiliation = allAffiliations.lastIndexOf(currentAffiliation);

    if (lastIndexOfCurrentAffiliation !== -1) {
      return allRoles[lastIndexOfCurrentAffiliation - 1];
    } else {
      return allRoles[allRoles.length - 1];
    }
  }
}

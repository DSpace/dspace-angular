import { Injectable, Injector } from '@angular/core';
import { hasNoValue, isNotEmpty } from '../../../shared/empty.util';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { GenericConstructor } from '../../shared/generic-constructor';
import { HALResource } from '../../shared/hal-resource.model';
import { getDataServiceFor, getLinkDefinition, getLinkDefinitions, LinkDefinition } from './build-decorators';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(
    protected parentInjector: Injector,
  ) {
  }

  public resolveLink<T extends HALResource>(model, linkToFollow: FollowLinkConfig<T>) {
    const matchingLinkDef = getLinkDefinition(model.constructor, linkToFollow.name);

    if (hasNoValue(matchingLinkDef)) {
      throw new Error(`followLink('${linkToFollow.name}') was used for a ${model.constructor.name}, but there is no property on ${model.constructor.name} models with an @link() for ${linkToFollow.name}`);
    } else {
      const provider = getDataServiceFor(matchingLinkDef.resourceType);

      if (hasNoValue(provider)) {
        throw new Error(`The @link() for ${linkToFollow.name} on ${model.constructor.name} models uses the resource type ${matchingLinkDef.resourceType.value.toUpperCase()}, but there is no service with an @dataService(${matchingLinkDef.resourceType.value.toUpperCase()}) annotation in order to retrieve it`);
      }

      const service = Injector.create({
        providers: [],
        parent: this.parentInjector
      }).get(provider);

      const href = model._links[matchingLinkDef.linkName].href;

      if (matchingLinkDef.isList) {
        model[linkToFollow.name] =  service.findAllByHref(href, linkToFollow.findListOptions, ...linkToFollow.linksToFollow);
      } else {
        model[linkToFollow.name] =  service.findByHref(href, ...linkToFollow.linksToFollow);
      }
    }
  }

  /**
   * Remove any resolved links that the model may have.
   */
  public removeResolvedLinks<T extends HALResource>(model: T) {
    const linkDefs = getLinkDefinitions(model.constructor as GenericConstructor<T>);
    if (isNotEmpty(linkDefs)) {
      linkDefs.forEach((linkDef: LinkDefinition<T>) => {
        model[linkDef.propertyName] = undefined;
      });
    }
  }

}

import { DecoratorConfig } from '../../scripts/config/decorator-config.interface';

/**
 * This list contains the dynamic components decorator configuration that will be used to generate the registry files
 * in `src/decorator-registries`.
 *
 * If you want to create a new decorator, you need to extend this list and add your custom decorator to it. Afterwards
 * a registry file will be generated inside the `src/decorator-registries` folder, which exports the Map that you can
 * then use this inside your decorator file to dynamically retrieve the desired component.
 */
export const DECORATORS: DecoratorConfig[] = [
  {
    name: 'dataService',
    params: [
      { name: 'resourceType', property: 'value' },
    ],
  },
  {
    name: 'listableObjectComponent',
    params: [
      { name: 'objectType' },
      { name: 'viewMode' },
      { name: 'context', default: '*' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'renderFacetFor',
    params: [
      { name: 'type' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'rendersBrowseBy',
    params: [
      { name: 'browseByType', default: 'text' },
      { name: 'context', default: '*' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'editMetadataValueFieldComponent',
    params: [
      { name: 'type', default: 'PLAIN_TEXT' },
      { name: 'context', default: '*' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'renderSearchLabelFor',
    params: [
      { name: 'operator', default: '*' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'renderStartsWithFor',
    params: [
      { name: 'type' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'rendersAdvancedWorkflowTaskOption',
    params: [
      { name: 'option' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'rendersWorkflowTaskOption',
    params: [
      { name: 'option' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'metadataRepresentationComponent',
    params: [
      { name: 'entityType', default: 'Publication' },
      { name: 'mdRepresentationType', default: 'plain_text' },
      { name: 'context', default: '*' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'tabulatableObjectsComponent',
    params: [
      { name: 'objectsType' },
      { name: 'viewMode' },
      { name: 'context', default: '*' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'searchResultFor',
    params: [
      { name: 'domainConstructor' },
    ],
  },
  {
    name: 'rendersMenuItemForType',
    params: [
      { name: 'type' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'rendersSectionForMenu',
    params: [
      { name: 'menuID' },
      { name: 'expandable' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'renderAuthMethodFor',
    params: [
      { name: 'authMethodType' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'renderExternalLoginConfirmationFor',
    params: [
      { name: 'authRegistrationType' },
      { name: 'theme', default: '*' },
    ],
  },
  {
    name: 'renderSectionFor',
    params: [
      { name: 'sectionType' },
      { name: 'theme', default: '*' },
    ],
  },
];

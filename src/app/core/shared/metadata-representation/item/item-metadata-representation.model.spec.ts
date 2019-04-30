import { MetadataRepresentationType } from '../metadata-representation.model';
import { ItemMetadataRepresentation, ItemTypeToValue } from './item-metadata-representation.model';
import { Item } from '../../item.model';
import { MetadataMap, MetadataValue } from '../../metadata.models';

describe('ItemMetadataRepresentation', () => {
  const valuePrefix = 'Test value for ';
  const item = new Item();
  let itemMetadataRepresentation: ItemMetadataRepresentation;
  const metadataMap = new MetadataMap();
  for (const key of Object.keys(ItemTypeToValue)) {
    metadataMap[ItemTypeToValue[key]] = [Object.assign(new MetadataValue(), {
      value: `${valuePrefix}${ItemTypeToValue[key]}`
    })];
  }
  item.metadata = metadataMap;

  for (const itemType of Object.keys(ItemTypeToValue)) {
    describe(`when creating an ItemMetadataRepresentation`, () => {
      beforeEach(() => {
        item.metadata['relationship.type'] = [
          Object.assign(new MetadataValue(), {
            value: itemType
          })
        ];

        itemMetadataRepresentation = Object.assign(new ItemMetadataRepresentation(), item);
      });

      it('should have a representation type of item', () => {
        expect(itemMetadataRepresentation.representationType).toEqual(MetadataRepresentationType.Item);
      });

      it('should return the correct value when calling getValue', () => {
        expect(itemMetadataRepresentation.getValue()).toEqual(`${valuePrefix}${ItemTypeToValue[itemType]}`);
      });

      it('should return the correct item type', () => {
        expect(itemMetadataRepresentation.itemType).toEqual(item.firstMetadataValue('relationship.type'));
      });
    });
  }
});

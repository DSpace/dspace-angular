import { excludeFromEquals, fieldsForEquals } from './equals.decorators';
import { EquatableObject } from './equatable';
import { cloneDeep } from 'lodash';

class Dog extends EquatableObject<Dog> {
  public name: string;

  @excludeFromEquals
  public ballsCaught: number;

  @fieldsForEquals('name', 'age')
  public owner: {
    name: string;
    age: number;
    favouriteFood: string;
  }
}

fdescribe('equatable', () => {
  let dogRoger: Dog;
  let dogMissy: Dog;

  beforeEach(() => {
    dogRoger = new Dog();
    dogRoger.name = 'Roger';
    dogRoger.ballsCaught = 6;
    dogRoger.owner = { name: 'Tommy', age: 16, favouriteFood: 'spaghetti' };

    dogMissy = new Dog();
    dogMissy.name = 'Missy';
    dogMissy.ballsCaught = 9;
    dogMissy.owner = { name: 'Jenny', age: 29, favouriteFood: 'pizza' };
  });

  it('should return false when the other object is undefined', () => {
    const isEqual = dogRoger.equals(undefined);
    expect(isEqual).toBe(false);
  });

  it('should return true when the other object is the exact same object', () => {
    const isEqual = dogRoger.equals(dogRoger);
    expect(isEqual).toBe(true);
  });

  it('should return true when the other object is an exact copy of the first one', () => {
    const copyOfDogRoger = cloneDeep(dogRoger);
    const isEqual = dogRoger.equals(copyOfDogRoger);
    expect(isEqual).toBe(true);
  });

  it('should return false when the other object differs in all fields', () => {
    const isEqual = dogRoger.equals(dogMissy);
    expect(isEqual).toBe(false);
  });

  it('should return true when the other object only differs in fields that are marked as excludeFromEquals', () => {
    const copyOfDogRoger = cloneDeep(dogRoger);
    copyOfDogRoger.ballsCaught = 4;
    const isEqual = dogRoger.equals(copyOfDogRoger);
    expect(isEqual).toBe(true);
  });

  it('should return false when the other object differs in fields that are not marked as excludeFromEquals', () => {
    const copyOfDogRoger = cloneDeep(dogRoger);
    copyOfDogRoger.name = 'Elliot';
    const isEqual = dogRoger.equals(copyOfDogRoger);
    expect(isEqual).toBe(false);
  });
});


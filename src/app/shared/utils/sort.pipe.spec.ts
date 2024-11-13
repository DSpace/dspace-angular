import { SortPipe } from './sort.pipe';

describe('SortPipe', () => {
  let pipe: SortPipe;

  beforeEach(() => {
    pipe = new SortPipe();
  });

  it('should return the original value if value is null or undefined', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('should return the original value if no order is invalid', () => {
    const inputArray = [3, 1, 2];
    expect(pipe.transform(inputArray, '', null)).toEqual(inputArray);
  });

  it('should sort the array in ascending order if no column is provided', () => {
    const inputArray = [3, 1, 2];
    const sortedArray = [1, 2, 3];
    expect(pipe.transform(inputArray, '')).toEqual(sortedArray);
  });

  it('should sort the array in descending order if no column is provided and order is desc', () => {
    const inputArray = [3, 1, 2];
    const sortedArray = [3, 2, 1];
    expect(pipe.transform(inputArray, '', 'desc')).toEqual(sortedArray);
  });

  it('should return the original array if it contains one or fewer elements', () => {
    const inputArray = [1];
    expect(pipe.transform(inputArray)).toEqual(inputArray);
    expect(pipe.transform([])).toEqual([]);
  });

  it('should sort the array by a specific column in ascending order', () => {
    const inputArray = [
      { label: 'banana' },
      { label: 'apple' },
      { label: 'cherry' }
    ];
    const sortedArray = [
      { label: 'apple' },
      { label: 'banana' },
      { label: 'cherry' }
    ];
    expect(pipe.transform(inputArray, 'label')).toEqual(sortedArray);
  });

  it('should sort the array by a specific column in descending order', () => {
    const inputArray = [
      { label: 'banana' },
      { label: 'apple' },
      { label: 'cherry' }
    ];
    const sortedArray = [
      { label: 'cherry' },
      { label: 'banana' },
      { label: 'apple' }
    ];
    expect(pipe.transform(inputArray, 'label', 'desc')).toEqual(sortedArray);
  });
});

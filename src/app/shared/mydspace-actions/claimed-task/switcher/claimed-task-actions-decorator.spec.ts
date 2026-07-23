/* eslint-disable max-classes-per-file */
import { Component } from '@angular/core';

import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { DEFAULT_THEME } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ClaimedTaskType } from '../claimed-task-type';
import { getComponentByWorkflowTaskOption } from './claimed-task-actions-decorator';

describe('ClaimedTaskActions decorator function', () => {
  const option1 = 'test_option_1' as ClaimedTaskType;
  const option2 = 'test_option_2' as ClaimedTaskType;
  const option3 = 'test_option_3' as ClaimedTaskType;

  class Test1Action {
  }

  class Test2Action {
  }

  class Test3Action {
  }

  /* eslint-enable max-classes-per-file */

  let rendersWorkflowTaskOptionComponentRegistry: Map<string, Map<string, () => Promise<GenericConstructor<Component>>>>;

  beforeAll(() => {
    rendersWorkflowTaskOptionComponentRegistry = new Map();

    rendersWorkflowTaskOptionComponentRegistry.set(option1, new Map());
    rendersWorkflowTaskOptionComponentRegistry.get(option1).set(DEFAULT_THEME, () => Promise.resolve(Test1Action));
    rendersWorkflowTaskOptionComponentRegistry.set(option2, new Map());
    rendersWorkflowTaskOptionComponentRegistry.get(option2).set(DEFAULT_THEME, () => Promise.resolve(Test2Action));
    rendersWorkflowTaskOptionComponentRegistry.set(option3, new Map());
    rendersWorkflowTaskOptionComponentRegistry.get(option3).set(DEFAULT_THEME, () => Promise.resolve(Test3Action));
  });

  describe('If there\'s an exact match', () => {
    it('should return the matching class', async () => {
      const component = await getComponentByWorkflowTaskOption(option1, undefined, rendersWorkflowTaskOptionComponentRegistry);
      expect(component).toEqual(Test1Action as any);

      const component2 = await getComponentByWorkflowTaskOption(option2, undefined, rendersWorkflowTaskOptionComponentRegistry);
      expect(component2).toEqual(Test2Action as any);

      const component3 = await getComponentByWorkflowTaskOption(option3, undefined, rendersWorkflowTaskOptionComponentRegistry);
      expect(component3).toEqual(Test3Action as any);
    });
  });

  describe('If there\'s no match', () => {
    it('should return unidentified', () => {
      const component = getComponentByWorkflowTaskOption('non-existing-option' as ClaimedTaskType, undefined, rendersWorkflowTaskOptionComponentRegistry);
      expect(component).toBeUndefined();
    });
  });
});

[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/themed-component-usages`
_______

Themeable components should be used via their `ThemedComponent` wrapper class

This ensures that custom themes can correctly override _all_ instances of this component.
There are a few exceptions where the base class can still be used:
- Class declaration expressions (otherwise we can't declare, extend or override the class in the first place)
- Angular modules (except for routing modules)
- Angular `@ViewChild` decorators
- Type annotations
      

_______

[Source code](../../../../lint/src/rules/ts/themed-component-usages.ts)



### Examples


#### Valid code
    
##### allow wrapper class usages
        
```typescript
import { ThemedTestThemeableComponent } from './app/test/themed-test-themeable.component';

const config = {
  a: ThemedTestThemeableComponent,
  b: ChipsComponent,
}
```
        
    
##### allow base class in class declaration
        
```typescript
export class TestThemeableComponent {
}
```
        
    
##### allow inheriting from base class
        
```typescript
import { TestThemeableComponent } from './app/test/test-themeable.component';

export class ThemedAdminSidebarComponent extends ThemedComponent<TestThemeableComponent> {
}
```
        
    
##### allow base class in ViewChild
        
```typescript
import { TestThemeableComponent } from './app/test/test-themeable.component';

export class Something {
  @ViewChild(TestThemeableComponent) test: TestThemeableComponent;
}
```
        
    
##### allow wrapper selectors in test queries
        
Filename: `lint/test/fixture/src/app/test/test.component.spec.ts`
        
```typescript
By.css('ds-themeable');
By.css('#test > ds-themeable > #nest');
```
        
    
##### allow wrapper selectors in cypress queries
        
Filename: `lint/test/fixture/src/app/test/test.component.cy.ts`
        
```typescript
By.css('ds-themeable');
By.css('#test > ds-themeable > #nest');
```
        
    



#### Invalid code  &amp; automatic fixes
    
##### disallow direct usages of base class
        
```typescript
import { TestThemeableComponent } from './app/test/test-themeable.component';
import { TestComponent } from './app/test/test.component';

const config = {
  a: TestThemeableComponent,
  b: TestComponent,
}

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
import { ThemedTestThemeableComponent } from './app/test/themed-test-themeable.component';
import { TestComponent } from './app/test/test.component';

const config = {
  a: ThemedTestThemeableComponent,
  b: TestComponent,
}
```
        
    
##### disallow direct usages of base class, keep other imports
        
```typescript
import { Something, TestThemeableComponent } from './app/test/test-themeable.component';
import { TestComponent } from './app/test/test.component';

const config = {
  a: TestThemeableComponent,
  b: TestComponent,
  c: Something,
}

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
import { Something } from './app/test/test-themeable.component';
import { ThemedTestThemeableComponent } from './app/test/themed-test-themeable.component';
import { TestComponent } from './app/test/test.component';

const config = {
  a: ThemedTestThemeableComponent,
  b: TestComponent,
  c: Something,
}
```
        
    
##### handle array replacements correctly
        
```typescript
const DECLARATIONS = [
  Something,
  TestThemeableComponent,
  Something,
  ThemedTestThemeableComponent,
];

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
const DECLARATIONS = [
  Something,
  Something,
  ThemedTestThemeableComponent,
];
```
        
    
##### disallow override selector in test queries
        
Filename: `lint/test/fixture/src/app/test/test.component.spec.ts`
        
```typescript
By.css('ds-themed-themeable');
By.css('#test > ds-themed-themeable > #nest');

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
By.css('ds-themeable');
By.css('#test > ds-themeable > #nest');
```
        
    
##### disallow base selector in test queries
        
Filename: `lint/test/fixture/src/app/test/test.component.spec.ts`
        
```typescript
By.css('ds-base-themeable');
By.css('#test > ds-base-themeable > #nest');

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
By.css('ds-themeable');
By.css('#test > ds-themeable > #nest');
```
        
    
##### disallow override selector in cypress queries
        
Filename: `lint/test/fixture/src/app/test/test.component.cy.ts`
        
```typescript
cy.get('ds-themed-themeable');
cy.get('#test > ds-themed-themeable > #nest');

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
cy.get('ds-themeable');
cy.get('#test > ds-themeable > #nest');
```
        
    
##### disallow base selector in cypress queries
        
Filename: `lint/test/fixture/src/app/test/test.component.cy.ts`
        
```typescript
cy.get('ds-base-themeable');
cy.get('#test > ds-base-themeable > #nest');

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
cy.get('ds-themeable');
cy.get('#test > ds-themeable > #nest');
```
        
    
##### edge case: unable to find usage node through usage token, but import is still flagged and fixed
        
Filename: `lint/test/fixture/src/themes/test/app/test/other-themeable.component.ts`
        
```typescript
import { Component } from '@angular/core';

import { Context } from './app/core/shared/context.model';
import { TestThemeableComponent } from '../../../../app/test/test-themeable.component';

@Component({
  standalone: true,
  imports: [TestThemeableComponent],
})
export class UsageComponent {
}

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
import { Component } from '@angular/core';

import { Context } from './app/core/shared/context.model';
import { ThemedTestThemeableComponent } from '../../../../app/test/themed-test-themeable.component';

@Component({
  standalone: true,
  imports: [ThemedTestThemeableComponent],
})
export class UsageComponent {
}
```
        
    
##### edge case edge case: both are imported, only wrapper is retained
        
Filename: `lint/test/fixture/src/themes/test/app/test/other-themeable.component.ts`
        
```typescript
import { Component } from '@angular/core';

import { Context } from './app/core/shared/context.model';
import { TestThemeableComponent } from '../../../../app/test/test-themeable.component';
import { ThemedTestThemeableComponent } from '../../../../app/test/themed-test-themeable.component';

@Component({
  standalone: true,
  imports: [TestThemeableComponent, ThemedTestThemeableComponent],
})
export class UsageComponent {
}

        

```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper
Themeable components should be used via their ThemedComponent wrapper
```
        
Result of `yarn lint --fix`:
```typescript
import { Component } from '@angular/core';

import { Context } from './app/core/shared/context.model';
import { ThemedTestThemeableComponent } from '../../../../app/test/themed-test-themeable.component';

@Component({
  standalone: true,
  imports: [ThemedTestThemeableComponent],
})
export class UsageComponent {
}
```
        
    


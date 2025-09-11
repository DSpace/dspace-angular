[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/themed-component-classes`
_______

Formatting rules for themeable component classes

- All themeable components must be standalone.
- The base component must always be imported in the `ThemedComponent` wrapper. This ensures that it is always sufficient to import just the wrapper whenever we use the component.
      

_______

[Source code](../../../../lint/src/rules/ts/themed-component-classes.ts)



### Examples


#### Valid code
    
##### Regular non-themeable component
        
```typescript
@Component({
  selector: 'ds-something',
  standalone: true,
})
class Something {
}
```
        
    
##### Base component
        
```typescript
@Component({
  selector: 'ds-base-test-themable',
  standalone: true,
})
class TestThemeableComponent {
}
```
        
    
##### Wrapper component
        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```typescript
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    TestThemeableComponent,
  ],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```
        
    
##### Override component
        
Filename: `lint/test/fixture/src/themes/test/app/test/test-themeable.component.ts`
        
```typescript
@Component({
  selector: 'ds-themed-test-themable',
  standalone: true,
})
class Override extends BaseComponent {
}
```
        
    



#### Invalid code  &amp; automatic fixes
    
##### Base component must be standalone
        
```typescript
@Component({
  selector: 'ds-base-test-themable',
})
class TestThemeableComponent {
}

        

```
Will produce the following error(s):
```
Themeable components must be standalone
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-base-test-themable',
  standalone: true,
})
class TestThemeableComponent {
}
```
        
    
##### Wrapper component must be standalone and import base component
        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```typescript
@Component({
  selector: 'ds-test-themable',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}

        

```
Will produce the following error(s):
```
Themeable component wrapper classes must be standalone and import the base class
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [TestThemeableComponent],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```
        
    
##### Wrapper component must import base component (array present but empty)
        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```typescript
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}

        

```
Will produce the following error(s):
```
Themed component wrapper classes must only import the base class
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [TestThemeableComponent],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```
        
    
##### Wrapper component must import base component (array is wrong)
        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```typescript
import { SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    SomethingElse,
  ],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}

        

```
Will produce the following error(s):
```
Themed component wrapper classes must only import the base class
```
        
Result of `yarn lint --fix`:
```typescript
import { SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [TestThemeableComponent],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```
        
    
##### Wrapper component must import base component (array is wrong)
        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```typescript
import { Something, SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    SomethingElse,
  ],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}

        

```
Will produce the following error(s):
```
Themed component wrapper classes must only import the base class
```
        
Result of `yarn lint --fix`:
```typescript
import { Something, SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [TestThemeableComponent],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```
        
    
##### Override component must be standalone
        
Filename: `lint/test/fixture/src/themes/test/app/test/test-themeable.component.ts`
        
```typescript
@Component({
  selector: 'ds-themed-test-themable',
})
class Override extends BaseComponent {
}

        

```
Will produce the following error(s):
```
Themeable components must be standalone
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-themed-test-themable',
  standalone: true,
})
class Override extends BaseComponent {
}
```
        
    


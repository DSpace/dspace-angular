[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/themed-component-selectors`
_______

Themeable component selectors should follow the DSpace convention

Each themeable component is comprised of a base component, a wrapper component and any number of themed components
- Base components should have a selector starting with `ds-base-`
- Themed components should have a selector starting with `ds-themed-`
- Wrapper components should have a selector starting with `ds-`, but not `ds-base-` or `ds-themed-`
  - This is the regular DSpace selector prefix
  - **When making a regular component themeable, its selector prefix should be changed to `ds-base-`, and the new wrapper's component should reuse the previous selector**

Unit tests are exempt from this rule, because they may redefine components using the same class name as other themeable components elsewhere in the source.
      

_______

[Source code](../../../../lint/src/rules/ts/themed-component-selectors.ts)



### Examples


#### Valid code
    
##### Regular non-themeable component selector
        
```typescript
@Component({
  selector: 'ds-something',
})
class Something {
}
```
        
    
##### Themeable component selector should replace the original version, unthemed version should be changed to ds-base-
        
```typescript
@Component({
  selector: 'ds-base-something',
})
class Something {
}

@Component({
  selector: 'ds-something',
})
class ThemedSomething extends ThemedComponent<Something> {
}

@Component({
  selector: 'ds-themed-something',
})
class OverrideSomething extends Something {
}
```
        
    
##### Other themed component wrappers should not interfere
        
```typescript
@Component({
  selector: 'ds-something',
})
class Something {
}

@Component({
  selector: 'ds-something-else',
})
class ThemedSomethingElse extends ThemedComponent<SomethingElse> {
}
```
        
    



#### Invalid code  &amp; automatic fixes
    
##### Wrong selector for base component
        
Filename: `lint/test/fixture/src/app/test/test-themeable.component.ts`
        
```typescript
@Component({
  selector: 'ds-something',
})
class TestThemeableComponent {
}

        

```
Will produce the following error(s):
```
Unthemed version of themeable component should have a selector starting with 'ds-base-'
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-base-something',
})
class TestThemeableComponent {
}
```
        
    
##### Wrong selector for wrapper component
        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```typescript
@Component({
  selector: 'ds-themed-something',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}

        

```
Will produce the following error(s):
```
Themed component wrapper of themeable component shouldn't have a selector starting with 'ds-themed-'
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-something',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```
        
    
##### Wrong selector for theme override
        
Filename: `lint/test/fixture/src/themes/test/app/test/test-themeable.component.ts`
        
```typescript
@Component({
  selector: 'ds-something',
})
class TestThememeableComponent extends BaseComponent {
}

        

```
Will produce the following error(s):
```
Theme override of themeable component should have a selector starting with 'ds-themed-'
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-themed-something',
})
class TestThememeableComponent extends BaseComponent {
}
```
        
    


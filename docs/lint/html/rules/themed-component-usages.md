[DSpace ESLint plugins](../../../../lint/README.md) > [HTML rules](../index.md) > `dspace-angular-html/themed-component-usages`
_______

Themeable components should be used via the selector of their `ThemedComponent` wrapper class

This ensures that custom themes can correctly override _all_ instances of this component.
The only exception to this rule are unit tests, where we may want to use the base component in order to keep the test setup simple.
      

_______

[Source code](../../../../lint/src/rules/html/themed-component-usages.ts)

### Examples


#### Valid code
    
##### use no-prefix selectors in HTML templates
        
```html
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
```
    
##### use no-prefix selectors in TypeScript templates
        
```html
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
```
    
##### use no-prefix selectors in TypeScript test templates
        
Filename: `lint/test/fixture/src/test.spec.ts`
        
```html
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
```
    
##### base selectors are also allowed in TypeScript test templates
        
Filename: `lint/test/fixture/src/test.spec.ts`
        
```html
@Component({
  template: '<ds-base-test-themeable></ds-base-test-themeable>'
})
class Test {
}
```
    



#### Invalid code  &amp; automatic fixes
    
##### themed override selectors are not allowed in HTML templates
        
```html
<ds-themed-test-themeable/>
<ds-themed-test-themeable></ds-themed-test-themeable>
<ds-themed-test-themeable [test]="something"></ds-themed-test-themeable>
```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper's selector
Themeable components should be used via their ThemedComponent wrapper's selector
Themeable components should be used via their ThemedComponent wrapper's selector
```
        
Result of `yarn lint --fix`:
```html
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
```
        
    
##### base selectors are not allowed in HTML templates
        
```html
<ds-base-test-themeable/>
<ds-base-test-themeable></ds-base-test-themeable>
<ds-base-test-themeable [test]="something"></ds-base-test-themeable>
```
Will produce the following error(s):
```
Themeable components should be used via their ThemedComponent wrapper's selector
Themeable components should be used via their ThemedComponent wrapper's selector
Themeable components should be used via their ThemedComponent wrapper's selector
```
        
Result of `yarn lint --fix`:
```html
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
```
        
    


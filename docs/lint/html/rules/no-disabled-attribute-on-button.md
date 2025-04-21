[DSpace ESLint plugins](../../../../lint/README.md) > [HTML rules](../index.md) > `dspace-angular-html/no-disabled-attribute-on-button`
_______

Buttons should use the `dsBtnDisabled` directive instead of the HTML `disabled` attribute.
      This should be done to ensure that users with a screen reader are able to understand that the a button button is present, and that it is disabled.
      The native html disabled attribute does not allow users to navigate to the button by keyboard, and thus they have no way of knowing that the button is present.

_______

[Source code](../../../../lint/src/rules/html/no-disabled-attribute-on-button.ts)



### Examples


#### Valid code
    
##### should use [dsBtnDisabled] in HTML templates
        
```html
<button [dsBtnDisabled]="true">Submit</button>
```
        
    
##### disabled attribute is still valid on non-button elements
        
```html
<input disabled>
```
        
    
##### [disabled] attribute is still valid on non-button elements
        
```html
<input [disabled]="true">
```
        
    
##### angular dynamic attributes that use disabled are still valid
        
```html
<button [class.disabled]="isDisabled">Submit</button>
```
        
    



#### Invalid code  &amp; automatic fixes
    
##### should not use disabled attribute in HTML templates
        
```html
<button disabled>Submit</button>

        

```
Will produce the following error(s):
```
Buttons should use the `dsBtnDisabled` directive instead of the `disabled` attribute.
```
        
Result of `yarn lint --fix`:
```html
<button [dsBtnDisabled]="true">Submit</button>
```
        
    
##### should not use [disabled] attribute in HTML templates
        
```html
<button [disabled]="true">Submit</button>

        

```
Will produce the following error(s):
```
Buttons should use the `dsBtnDisabled` directive instead of the `disabled` attribute.
```
        
Result of `yarn lint --fix`:
```html
<button [dsBtnDisabled]="true">Submit</button>
```
        
    


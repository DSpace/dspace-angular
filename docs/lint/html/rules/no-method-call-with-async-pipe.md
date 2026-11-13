[DSpace ESLint plugins](../../../../lint/README.md) > [HTML rules](../index.md) > `dspace-angular-html/no-method-call-with-async-pipe`
_______

Don't call a method directly as the input of the `async` pipe (e.g. `getFoo$() | async`).

This re-executes the method - and the RxJS pipeline it returns - on every change detection cycle, which often leads to performance issues.

Instead:
- Subscribe to the Observable in `ngOnInit()`
- Push emitted values into a `BehaviorSubject`
- Bind `| async` to that `BehaviorSubject` in the template
- Unsubscribe in `ngOnDestroy()`
      

_______

[Source code](../../../../lint/src/rules/html/no-method-call-with-async-pipe.ts)



### Examples


#### Valid code
    
##### binding the async pipe to a property is still valid
        
```html
<span>{{ foo$ | async }}</span>
```
        
    
##### calling a method without piping the result through async is still valid
        
```html
<span>{{ getFoo() }}</span>
```
        
    
##### piping a property through an unrelated pipe is still valid
        
```html
<span>{{ foo$ | someOtherPipe }}</span>
```
        
    
##### binding the async pipe to a property accessed through a member expression is still valid
        
```html
<span>{{ (foo$ | async)?.length }}</span>
```
        
    



#### Invalid code 
    
##### should not call a method as the direct input of the async pipe
        
```html
<span>{{ getFoo$() | async }}</span>

        

```
Will produce the following error(s):
```
Don't call '{{ methodName }}' directly in the template as the input of the async pipe; subscribe in ngOnInit(), push values into a BehaviorSubject, and bind `| async` to that instead.
```
        
    
##### should not call a method with arguments as the direct input of the async pipe
        
```html
<span>{{ getFoo$(id) | async }}</span>

        

```
Will produce the following error(s):
```
Don't call '{{ methodName }}' directly in the template as the input of the async pipe; subscribe in ngOnInit(), push values into a BehaviorSubject, and bind `| async` to that instead.
```
        
    
##### should not use the safe-call variant as the direct input of the async pipe
        
```html
<span>{{ getFoo$?.() | async }}</span>

        

```
Will produce the following error(s):
```
Don't call '{{ methodName }}' directly in the template as the input of the async pipe; subscribe in ngOnInit(), push values into a BehaviorSubject, and bind `| async` to that instead.
```
        
    
##### should not call a method as the direct input of the async pipe in the *ngIf microsyntax
        
```html
<div *ngIf="getFoo$() | async as foo">{{ foo }}</div>

        

```
Will produce the following error(s):
```
Don't call '{{ methodName }}' directly in the template as the input of the async pipe; subscribe in ngOnInit(), push values into a BehaviorSubject, and bind `| async` to that instead.
```
        
    
##### should not call a method as the direct input of the async pipe in an @if condition, even when wrapped in a member access
        
```html
@if ((getFoo$() | async)?.length > 0) {
  <span>hi</span>
}

        

```
Will produce the following error(s):
```
Don't call '{{ methodName }}' directly in the template as the input of the async pipe; subscribe in ngOnInit(), push values into a BehaviorSubject, and bind `| async` to that instead.
```
        
    
##### should not call a method as the direct input of the async pipe in an @for expression
        
```html
@for (item of getFoo$() | async; track item) {
  <span>{{ item }}</span>
}

        

```
Will produce the following error(s):
```
Don't call '{{ methodName }}' directly in the template as the input of the async pipe; subscribe in ngOnInit(), push values into a BehaviorSubject, and bind `| async` to that instead.
```
        
    
##### should not call a method as the direct input of the async pipe inside an object literal binding
        
```html
<div [ngClass]="{'active': (getFoo$() | async)?.length > 0}"></div>

        

```
Will produce the following error(s):
```
Don't call '{{ methodName }}' directly in the template as the input of the async pipe; subscribe in ngOnInit(), push values into a BehaviorSubject, and bind `| async` to that instead.
```
        
    


[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/themed-decorators`
_______

Entry components with theme support should declare the correct theme

_______

[Source code](../../../../lint/src/rules/ts/themed-decorators.ts)


### Options

#### `decorators`

A mapping for all the existing themeable decorators, with the decorator name as the key and the index of the `theme` argument as the value.


### Examples


#### Valid code
    
##### theme file declares the correct theme in @listableObjectComponent
        
Filename: `lint/test/fixture/src/themes/test/app/dynamic-component/dynamic-component.ts`
        
```typescript
@listableObjectComponent(something, somethingElse, undefined, 'test')
export class Something extends SomethingElse {
}
```
        
    
##### plain file declares no theme in @listableObjectComponent
        
Filename: `lint/test/fixture/src/app/dynamic-component/dynamic-component.ts`
        
```typescript
@listableObjectComponent(something, somethingElse, undefined)
export class Something extends SomethingElse {
}
```
        
    
##### plain file declares explicit undefined theme in @listableObjectComponent
        
Filename: `lint/test/fixture/src/app/dynamic-component/dynamic-component.ts`
        
```typescript
@listableObjectComponent(something, somethingElse, undefined, undefined)
export class Something extends SomethingElse {
}
```
        
    
##### test file declares theme outside of theme directory
        
Filename: `lint/test/fixture/src/app/dynamic-component/dynamic-component.spec.ts`
        
```typescript
@listableObjectComponent(something, somethingElse, undefined, 'test')
export class Something extends SomethingElse {
}
```
        
    
##### only track configured decorators
        
Filename: `lint/test/fixture/src/app/dynamic-component/dynamic-component.ts`
        
```typescript
@something('test')
export class Something extends SomethingElse {
}
```
        
    



#### Invalid code  &amp; automatic fixes
    
##### theme file declares the wrong theme in @listableObjectComponent
        
Filename: `lint/test/fixture/src/themes/test/app/dynamic-component/dynamic-component.ts`
        
```typescript
@listableObjectComponent(something, somethingElse, undefined, 'test-2')
export class Something extends SomethingElse {
}

        

```
Will produce the following error(s):
```
Wrong theme declaration in decorator
```
        
Result of `yarn lint --fix`:
```typescript
@listableObjectComponent(something, somethingElse, undefined, 'test')
export class Something extends SomethingElse {
}
```
        
    
##### plain file declares a theme in @listableObjectComponent
        
Filename: `lint/test/fixture/src/app/dynamic-component/dynamic-component.ts`
        
```typescript
@listableObjectComponent(something, somethingElse, undefined, 'test-2')
export class Something extends SomethingElse {
}

        

```
Will produce the following error(s):
```
There is a theme declaration in decorator, but this file is not part of a theme
```
        
Result of `yarn lint --fix`:
```typescript
@listableObjectComponent(something, somethingElse, undefined)
export class Something extends SomethingElse {
}
```
        
    
##### theme file declares no theme in @listableObjectComponent
        
Filename: `lint/test/fixture/src/themes/test-2/app/dynamic-component/dynamic-component.ts`
        
```typescript
@listableObjectComponent(something, somethingElse, undefined)
export class Something extends SomethingElse {
}

        

```
Will produce the following error(s):
```
No theme declaration in decorator
```
        
Result of `yarn lint --fix`:
```typescript
@listableObjectComponent(something, somethingElse, undefined, 'test-2')
export class Something extends SomethingElse {
}
```
        
    
##### theme file declares explicit undefined theme in @listableObjectComponent
        
Filename: `lint/test/fixture/src/themes/test-2/app/dynamic-component/dynamic-component.ts`
        
```typescript
@listableObjectComponent(something, somethingElse, undefined, undefined)
export class Something extends SomethingElse {
}

        

```
Will produce the following error(s):
```
No theme declaration in decorator
```
        
Result of `yarn lint --fix`:
```typescript
@listableObjectComponent(something, somethingElse, undefined, 'test-2')
export class Something extends SomethingElse {
}
```
        
    


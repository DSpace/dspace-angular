[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/alias-imports`
_______

Unclear imports should be aliased for clarity

_______

[Source code](../../../../lint/src/rules/ts/alias-imports.ts)


### Options

#### `aliases`

A list of all the imports that you want to alias for clarity. Every alias should be declared in the following format:
```json
{
  "package": "rxjs",
  "imported": "of",
  "local": "observableOf"
}
```


### Examples


#### Valid code
    
##### correctly aliased imports
        
```typescript
import { of as observableOf } from 'rxjs';
```
        
With options:

```json
{
  "aliases": [
    {
      "package": "rxjs",
      "imported": "of",
      "local": "observableOf"
    }
  ]
}
```
        
    
##### enforce unaliased import
        
```typescript
import { combineLatest } from 'rxjs';
```
        
With options:

```json
{
  "aliases": [
    {
      "package": "rxjs",
      "imported": "combineLatest",
      "local": "combineLatest"
    }
  ]
}
```
        
    



#### Invalid code  &amp; automatic fixes
    
##### imports without alias
        
```typescript
import { of } from 'rxjs';

        

```
Will produce the following error(s):
```
This import must be aliased
```
        
Result of `yarn lint --fix`:
```typescript
import { of as observableOf } from 'rxjs';
```
        
    
##### imports under the wrong alias
        
```typescript
import { of as ofSomething } from 'rxjs';

        

```
Will produce the following error(s):
```
This import uses the wrong alias (should be {{ local }})
```
        
Result of `yarn lint --fix`:
```typescript
import { of as observableOf } from 'rxjs';
```
        
    
##### disallow aliasing import
        
```typescript
import { combineLatest as observableCombineLatest } from 'rxjs';

        
With options:

```json
{
  "aliases": [
    {
      "package": "rxjs",
      "imported": "combineLatest",
      "local": "combineLatest"
    }
  ]
}
```
        

```
Will produce the following error(s):
```
This import should not use an alias
```
        
Result of `yarn lint --fix`:
```typescript
import { combineLatest } from 'rxjs';
```
        
    


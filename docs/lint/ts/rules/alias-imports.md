[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/alias-imports`
_______

Unclear imports should be aliased for clarity

_______

[Source code](../../../../lint/src/rules/ts/alias-imports.ts)

### Examples


#### Valid code
    
##### correctly aliased imports
        
```typescript
import { of as observableOf } from 'rxjs';
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
        
    


[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/no-default-standalone-value`
_______

Removes unnecessary explicit standalone declarations of the @Component decorators. Starting from Angular 19 this is now the default value.

_______

[Source code](../../../../lint/src/rules/ts/no-default-standalone-value.ts)



### Examples


#### Valid code
    
##### Not setting the standalone value is valid
        
```typescript
@Component({
  selector: 'ds-test',
})
class TestComponent {}
```
        
    
##### Setting the standalone value to false is valid
        
```typescript
@Component({
  selector: 'ds-test',
  standalone: false,
})
class TestComponent {}
```
        
    



#### Invalid code  &amp; automatic fixes
    
##### Should not have explicit standalone declaration
        
```typescript
@Component({
  selector: 'ds-test',
  standalone: true,
})
class TestComponent {}

        

```
Will produce the following error(s):
```
Unnecessary explicit standalone declaration of the @Component decorator should be removed.
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-test',
})
class TestComponent {}
```
        
    


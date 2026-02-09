[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/themed-wrapper-no-input-defaults`
_______

ThemedComponent wrappers should not declare input defaults (see [DSpace Angular #2164](https://github.com/DSpace/dspace-angular/pull/2164))

_______

[Source code](../../../../lint/src/rules/ts/themed-wrapper-no-input-defaults.ts)



### Examples


#### Valid code
    
##### ThemedComponent wrapper defines an input without a default value
        
```typescript
export class TTest extends ThemedComponent<Test> {

@Input()
test;
}
```
        
    
##### Regular class defines an input with a default value
        
```typescript
export class Test {

@Input()
test = 'test';
}
```
        
    



#### Invalid code 
    
##### ThemedComponent wrapper defines an input with a default value
        
```typescript
export class TTest extends ThemedComponent<Test> {

@Input()
test1 = 'test';

@Input()
test2 = true;

@Input()
test2: number = 123;

@Input()
test3: number[] = [1,2,3];
}

        

```
Will produce the following error(s):
```
ThemedComponent wrapper declares inputs with defaults
ThemedComponent wrapper declares inputs with defaults
ThemedComponent wrapper declares inputs with defaults
ThemedComponent wrapper declares inputs with defaults
```
        
    
##### ThemedComponent wrapper defines an input with an undefined default value
        
```typescript
export class TTest extends ThemedComponent<Test> {

@Input()
test = undefined;
}

        

```
Will produce the following error(s):
```
ThemedComponent wrapper declares inputs with defaults
```
        
    


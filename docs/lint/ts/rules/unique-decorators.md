[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/unique-decorators`
_______

Some decorators must be called with unique arguments (e.g. when they construct a mapping based on the argument values)

_______

[Source code](../../../../lint/src/rules/ts/unique-decorators.ts)


### Options

#### `decorators`

The list of all the decorators for which you want to enforce this behavior.


### Examples


#### Valid code
    
##### checked decorator, no repetitions
        
```typescript
@listableObjectComponent(a)
export class A {
}

@listableObjectComponent(a, 'b')
export class B {
}

@listableObjectComponent(a, 'b', 3)
export class C {
}

@listableObjectComponent(a, 'b', 3, Enum.TEST1)
export class C {
}

@listableObjectComponent(a, 'b', 3, Enum.TEST2)
export class C {
}
```
        
    
##### unchecked decorator, some repetitions
        
```typescript
@something(a)
export class A {
}

@something(a)
export class B {
}
```
        
    



#### Invalid code 
    
##### checked decorator, some repetitions
        
```typescript
@listableObjectComponent(a)
export class A {
}

@listableObjectComponent(a)
export class B {
}

        

```
Will produce the following error(s):
```
Duplicate decorator call
```
        
    


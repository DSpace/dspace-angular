[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/sort-standalone-imports`
_______

Sorts the standalone `@Component` imports alphabetically

_______

[Source code](../../../../lint/src/rules/ts/sort-standalone-imports.ts)


### Options

#### `locale`

The locale used to sort the imports.,
#### `maxItems`

The maximum number of imports that should be displayed before each import is separated onto its own line.,
#### `indent`

The indent used for the project.,
#### `trailingComma`

Whether the last import should have a trailing comma (only applicable for multiline imports).


### Examples


#### Valid code
    
##### should sort multiple imports on separate lines
        
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    RootComponent,
  ],
})
export class AppComponent {}
```
        
    
##### should not inlines singular imports when maxItems is 0
        
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RootComponent,
  ],
})
export class AppComponent {}
```
        
    
##### should inline singular imports when maxItems is 1
        
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RootComponent],
})
export class AppComponent {}
```
        
With options:

```json
{
  "maxItems": 1
}
```
        
    



#### Invalid code  &amp; automatic fixes
    
##### should sort multiple imports alphabetically
        
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RootComponent,
    AsyncPipe,
  ],
})
export class AppComponent {}

        

```
Will produce the following error(s):
```
Standalone imports should be sorted alphabetically
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    RootComponent,
  ],
})
export class AppComponent {}
```
        
    
##### should not put singular imports on one line when maxItems is 0
        
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RootComponent],
})
export class AppComponent {}

        

```
Will produce the following error(s):
```
Standalone imports should be sorted alphabetically
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RootComponent,
  ],
})
export class AppComponent {}
```
        
    
##### should not put singular imports on a separate line when maxItems is 1
        
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RootComponent,
  ],
})
export class AppComponent {}

        
With options:

```json
{
  "maxItems": 1
}
```
        

```
Will produce the following error(s):
```
Standalone imports should be sorted alphabetically
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RootComponent],
})
export class AppComponent {}
```
        
    
##### should not display multiple imports on the same line
        
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [AsyncPipe, RootComponent],
})
export class AppComponent {}

        

```
Will produce the following error(s):
```
Standalone imports should be sorted alphabetically
```
        
Result of `yarn lint --fix`:
```typescript
@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    RootComponent,
  ],
})
export class AppComponent {}
```
        
    


# diff-object

```js
const diff = require('diff-object')
```

## API

### showDifferentFields(x, y, [name])

#### x, y

*Required*  
Type: `object`

object you want to compare.

#### name
Type: `string`  
Default: `obj`

whatever you want to name the object


### getText(x, y) and getHTML(x, y)

#### x, y

*Required*  
Type: `object`

object you want to compare.



### saveHTML(x, y, [options])

#### x, y

*Required*  
Type: `object`

object you want to compare.

#### options

- folder: where you want to save the html
- filename: what you want to name the html


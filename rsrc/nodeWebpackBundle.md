
# Webpack Notes

Run webpack to bundle  `app.js`  for Ice Jam page

```bash
$ npx webpack --config webpack.config.js
```

Separate concerns in
```webpack.config.js```

```js
module.exports = {
   entry: './src/app.js'
   // other lines etc... 
};
```
OR

```js
module.exports = {
   entry: ['./main.js', './app.js'],
   ...
};
```


New syntax

```js
import './main.js';
import './app.js';
```

Old syntax

```js
require('./main.js');
require('./app.js');
```

```js
import './main.js';
```


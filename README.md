# node-save-blob

To save a Blob as file to the Downloads folder, for Node.js and browsers

Inspired by [navigator.msSaveBlob](https://learn.microsoft.com/en-us/previous-versions/hh772331(v=vs.85))



## Usage

In Node.js

```js
import {saveBlob} from 'node-save-blob';

let blob = new Blob(['hello'], {type:'text/plain'});

let filePath = await saveBlob(blob, 'hello.txt'); 
console.log('downloaded as '+filePath);
```

In browsers

```js
import {saveBlob} from 'node-save-blob';

let blob = new Blob(['hello'], {type:'text/plain'});

let started = saveBlob(blob, 'hello.txt');
console.log('download '+(started?'started':'failed'));
```



## License

[MIT](./LICENSE)

# js-utils

Various utilities:
- Base64 streaming encoder and decoder

## base64 streaming encoder, decoder
Not much to say about. Encoder and decoder remember state between
writes, so it is possible to encode/decode by chunks of data, see examples:

```javascript
import {Base64Encoder} from "@jakubneubauer/utils"
let enc = new Base64Encoder();
let result = "";
result += enc.write(new Uint8Array([104, 101, 108, 108]));
result += enc.write(new Uint8Array([111]));
result += enc.flush();
console.log(result); // aGVsbG8=
```

```javascript
import {Base64Decoder} from "@jakubneubauer/utils"
let dec = new Base64Decoder();
console.log(dec.write("aG")); // Uint8Array(1) [ 104 ]
console.log(dec.write("VsbG8=")); Uint8Array(4) [ 101, 108, 108, 111 ]
```


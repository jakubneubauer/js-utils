# js-utils

## base64 streaming encoder, decoder

```javascript
import {Base64Encoder} from "@jakubneubauer/utils"
let enc = new Base64Encoder();
let result = "";
result += enc.write(new Uint8Array([104, 101, 108, 108]));
result += enc.write(new Uint8Array([111, 108, 108, 111]));
result += enc.flush();
console.log(result);
```

```javascript
import {Base64Decoder} from "@jakubneubauer/utils"
    let dec = new Base64Decoder();
    console.log(dec.write("aG"));
    console.log(dec.write("VsbG8="));
```
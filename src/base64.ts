export class Base64EncoderOptions {
    public lineLength?: number;
}

/**
 * Streaming encoder and decoder between binary (Uint8Array) to base64 string.
 */
export class Base64Encoder {
    private extra1: number;
    private extra2: number;
    private readonly lineLength?: number;
    private charCounter: number;

    /**
     * Creates a Base64Encoder
     * @param {Object=} options - Options for the encoder.
     * @param {number=} options.lineLength - The max line-length of the output stream.
     * @param {string=} options.prefix - Prefix for output string.
     */
    constructor(options?: Base64EncoderOptions) {
        this.extra1 = -1;
        this.extra2 = -1;
        this.lineLength = options?.lineLength;
        this.charCounter = 0;
    }

    /**
     * Transforms a binary chunk of data to a Base64 string chunk.
     */
    write(chunk: Uint8Array) {
        let v1, v2, v3, start, i;
        let chunkLen = chunk.length;
        let result = '';
        let end = chunkLen - 3;
        if (this.extra2 >= 0) {
            if (chunkLen < 1) return '';
            v1 = this.extra2;
            v2 = this.extra1;
            v3 = chunk[0];
            start = 1;
        } else if (this.extra1 >= 0) {
            if (chunkLen < 2) return '';
            v1 = this.extra1;
            v2 = chunk[0];
            v3 = chunk[1];
            start = 2;
        } else {
            if (chunkLen < 3) return '';
            v1 = chunk[0];
            v2 = chunk[1];
            v3 = chunk[2];
            start = 3;
        }
        i = start;

        while (true) {
            if (this.lineLength && this.charCounter >= this.lineLength) {
                result += '\n';
                this.charCounter = 0;
            }
            result +=
                base64Table[(v1 >> 2)]
                + base64Table[((v1 & 3) << 4 | (v2 >> 4))]
                + base64Table[((v2 & 15) << 2) | v3 >> 6]
                + base64Table[((v3 & 63))];
            this.charCounter += 4;
            if (i > end) break;
            v1 = chunk[i];
            v2 = chunk[i + 1];
            v3 = chunk[i + 2];
            i += 3;
        }

        if (i === chunkLen - 2) {
            this.extra1 = chunk[chunkLen - 1];
            this.extra2 = chunk[chunkLen - 2];
        } else if (i === chunkLen - 1) {
            this.extra1 = chunk[chunkLen - 1];
            this.extra2 = -1;
        } else {
            this.extra1 = -1;
            this.extra2 = -1;
        }

        return result;
    }

    /**
     * Must be called at the end of conversion
     * @returns {string} the rest of the encoded text
     */
    flush() {
        if (this.extra2 >= 0) {
            let result = '';
            if (this.lineLength && this.charCounter >= this.lineLength) {
                result += '\n';
                this.charCounter = 0;
            }
            result += this.write(new Uint8Array([0])).slice(0, 3) + "=";
            return result;
        } else if (this.extra1 >= 0) {
            let result = '';
            if (this.lineLength && this.charCounter >= this.lineLength) {
                result += '\n';
                this.charCounter = 0;
            }
            result += this.write(new Uint8Array([0, 0])).slice(0, 2) + "==";
            this.charCounter += 4;
            return result;
        }
        return '';
    }
}

export class Base64Decoder {

    private phase: number;
    private remain: number;

    constructor() {
        this.phase = 0;
        this.remain = 0;
    }

    write(chunk: string) {
        let result = []; // array of byte values, will be converted to Uint8Array at the end
        let len = chunk.length;
        for (let i = 0; i < len; i++) {
            let c = chunk[i];
            let val = base64ReverseTable.get(c);
            if (!val) {
                continue;
            }
            switch (this.phase) {
                case 0:
                    this.remain = val;
                    this.phase++;
                    break;
                case 1:
                    result.push((this.remain << 2) | (val >> 4));
                    this.remain = val & 0b1111;
                    this.phase++;
                    break;
                case 2:
                    result.push((this.remain << 4) | (val >> 2));
                    this.remain = val & 0b11;
                    this.phase++;
                    break;
                case 3:
                    result.push((this.remain << 6) | val);
                    this.phase = 0;
                    break;
            }
        }
        return new Uint8Array(result);
    }
}

let base64Table = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
]

let base64ReverseTable = new Map<string, number>([
    ["A",0], ["B",1], ["C",2], ["D",3], ["E",4], ["F",5], ["G",6], ["H",7],
    ["I",8], ["J",9], ["K",10], ["L",11], ["M",12], ["N",13], ["O",14], ["P",15],
    ["Q",16], ["R",17], ["S",18], ["T",19], ["U",20], ["V",21], ["W",22], ["X",23],
    ["Y",24], ["Z",25], ["a",26], ["b",27], ["c",28], ["d",29], ["e",30], ["f",31],
    ["g",32], ["h",33], ["i",34], ["j",35], ["k",36], ["l",37], ["m",38], ["n",39],
    ["o",40], ["p",41], ["q",42], ["r",43], ["s",44], ["t",45], ["u",46], ["v",47],
    ["w",48], ["x",49], ["y",50], ["z",51], ["0",52], ["1",53], ["2",54], ["3",55],
    ["4",56], ["5",57], ["6",58], ["7",59], ["8",60], ["9",61], ["+",62], ["/",63]
]);

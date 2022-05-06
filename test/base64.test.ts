import {Base64Encoder, Base64Decoder} from "../src/base64"

test("encoder", () => {
    let enc = new Base64Encoder();
    let result = enc.write(new Uint8Array([104,101,108,108,111]));
    result += enc.flush();
    expect(result).toBe("aGVsbG8=")
})
test("encoder streaming", () => {
    let enc = new Base64Encoder();
    let result = enc.write(new Uint8Array([104,101,108,108]));
    result += enc.write(new Uint8Array([111]));
    result += enc.flush();
    expect(result).toBe("aGVsbG8=")
})

test("decoder non-padded 1", () => {
    let dec = new Base64Decoder();
    let result = dec.write("aGVsbG8=");
    expect(result).toStrictEqual(new Uint8Array([104,101,108,108,111]));
});

test("decoder non-padded 2", () => {
    let dec = new Base64Decoder();
    let result = dec.write("bGln\r\naHQgdw");
    expect(result).toStrictEqual(new Uint8Array([108,105,103,104,116,32,119]));
});

test("decoder non-padded 2", () => {
    let dec = new Base64Decoder();
    let result = dec.write("bGln\naHQgd28");
    expect(result).toStrictEqual(new Uint8Array([108,105,103,104,116,32,119,111]));
});

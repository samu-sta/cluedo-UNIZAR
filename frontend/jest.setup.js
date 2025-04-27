// Jest setup file
import '@testing-library/jest-dom';

// Polyfill para TextEncoder/TextDecoder
class TextEncoderPolyfill {
  encode(str) {
    const encoder = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      encoder[i] = str.charCodeAt(i);
    }
    return encoder;
  }
}

class TextDecoderPolyfill {
  decode(arr) {
    return String.fromCharCode.apply(null, arr);
  }
}

global.TextEncoder = TextEncoderPolyfill;
global.TextDecoder = TextDecoderPolyfill;
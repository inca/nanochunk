# Chunked-Encoding Stream Parser

```ts
import { readChunkedStream } from 'nanochunk';

const stream = Readable.from(async* stream() => {
    yield Buffer.from('1');
    yield Buffer.from('1\nH');
    yield Buffer.from('ello worl');
    yield Buffer.from('d7');
    yield Buffer.from('\nkthxby');
    yield Buffer.from('e');
});

const payloads: string[] = [];
for await (const payload of readChunkedStream(stream)) {
    payloads.push(payload);
}

assert.deepStrictEqual(payloads, [
    'Hello world',
    'kthxbye'
]);
```

## Highlights

- 🔥 Zero dependencies
- 🗜 Tidy and compact
- 💻 Works in browser
- 🔬 Strongly typed

import { Readable, Writable } from 'stream';

const DEFAULT_SEPARATOR = Buffer.from('\n');

export async function* readChunkedStream(readable: Readable, separator = DEFAULT_SEPARATOR) {
    let buffer: Buffer = Buffer.alloc(0);
    let payloadLength = 0;
    for await (const chunk of readable) {
        buffer = Buffer.concat([buffer, chunk]);
        if (payloadLength === 0) {
            // Look for separator
            const index = buffer.indexOf(separator);
            if (index === -1) {
                continue;
            }
            // Got separator, read length
            const lengthBuf = buffer.subarray(0, index);
            buffer = buffer.subarray(index + separator.byteLength);
            const length = Number(lengthBuf.toString('utf-8'));
            if (!length) {
                continue;
            }
            payloadLength = length;
        }
        // Wait till that many bytes are consumed
        if (buffer.byteLength < payloadLength) {
            continue;
        }
        const payload = buffer.subarray(0, payloadLength);
        buffer = buffer.subarray(payloadLength);
        payloadLength = 0;
        yield payload.toString('utf-8');
    }
}

export function writeChunkStream(writeable: Writable, payload: string) {
    const payloadBuffer = Buffer.from(payload, 'utf-8');
    const lengthBuffer = Buffer.from(String(payloadBuffer.byteLength) + '\n', 'utf-8');
    writeable.write(lengthBuffer);
    writeable.write(payloadBuffer);
}

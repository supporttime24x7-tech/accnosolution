const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = 'C:/Users/CompuSAGA/.gemini/antigravity/brain/833c1283-013b-456c-a560-3c1f6b9803c3/.user_uploaded/media_1793261061889_dd4f8531.jpg';

// Helper to create valid standard Windows/Browser ICO from PNG buffers
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const entries = [];
  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Image offset
    offset += buffer.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

async function run() {
  console.log('Reading source image:', src);

  // 1. Trim surrounding whitespace
  const trimmed = await sharp(src).trim().toBuffer({ resolveWithObject: true });
  console.log('Trimmed size:', trimmed.info.width, 'x', trimmed.info.height);

  // 2. Make white background transparent
  const { data, info } = await sharp(trimmed.data)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0;
    } else if (r > 215 && g > 215 && b > 215) {
      const diff = Math.max(r, g, b) - 215;
      data[i + 3] = Math.max(0, 255 - Math.round((diff / 25) * 255));
    }
  }

  const transparentPng = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();

  // Create standard square transparent master (512x512)
  const masterSize = 512;
  const targetInner = Math.round(masterSize * 0.90);
  const resized = await sharp(transparentPng)
    .resize(targetInner, targetInner, { fit: 'inside' })
    .toBuffer();

  const master512 = await sharp({
    create: {
      width: masterSize,
      height: masterSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{ input: resized, gravity: 'center' }])
  .png()
  .toBuffer();

  // Generate all required standard icon sizes
  const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
  const renderedBuffers = {};

  for (const s of sizes) {
    const buf = await sharp(master512)
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    renderedBuffers[s] = buf;
  }

  // Also create Apple Touch Icon (Apple guidelines recommend solid or white background)
  const appleTouchIcon = await sharp(trimmed.data)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();

  // Create multi-resolution ICO file (48x48, 32x32, 16x16)
  const icoBuffer = createIco([
    { width: 48, height: 48, buffer: renderedBuffers[48] },
    { width: 32, height: 32, buffer: renderedBuffers[32] },
    { width: 16, height: 16, buffer: renderedBuffers[16] },
  ]);

  // Write files to public/
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('public/favicon.png', renderedBuffers[32]);
  fs.writeFileSync('public/favicon-32x32.png', renderedBuffers[32]);
  fs.writeFileSync('public/favicon-16x16.png', renderedBuffers[16]);
  fs.writeFileSync('public/icon.png', renderedBuffers[512]);
  fs.writeFileSync('public/icon-192.png', renderedBuffers[192]);
  fs.writeFileSync('public/icon-512.png', renderedBuffers[512]);
  fs.writeFileSync('public/apple-icon.png', appleTouchIcon);
  fs.writeFileSync('public/apple-touch-icon.png', appleTouchIcon);

  // Write Next.js App Router default icon files to src/app/
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);
  fs.writeFileSync('src/app/icon.png', renderedBuffers[512]);
  fs.writeFileSync('src/app/apple-icon.png', appleTouchIcon);

  console.log('Favicon and icon files generated successfully in public/ and src/app/!');
}

run().catch(console.error);

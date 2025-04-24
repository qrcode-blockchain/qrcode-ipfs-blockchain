// app/api/generate-product-data/route.js
import crypto from 'crypto';
import QRCode from 'qrcode';

export async function POST(request) {
  try {
    const productData = await request.json();
    const ipfsHash = productData.ipfsHash

    // Convert data to JSON string
    const dataString = JSON.stringify(productData);

    // Generate SHA-256 hash
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');

    // Create tracking URL
    const url = `https://qrcode-ipfs-blockchain.vercel.app/products/${ipfsHash}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(url);

    // Return JSON response
    return new Response(JSON.stringify({ hash, url, qrCode }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating product data:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate product data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

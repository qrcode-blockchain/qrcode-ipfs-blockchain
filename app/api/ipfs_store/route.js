export async function POST(request) {
    const pinataApiKey = "a9f1b0dd316a8d831085";
    const pinataSecretApiKey = "401591a1e25657feea5cf90eae95c98b439573a4cab676382926a58c7ed44007";
  
    try {
      const productData = await request.json();
  
      const jsonData = {
        productName: productData.productName,
        batchNumber: productData.batchNumber,
        location: productData.location,
        date: productData.date,
        price: productData.price,
        serialNumber: productData.serialNumber,
        weight: productData.weight,
        manufacturerName: productData.manufacturerName,
        timestamp: new Date().toISOString(),
      };
  
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
        body: JSON.stringify({
          pinataMetadata: {
            name: `Product-${productData.serialNumber}`,
          },
          pinataContent: jsonData,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Pinata error: ${response.statusText}`);
      }
  
      const result = await response.json();
      return new Response(JSON.stringify({ success: true, ipfsHash: result.IpfsHash }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error storing data on Pinata:', error);
      return new Response(JSON.stringify({ error: 'Failed to store data on IPFS via Pinata' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  
// export async function POST(request) {
//     const pinataApiKey = "a9f1b0dd316a8d831085";
//     const pinataSecretApiKey = "401591a1e25657feea5cf90eae95c98b439573a4cab676382926a58c7ed44007";
  
//     try {
//       const productData = await request.json();
  
//       const data = {
//         productName: productData.productName,
//         batchNumber: productData.batchNumber,
//         location: productData.location,
//         date: productData.date,
//         price: productData.price,
//         serialNumber: productData.serialNumber,
//         weight: productData.weight,
//         manufacturerName: productData.manufacturerName,
//         timestamp: new Date().toISOString(),
//       };
  
//       const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           pinata_api_key: pinataApiKey,
//           pinata_secret_api_key: pinataSecretApiKey,
//         },
//         body: JSON.stringify({
//           pinataMetadata: {
//             name: `Product-${productData.serialNumber}`,
//           },
//           pinataContent: data,
//         }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Pinata error: ${response.statusText}`);
//       }
  
//       const result = await response.json();
//       return new Response(JSON.stringify({ success: true, ipfsHash: result.IpfsHash }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     } catch (error) {
//       console.error('Error storing data on Pinata:', error);
//       return new Response(JSON.stringify({ error: 'Failed to store data on IPFS via Pinata' }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   }
import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const s3 = new AWS.S3({
    endpoint: 'https://s3.filebase.com',
    accessKeyId: process.env.FILEBASE_ACCESS_KEY,
    secretAccessKey: process.env.FILEBASE_SECRET_KEY,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

function generateHashFromObject(obj) {
    const dataString = JSON.stringify(obj);
    const hash = crypto.createHash('sha256').update(dataString, 'utf8').digest('hex');
    return hash;
}

export async function POST(request) {
    try {
        const jsonData = await request.json();
        
        if (!jsonData || Object.keys(jsonData).length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No data provided'
            }, { status: 400 });
        }
        const objectHash = await generateHashFromObject(jsonData);
        const fileName = `${objectHash}.json`;
        console.log(`Uploading file: ${fileName}`);
        
        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: JSON.stringify(jsonData, null, 2),
            ContentType: 'application/json'
        };
        const uploadResult = await s3.upload(uploadParams).promise();

        await new Promise(resolve => setTimeout(resolve, 100));

        const headParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName
        };
        const headResult = await s3.headObject(headParams).promise();
        
        const cid = headResult.Metadata?.cid || 
                headResult.Metadata?.['ipfs-hash'] || 
                headResult.Metadata?.['x-amz-meta-cid'] ||
                headResult.Metadata?.['x-amz-meta-ipfs-hash'];
        
        if (!cid) {
            console.warn('CID not found:', headResult.Metadata);

            await new Promise(resolve => setTimeout(resolve, 1000));
            const retryHeadResult = await s3.headObject(headParams).promise();
            const retryCid = retryHeadResult.Metadata?.cid || 
                            retryHeadResult.Metadata?.['ipfs-hash'] || 
                            retryHeadResult.Metadata?.['x-amz-meta-cid'] ||
                            retryHeadResult.Metadata?.['x-amz-meta-ipfs-hash'];
            
            if (!retryCid) {
                console.error('CID still not available after retry. Full metadata:', retryHeadResult.Metadata);
            }
            
            return NextResponse.json({
                success: true,
                ipfsHash: retryCid || null,
                fileName: fileName,
                location: uploadResult.Location,
                objectHash: objectHash,
                warning: !retryCid ? 'CID not available yet, may need to check later' : undefined
            });
        }
        
        return NextResponse.json({
            success: true,
            ipfsHash: cid,
            fileName: fileName,
            location: uploadResult.Location,
            objectHash: objectHash
        });
        
    } catch (error) {
        console.error('IPFS storage error:', error);
        
        if (error.code === 'NoSuchBucket') {
            return NextResponse.json({
                success: false,
                error: 'Bucket does not exist'
            }, { status: 400 });
        }
        if (error.code === 'InvalidAccessKeyId') {
            return NextResponse.json({
                success: false,
                error: 'Invalid access credentials'
            }, { status: 401 });
        }
        
        return NextResponse.json({ success: false, error: error.message || 'Upload failed'}, { status: 500 });
    }
}
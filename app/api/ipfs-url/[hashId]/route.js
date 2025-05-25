import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const SECONDS_EXPIRY_TIMER = 300;

const s3 = new S3Client({
    region: "us-east-1",
    endpoint: "https://s3.filebase.com",
    credentials: {
        accessKeyId: process.env.FILEBASE_KEY,
        secretAccessKey: process.env.FILEBASE_SECRET,
    },
});

async function generateSignedUrl(key) {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: SECONDS_EXPIRY_TIMER });
    return signedUrl;
}

export async function GET({ params }) {
    const {hashId} = await params;
    try{
        if (!process.env.BUCKET_NAME) {
            return NextResponse.json({ success: false, error: "Missing Filebase bucket name" });
        }
        const key  = `${hashId}.json`;
        const url = await generateSignedUrl(key);
        console.log(url);
        return NextResponse.json({ success: true, url: url});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
import crypto from "crypto";

export type CloudinarySignature = {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder?: string;
};

export function createUploadSignature(params?: { folder?: string }): CloudinarySignature {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME as string;
    const apiKey = process.env.CLOUDINARY_API_KEY as string;
    const apiSecret = process.env.CLOUDINARY_API_SECRET as string;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Cloudinary env vars are not configured");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = params?.folder;

    // Build the signature string according to Cloudinary rules
    // e.g., "folder=...&timestamp=...<apiSecret>"
    const toSign = [
        folder ? `folder=${folder}` : undefined,
        `timestamp=${timestamp}`,
    ]
        .filter(Boolean)
        .join("&");

    const signature = crypto
        .createHash("sha1")
        .update(`${toSign}${apiSecret}`)
        .digest("hex");

    return { timestamp, signature, apiKey, cloudName, folder };
}

export async function uploadImageToCloudinary(file: Blob, options?: { folder?: string }) {
    const { apiKey, cloudName, signature, timestamp, folder } = createUploadSignature({ folder: options?.folder || "users" });

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    if (folder) form.append("folder", folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form as any,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Cloudinary upload failed: ${res.status} ${err}`);
    }

    const json = await res.json();
    return json as { secure_url: string; public_id: string };
}



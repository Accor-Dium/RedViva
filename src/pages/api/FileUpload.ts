import type { APIRoute } from 'astro';
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

let cloudinaryConfigured = false;

function ensureCloudinaryConfigured() {
    if (cloudinaryConfigured) {
        return;
    }

    const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
    const apiKey =
        import.meta.env.CLOUDINARY_API_KEY
    const apiSecret =
        import.meta.env.CLOUDINARY_API_SECRET

    const missing: string[] = [];
    if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
    if (!apiKey) missing.push("CLOUDINARY_API_KEY");
    if (!apiSecret) missing.push("CLOUDINARY_API_SECRET");

    if (missing.length > 0) {
        throw new Error(
            `Cloudinary environment variables are not configured: ${missing.join(", ")}`
        );
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    cloudinaryConfigured = true;
}

interface UploadResult {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
}

const MAX_FILES = 1;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

export const POST: APIRoute = async ({ request }) => {
    try {
        ensureCloudinaryConfigured();
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                error: "Cloudinary configuration error",
                details:
                    typeof error?.message === "string"
                        ? error.message
                        : "Required Cloudinary environment variables are missing or invalid.",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }



    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('multipart/form-data')) {
        return new Response(
            JSON.stringify({
                error: 'Content-Type must be multipart/form-data with image files in the "images" field.'
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Invalid form data payload.' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }


    const files = formData.getAll('images');
    const validFiles = files.filter((file): file is File => file instanceof File);

    if (validFiles.length === 0) {
        return new Response(
            JSON.stringify({
                error: 'No valid image files provided in the "images" field.'
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    if (validFiles.length > MAX_FILES) {
        return new Response(
            JSON.stringify({
                error: `Too many files. Maximum ${MAX_FILES} files allowed per request.`,
                received: validFiles.length
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    const invalidFiles: string[] = [];
    const oversizedFiles: string[] = [];

    for (const file of validFiles) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            invalidFiles.push(`${file.name} (type: ${file.type})`);
        }

        if (file.size > MAX_FILE_SIZE) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            oversizedFiles.push(`${file.name} (${fileSizeMB} MB)`);
        }
    }

    if (invalidFiles.length > 0 || oversizedFiles.length > 0) {
        const errors: string[] = [];

        if (invalidFiles.length > 0) {
            errors.push(`Invalid file types: ${invalidFiles.join(', ')}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
        }

        if (oversizedFiles.length > 0) {
            errors.push(`Files exceed size limit (${MAX_FILE_SIZE / (1024 * 1024)} MB): ${oversizedFiles.join(', ')}`);
        }

        return new Response(
            JSON.stringify({
                error: 'File validation failed',
                details: errors
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    const uploadResults: UploadResult[] = [];
    const errors: string[] = [];

    for (const file of validFiles) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());

            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        type: 'upload',
                        folder: 'redviva',
                    },
                    (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('Upload failed: no result'));
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });

            uploadResults.push({
                secure_url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`Failed to upload ${file.name}: ${errorMessage}`);
        }
    }

    if (uploadResults.length === 0) {
        return new Response(
            JSON.stringify({
                error: 'All uploads failed',
                details: errors
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }


    return new Response(
        JSON.stringify({
            uploaded: uploadResults,
            ...(errors.length > 0 && { errors })
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
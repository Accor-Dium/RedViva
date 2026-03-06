import type { APIRoute } from 'astro';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const files = formData.getAll('images');

    const uploadResults = [];

    for (const file of files) {
        if (!(file instanceof File)) continue;

        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    type: 'upload',
                    folder: 'redviva',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(buffer);
        });

        uploadResults.push(result);
    }

    return new Response(
        JSON.stringify({ uploaded: uploadResults }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
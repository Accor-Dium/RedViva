const BASE_URL = "/api/FileUpload";


export async function uploadFile(
    file: File
): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('images', file);
    
    const token = import.meta.env.PUBLIC_FILE_UPLOAD_ADMIN_TOKEN;
    
    const res = await fetch(BASE_URL, {
        method: 'POST',
        body: formData,
        headers: {
            'image-upload-token': token,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details?.join(', ') || errorData.error || 'Error al subir la imagen');
    }

    return await res.json();
}
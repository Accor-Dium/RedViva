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
        let errorMsg = 'Error al subir la imagen'
        try {
            const errorData = await res.json()
            errorMsg = errorData.details?.join(', ') || errorData.error || errorMsg
        } catch {
            errorMsg = `Error ${res.status}: ${await res.text().catch(() => res.statusText)}`
        }
        throw new Error(errorMsg)
    }

    return await res.json();
}
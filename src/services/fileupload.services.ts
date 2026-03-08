const BASE_URL = "/api/FileUpload";

export async function uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('images', file);
    
    const token = import.meta.env.PUBLIC_FILE_UPLOAD_ADMIN_TOKEN;
    formData.append('token', token);
    
    const res = await fetch(BASE_URL, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        let errorMessage = 'Error al subir la imagen';
        try {
            const errorData = await res.json();
            errorMessage = errorData.details?.join(', ') || errorData.error || errorMessage;
        } catch {
            errorMessage = `Error ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
    }

    return await res.json();
}
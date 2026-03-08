const BASE_URL = "/api/FileUpload";

export function setUploadToken() {
    const token = import.meta.env.PUBLIC_FILE_UPLOAD_ADMIN_TOKEN;
    if (token) {
        document.cookie = `upload_token=${token}; path=/; ${location.protocol === 'https:' ? 'secure;' : ''} samesite=strict`;
    }
}

export async function uploadFile(file: File): Promise<UploadResponse> {
    setUploadToken();
    
    const formData = new FormData();
    formData.append('images', file);
    
    const res = await fetch(BASE_URL, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
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
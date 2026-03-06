import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageStructure {
    file?: File;
    preview: string | null | undefined;
}

interface FileUploadProps {
    images: ImageStructure[];
    setImages: React.Dispatch<React.SetStateAction<ImageStructure[]>>;
}

export default function FileUpload({ images, setImages }: FileUploadProps) {

    const convertToWebp = (file: File): Promise<ImageStructure> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject("No se pudo obtener el contexto del canvas");

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    canvas.toBlob(blob => {
                        if (blob) {
                            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
                            resolve({ file: webpFile, preview: URL.createObjectURL(webpFile) });
                        } else {
                            reject("No se pudo convertir la imagen a WEBP");
                        }
                    }, "image/webp", 0.8);
                };
            };
            reader.onerror = error => reject(error);
        });
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (images.length >= 1) return;

        const filesToConvert = acceptedFiles.slice(0, 1);

        try {
            const convertedFiles = await Promise.all(filesToConvert.map(convertToWebp));
            setImages(prevImages => [...prevImages, ...convertedFiles]);
        } catch (error) {
            console.error("Error al convertir imágenes:", error);
        }
    }, [images]);

    const removeImage = (index: number) => {
        setImages(prev => {
            const updated = [...prev];
            if (updated[index].preview) {
                URL.revokeObjectURL(updated[index].preview as string);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/bmp': ['.bmp'],
            'image/webp': ['.webp']
        },
        disabled: images.length >= 1
    });

    const styles = {
        container: "flex flex-col w-56 gap-4",
        dropZone: {
            base: "border-2 border-dashed p-6 rounded-lg cursor-pointer flex justify-center items-center h-56 transition-colors",
            idle: "border-gray-300 hover:border-gray-400",
            active: "border-blue-400 bg-blue-50",
        },
        dropZoneText: {
            drag: "text-blue-500 text-center",
            hint: "text-center text-sm",
            formats: "text-xs text-gray-300",
        },
        dropZoneIcon: "h-10 w-10",
        dropZoneInner: "flex flex-col items-center gap-2 text-gray-400",
        preview: {
            wrapper: "relative w-56 h-56 rounded-lg overflow-hidden border border-gray-200",
            image: "w-full h-full object-cover",
            removeBtn: "absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-md",
        },
    };

    return (
        <div className={styles.container}>

            {images.length === 0 && (
                <div
                    {...getRootProps()}
                    onClick={open}
                    className={`${styles.dropZone.base} ${isDragActive ? styles.dropZone.active : styles.dropZone.idle}`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className={styles.dropZoneText.drag}>Suelta los archivos aquí...</p>
                    ) : (
                        <div className={styles.dropZoneInner}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={styles.dropZoneIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className={styles.dropZoneText.hint}>Arrastra y suelta una imagen aquí, o haz clic para seleccionar</p>
                            <p className={styles.dropZoneText.formats}>PNG, JPG, BMP, WEBP</p>
                        </div>
                    )}
                </div>
            )}

            {images.length > 0 && (
                <div className={styles.preview.wrapper}>
                    <img
                        src={images[0].preview ?? ""}
                        alt="Preview"
                        className={styles.preview.image}
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeImage(0);
                        }}
                        className={styles.preview.removeBtn}
                        title="Eliminar imagen"
                    >
                        ✕
                    </button>
                </div>
            )}

        </div>
    );
}
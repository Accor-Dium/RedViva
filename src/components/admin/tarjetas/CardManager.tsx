import { useState, useRef, useCallback, useEffect } from 'react';
import Modal from './Modal'
import Table from './Table';
import FileInput from './FileUpload'
import { getTarjetasPaginated, createTarjeta } from '@/services/tarjetas.services';
import Paginator from './Paginator';
import { TARJETAS_PAGE } from '@/constants/components/tarjetas';
import TableHeader from './TableHeader';
import { uploadFile } from '@/services/fileupload.services';

export default function CardManager() {
    const nextIdRef = useRef(1);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState<Tarjeta[]>([]);
    const [urlError, setUrlError] = useState('');
    const [images, setImages] = useState<ImageStructure[]>([]);
    const [enlace, setEnlace] = useState('');
    const [descripcion, setDescripcion] = useState('');



    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isFormValid =
        enlace.trim() !== '' &&
        isValidUrl(enlace) &&
        descripcion.trim() !== '' &&
        images.length > 0;

    const handleEnlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEnlace(value);

        if (value.trim() !== '' && !isValidUrl(value)) {
            setUrlError('URL inválida. Debe incluir http:// o https://');
        } else {
            setUrlError('');
        }
    };



    const fetchTarjetas = useCallback(
        async (pageNum: number) => {
            setIsLoading(true);
            try {
                const { items, pagination } = await getTarjetasPaginated(
                    pageNum,
                    TARJETAS_PAGE.ITEMS_PER_PAGE,
                );

                setRows(items);
                setTotalPages(pagination.totalPages);
                setPage(pagination.page);
            } catch (error) {
                console.error("Error al cargar tarjetas:", error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );


    useEffect(() => {
        fetchTarjetas(1);
    }, [fetchTarjetas]);

    const handlePageChange = (newPage: number) => {
        fetchTarjetas(newPage);
    };


    const handleAdd = async (closeModal: () => void) => {
        if (!isFormValid) {
            return;
        }

        if (images.length === 0 || !images[0].file) {
            alert('No hay imagen para subir');
            return;
        }

        setIsLoading(true);
        try {

            const uploadResponse = await uploadFile(images[0].file);

            if (uploadResponse.uploaded.length > 0) {
                const imageUrl = uploadResponse.uploaded[0].secure_url;

                await createTarjeta({
                    descripcion: descripcion,
                    imagen: imageUrl,
                    enlace: enlace
                });
                closeModal();

                setTimeout(() => {

                    addRow(enlace, descripcion, imageUrl);
                    setEnlace('');
                    setDescripcion('');
                    setImages([]);
                }, 350);
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            alert(error instanceof Error ? error.message : 'Error al subir la imagen');
        } finally {
            setIsLoading(false);
        }
    };

    function addRow(enlace: string, desc: string, imageUrl: string) {
        const newId = nextIdRef.current;
        nextIdRef.current++;

        const newRow = {
            id: newId,
            enlace: enlace,
            descripcion: desc,
            imagen: imageUrl,
            contador: "0",
            fecha_creacion: new Date().toISOString()
        };

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                setRows((prev) => [newRow, ...prev]);
            });
        } else {
            setRows((prev) => [newRow, ...prev]);
        }
    }

    const STYLES = {
        main: "w-full  flex flex-col",
        contentWrapper: "flex-grow flex flex-col gap-8 mt-8",
        buttonContainer: "flex justify-end",
        modalContent: "space-y-4",
        headerModal: "text-xl font-bold mb-4",
        input: "w-full p-2 border rounded",
        textarea: "w-full p-2 border rounded",
        addButton: "w-full px-4 py-2 rounded text-white transition-colors",
        addButtonEnabled: "bg-blue-400 hover:bg-blue-500 cursor-pointer",
        addButtonDisabled: "bg-gray-300 cursor-not-allowed",
        section: "flex flex-col items-center gap-4",
        loadingContainer: "text-center py-8",
        paginationContainer: "fixed bottom-8 left-0 right-0 py-6 flex justify-center z-10",
        errorURL:"text-red-500 text-xs mt-1"
    }

    return (
        <main className={STYLES.main}>
            <div className={STYLES.contentWrapper}>
                <div className={STYLES.buttonContainer}>
                    <Modal buttonText="Agregar Tarjeta">
                        {(closeModal) => (
                            <div className={STYLES.modalContent}>
                                <h2 className={STYLES.headerModal}>{TARJETAS_PAGE.NEW}</h2>

                                <section className={STYLES.section}>
                                    <input
                                        value={enlace}
                                        onChange={handleEnlaceChange}
                                        placeholder="https://ejemplo.com"
                                        className={`${STYLES.input} ${urlError ? 'border-red-500' : ''}`}
                                        aria-label='input-enlace'
                                    />
                                    {urlError && (
                                        <p className={STYLES.errorURL}>{urlError}</p>
                                    )}
                                    <FileInput images={images} setImages={setImages} />
                                    <textarea
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Descripción de la tarjeta"
                                        rows={4}
                                        className={STYLES.textarea}
                                        aria-label='textarea-descripcion'
                                    />
                                </section>

                                <button
                                    className={`${STYLES.addButton} ${isFormValid ? STYLES.addButtonEnabled : STYLES.addButtonDisabled}`}
                                    onClick={() => handleAdd(closeModal)}
                                    disabled={!isFormValid}
                                >
                                    {isLoading ? TARJETAS_PAGE.UPLOADING : TARJETAS_PAGE.ADD_BUTTON}
                                </button>
                            </div>
                        )}
                    </Modal>
                </div>
                <TableHeader />
                {isLoading ? (
                    <div className={STYLES.loadingContainer}>{TARJETAS_PAGE.LOADING}</div>
                ) : (
                    <Table rows={rows} />
                )}
            </div>

            {(totalPages > 1) && (
                <div className={STYLES.paginationContainer}>
                    <Paginator
                        totalPages={totalPages}
                        currentPage={page}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </main>
    );
}
import { MODAL_TEXTS } from "@/constants/components/tarjetas";
import Modal from "./Modal";
import { EyeIcon } from '@phosphor-icons/react';
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { deleteTarjeta } from "@/services/tarjetas.services";

const STYLES = {
  row: "w-full shadow-md rounded-xl bg-white border border-gray-200 p-4 mb-4 hover:scale-101 transition-transform duration-300 min-h-[80px]",
  grid: "grid grid-cols-5 gap-4 w-full items-center h-full",
  title: "col-span-1 text-center",
  column: "col-span-1 text-center line-clamp-2 items-center flex justify-center overflow-hidden h-full",
  columnSpan: "line-clamp-1",
  columnSpan2: "line-clamp-2",
  actionColumn: "col-span-1 flex justify-center items-center h-full",

  // Modal styles
  modalContent: "max-h-[85vh] overflow-hidden",
  modalTitle: "text-xl font-bold mb-4 px-4",
  modalGrid: "grid md:grid-cols-2 grid-cols-1 gap-6 p-4 max-h-[75vh] overflow-y-auto",

  // Imagen
  imageContainer: "flex justify-center items-start md:sticky md:top-0",
  image: "w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md border border-gray-200",
  imagePlaceholder: "w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200",
  imagePlaceholderText: "text-gray-400",

  // Información
  infoSection: "space-y-4",
  infoLabel: "text-gray-700 block mb-1 text-sm",
  infoText: "text-sm",
  link: "text-blue-500 hover:underline break-all text-sm",
  descriptionContainer: "max-h-32 overflow-y-auto break-words p-3 bg-gray-50 rounded border border-gray-200 text-sm",
  inLine: "flex gap-1",

  // Boton Modal
  buttonModal: "flex flex-row items-center justify-center gap-2 w-12 h-12 rounded-md cursor-pointer bg-pink-400 hover:bg-pink-500 transition-colors",
  modalWidth: "max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl",

  cancelButton: "flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer",
  deleteButton: "flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm cursor-pointer",

  deleteModal: "flex flex-col items-center justify-center p-6 max-w-md",
  deleteIco: "mb-4 bg-red-100 rounded-full p-4",
  modalText: "font-bold text-2xl text-gray-900 mb-3 text-center",
  modalText2: "text-gray-600 text-center mb-6 leading-relaxed",
  flexButtons: "flex gap-3 w-full"
}

function RowTable(props: Tarjeta & { onRefresh: () => void }) {
  const handleDelete = async (closeModal: () => void) => {
    try {
      closeModal();
      
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      
      const rowElement = document.querySelector(`[style*="row-${props.id}"]`) as HTMLElement;
      
      if (rowElement) {
        if (document.startViewTransition) {
          await document.startViewTransition(() => {
            rowElement.remove();
          }).finished;
        } else {
          rowElement.style.transition = 'all 0.3s ease-out';
          rowElement.style.opacity = '0';
          rowElement.style.transform = 'translateX(-20px) scale(0.95)';
          await new Promise(resolve => setTimeout(resolve, 300));
          rowElement.remove();
        }
        
        await deleteTarjeta(props.id);
        props.onRefresh();
      } else {
        await deleteTarjeta(props.id);
        props.onRefresh();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la tarjeta');
    }
  };
  return (
    <section
      className={STYLES.row}
      style={{ viewTransitionName: `row-${props.id}` }}
    >
      <div className={STYLES.grid}>
        <div className={STYLES.column}>
          <span className={STYLES.columnSpan}>{props.id}</span>
        </div>
        <div className={STYLES.column}>
          <span className={STYLES.columnSpan2}>{props.descripcion}</span>
        </div>
        <div className={STYLES.column}>
          <span className={STYLES.columnSpan}>{props.contador}</span>
        </div>
        <div className={STYLES.column}>
          {props?.fecha_creacion
            ? new Date(props.fecha_creacion).toISOString().split('T')[0]
            : '-'
          }
        </div>
        <div className={STYLES.actionColumn}>
          {props.id !== 0 ? (<div className="flex gap-2">
            <Modal
              buttonText=""
              buttonClassName={STYLES.buttonModal}
              icon={<Trash size={20} color="#fff" />}
            >
              {(closeModal) => (
                <div className={STYLES.deleteModal}>
                  <div className={STYLES.deleteIco}>
                    <Trash size={48} color="#dc2626" strokeWidth={2} />
                  </div>

                  <h2 className={STYLES.modalText}>
                    {MODAL_TEXTS.BORRAR}
                  </h2>

                  <p className={STYLES.modalText2}>
                    {MODAL_TEXTS.SEGURO}
                  </p>

                  <div className={STYLES.flexButtons}>
                    <button
                      className={STYLES.cancelButton}
                      onClick={closeModal}
                    >
                      {MODAL_TEXTS.CANCELAR}
                    </button>
                     <button
                      className={STYLES.deleteButton}
                      onClick={() => handleDelete(closeModal)}
                    >
                      {MODAL_TEXTS.ELIMINAR}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
            <Modal
              buttonText=""
              buttonClassName={STYLES.buttonModal}
              icon={<EyeIcon size={20} color="#fff" />}
              modalWidth={STYLES.modalWidth}
            >
              <div className={STYLES.modalContent}>
                <h2 className={STYLES.modalTitle}>{MODAL_TEXTS.DETAILS}</h2>

                <div className={STYLES.modalGrid}>
                  <div className={STYLES.imageContainer}>
                    {props.imagen ? (
                      <img
                        src={props.imagen}
                        alt={props.descripcion || "Imagen de tarjeta"}
                        className={STYLES.image}
                      />
                    ) : (
                      <div className={STYLES.imagePlaceholder}>
                        <span className={STYLES.imagePlaceholderText}>{MODAL_TEXTS.NO_IMAGE}</span>
                      </div>
                    )}
                  </div>

                  <div className={STYLES.infoSection}>
                    <div className={STYLES.inLine}>
                      <strong className={STYLES.infoLabel}>{MODAL_TEXTS.ID}</strong>
                      <p className={STYLES.infoText}>{props.id}</p>
                    </div>

                    <div>
                      <strong className={STYLES.infoLabel}>{MODAL_TEXTS.ENLACE}</strong>
                      <a
                        href={props.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={STYLES.link}
                      >
                        {props.enlace}
                      </a>
                    </div>

                    <div>
                      <strong className={STYLES.infoLabel}>{MODAL_TEXTS.DESCRIPCION}</strong>
                      <div className={STYLES.descriptionContainer}>
                        {props.descripcion}
                      </div>
                    </div>

                    <div>
                      <strong className={STYLES.infoLabel}>{MODAL_TEXTS.CONTADOR}</strong>
                      <p className={STYLES.infoText}>{props.contador}</p>
                    </div>

                    <div className={STYLES.inLine}>
                      <strong className={STYLES.infoLabel}>{MODAL_TEXTS.FECHA}</strong>
                      <p></p>{props?.fecha_creacion
                        ? new Date(props.fecha_creacion).toISOString().split('T')[0]
                        : '-'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>) : (

            <></>
          )}
        </div>
      </div>
    </section>
  )
}

export default RowTable
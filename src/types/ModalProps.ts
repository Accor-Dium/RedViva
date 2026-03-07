interface ModalProps {
  children: React.ReactNode | ((closeModal: () => void) => React.ReactNode);
  buttonText?: string;
  buttonClassName?: string;
  icon?: React.ReactNode;
}
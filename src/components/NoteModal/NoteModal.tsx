import { createPortal } from 'react-dom';
import css from './NoteModal.module.css';
import NoteForm from '../NoteForm/NoteForm';
import { useEffect } from 'react';

interface NoteModalProps {
  onClose: () => void;
}



export default function NoteModal({ onClose }: NoteModalProps) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div
    className={css.backdrop}
    role="dialog"
    aria-modal="true"
    onClick={onClose} // closes on backdrop click
  >
    <div
      className={css.modal}
      onClick={(e) => e.stopPropagation()} // prevent close when clicking inside modal
    >
      <NoteForm onClose={onClose} />
    </div>
  </div>,
  document.body
  );
}


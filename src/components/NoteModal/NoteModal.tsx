import { createPortal } from 'react-dom';
import css from './NoteModal.module.css';
import NoteForm from '../NoteForm/NoteForm';
import { useEffect } from 'react';
import type { NoteFormValues } from '../../types/note';

type NoteModalProps = {
  onClose: () => void;
  onCreate: (note: NoteFormValues) => void;
};



export default function NoteModal({ onClose, onCreate }: NoteModalProps) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

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
      <NoteForm onCancel={onClose} onSubmit={onCreate} />
    </div>
  </div>,
  document.body
  );
}


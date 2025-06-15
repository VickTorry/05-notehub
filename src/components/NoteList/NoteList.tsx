
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
   // NOTE: Handles cache update locally
   const queryClient = useQueryClient();

   // NOTE: Defines mutation inside the component
   const mutation = useMutation({
     mutationFn: deleteNote,
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['notes'] });
     },
   });
 
   const handleDelete = (id: number) => {
     mutation.mutate(id); // NOTE: Triggers API call
   };
  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button} onClick={() => handleDelete(note.id)} // NOTE: Internal handler
            disabled={mutation.isPending} 
          >
            {mutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

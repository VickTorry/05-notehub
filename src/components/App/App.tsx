import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query';
import { fetchNotes, deleteNote, createNote } from '../../services/noteService';
import { keepPreviousData } from '@tanstack/react-query';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import type { FetchNotesResponse } from '../../types/note';
import { useDebounce } from 'use-debounce';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import type { KeyboardEvent } from 'react';
import type { NoteFormValues } from '../../types/note';


const PER_PAGE = 12;



export default function App() {
  // const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchDebounced] = useDebounce(search, 500);
  const qc = useQueryClient();


  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, searchDebounced],
    queryFn: () => fetchNotes(page, PER_PAGE, searchDebounced),
    placeholderData: keepPreviousData,
  });

  console.log('Query data:', data);


  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
  
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
  
  const handleCreate = (note: NoteFormValues) => {
    createNoteMutation.mutate(note);
    setIsModalOpen(false);
  };


  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setIsModalOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    deleteNoteMutation.mutate(id);
  };




  return (
    <div className={css.app} onKeyDown={onKeyDown}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />
        {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          pageCount={data.totalPages}
          onPageChange={(p) => setPage(p)}
        />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data?.notes && data.notes.length > 0 ? (
      <NoteList notes={data.notes} onDelete={handleDelete} />
       ) : !isLoading ? (
      <p>No notes found.</p>
       ) : null}

      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />}
    </div>
  );
}

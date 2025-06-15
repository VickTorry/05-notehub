import { useState } from 'react';
import type {KeyboardEvent} from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import { keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import type { FetchNotesResponse } from '../../types/note';

import css from './App.module.css';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchDebounced] = useDebounce(search, 500);

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse, Error>({
    // ✅ Better caching with this order
    queryKey: ['notes', searchDebounced, page],
    queryFn: () => fetchNotes(page, PER_PAGE, searchDebounced),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setIsModalOpen(false);
  };

  return (
    <div className={css.app} onKeyDown={onKeyDown}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={data.totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && error instanceof Error && (
        <ErrorMessage message={error.message} />
      )}

      {data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : !isLoading ? (
        <p>No notes found.</p>
      ) : null}

      {isModalOpen && (
        <NoteModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

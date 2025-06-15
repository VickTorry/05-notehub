import axios from 'axios';
import type { Note, FetchNotesResponse } from '../types/note';



export const fetchNotes = async (
  page = 1,
  perPage = 12,
  search?: string
): Promise<FetchNotesResponse> => {
  const response = await axios.get('https://notehub-public.goit.study/api/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}), // only include search if it's not empty
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });

  return response.data;
};


export const createNote = async (note: {
  title: string;
  content: string;
  tag: Note['tag'];
}): Promise<Note> => {
  const response = await axios.post(
    'https://notehub-public.goit.study/api/notes',
    note,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data.data;
};

export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
};

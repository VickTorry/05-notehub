
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      forcePage={currentPage - 1}
      pageCount={pageCount}
      onPageChange={(sel) => onPageChange(sel.selected + 1)}
    />
  );
}

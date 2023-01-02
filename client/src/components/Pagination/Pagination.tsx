import React, {FC, useEffect} from 'react';
import ReactPaginate from 'react-paginate';

import classes from './pagination.module.scss';

type PaginationProps = {
  currentPage: number;
  onChangePage: (page: number) => void;
  pageCount: number;
};

const Pagination:FC<PaginationProps> = ({ currentPage, onChangePage, pageCount }) => {

    useEffect(() => {
      onChangePage(1)
    }, [pageCount]) 

    return (
      <ReactPaginate
        className={classes.pagination}
        breakLabel="..."
        nextLabel=">"
        onPageChange={(event) => onChangePage(event.selected+1)}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<"
        hrefBuilder={(page, pageCount, selected) =>
          page >= 1 && page <= pageCount ? `/page/${page}` : '#'
        }
        hrefAllControls
        forcePage={currentPage-1}
      />
    );
};

export default Pagination;
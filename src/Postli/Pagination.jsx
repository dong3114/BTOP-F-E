import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Pagination({ currentPage, totalPages, pageNumbers, paginate, goToPrevPage, goToNextPage, filteredPosts }) {
    return (
        filteredPosts.length > 0 && (
            <div className='pagination'>
                <button onClick={goToPrevPage} disabled={currentPage === 1}>
                    <IoIosArrowBack />
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    <IoIosArrowForward />
                </button>
            </div>
        )
    );
}

export default Pagination;
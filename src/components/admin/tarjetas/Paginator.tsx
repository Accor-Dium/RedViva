import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface PaginationG00Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function Paginator({ totalPages, currentPage, onPageChange }: PaginationG00Props) {
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }

  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; 
    
    if (totalPages <= maxVisible) {
      
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
  
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    
    return pages;
  };
  const STYLES = {
    paginatorContainer: "space-y-4 bg-white p-4 rounded-full shadow-md",
    paginationItem: "cursor-pointer",
    disabledButton: "pointer-events-none opacity-50",
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className={STYLES.paginatorContainer}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              text="Anterior"
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(currentPage - 1)
              }}
              className={currentPage === 1 ? STYLES.disabledButton : STYLES.paginationItem}
            />
          </PaginationItem>
          
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(page as number)
                  }}
                  className={STYLES.paginationItem}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              text="Siguiente"
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(currentPage + 1)
              }}
              className={currentPage === totalPages ? STYLES.disabledButton : STYLES.paginationItem}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
    </div>
  )
}

export default Paginator
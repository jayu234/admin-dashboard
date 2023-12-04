import { Button } from "@mui/material";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    return (
        <div className="pagination-container">
            <Button
                className="btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
                variant="contained"
                sx={{ textTransform: "none", mr: "1rem" }}
            >
                First
            </Button>
            <Button
                className="btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                variant="contained"
                sx={{ textTransform: "none", mr: "1rem" }}
            >
                Previous
            </Button>
            {pageNumbers.map((pageNumber) => (
                <Button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    disabled={pageNumber === currentPage}
                    variant={pageNumber === currentPage ? "outlined" : "contained"}
                    sx={{ textTransform: "none", mr: "1rem", ":disabled":{borderColor: "#1976D2", color: "GrayText"} }}
                >
                    {pageNumber}
                </Button>
            ))}
            <Button
                className="btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                variant="contained"
                sx={{ textTransform: "none", mr: "1rem" }}
            >
                Next
            </Button>
            <Button
                className="btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                variant="contained"
                sx={{ textTransform: "none", mr: "1rem" }}
            >
                Last
            </Button>
        </div>
    );
};

export default Pagination;
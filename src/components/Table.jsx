import { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, TextField, IconButton, Box, Typography } from '@mui/material';
import Pagination from './Pagination';
import { DeleteRounded, CheckRounded, CloseRounded, DriveFileRenameOutlineRounded } from '@mui/icons-material';

const columns = ["Id", "Name", "Email", "Role", "Actions"];

const MyTable = () => {

    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const [searchValue, setSearchValue] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const handleSelectRow = (rowId) => {
        const selectedIndex = selectedRows.indexOf(rowId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, rowId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1)
            );
        }

        setSelectedRows(newSelected);
    };

    const handleEditRow = (rowId) => {
        setEditingId(rowId);
        const rowToEdit = data.find((row) => row.id === rowId);
        setEditedData({ ...rowToEdit });
    };

    const handleEditChange = (e) => {
        setEditedData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const handleSaveRow = (rowId) => {
        const updatedData = data.map((row) => {
            if (row.id === rowId) {
                return { ...row, ...editedData };
            }
            return row;
        });
        setData(updatedData);
        setEditingId(null);
        setEditedData({});
    };
    const handleCancleEdit = () => {
        setEditingId(null);
        setEditedData({});
    }
    const handleDeleteRow = (rowId) => {
        const updatedData = data.filter((row) => row.id !== rowId);
        setData(updatedData);
        setSelectedRows(selectedRows.filter((selectedRow) => selectedRow !== rowId));
    };

    const handleDeleteSelected = () => {
        const updatedData = data.filter((row) => !selectedRows.includes(row.id));
        setData(updatedData);
        setSelectedRows([]);
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    const filteredData = data.filter((row) =>
        Object.values(row).some(
            (value) =>
                typeof value === 'string' &&
                value.toLowerCase().includes(searchValue.toLowerCase())
        )
    );
    const handleSelectAllOnPage = (checked) => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);

        const newSelectedRows = checked
            ? [
                ...new Set([
                    ...selectedRows,
                    ...filteredData.slice(startIndex, endIndex).map((row) => row.id),
                ]),
            ]
            : selectedRows.filter(
                (id) => !filteredData.slice(startIndex, endIndex).some((row) => row.id === id)
            );

        setSelectedRows(newSelectedRows);
    };
    useEffect(() => {
        fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
            .then(async (res) => {
                const data = await res.json();
                setData(data);
            }).catch((err) => {
                console.log(err);
            })
    }, [])
    return (
        <Box>
            {/* Search Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ minWidth: "255px", marginBottom: "1rem", position: "relative", display: "flex", flex: "1 1 0%", flexShrink: 0 }}>
                        <input type="text" id='filter-result' placeholder='Search' onChange={(e) => { handleSearch(e.target.value) }} />
                        <svg id='searchIcon' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                            <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                        </svg>
                    </div>
                </Box>
                {/* Button for deleting selected rows */}
                <IconButton disabled={!selectedRows.length} onClick={handleDeleteSelected} disableTouchRipple={true} sx={{ marginRight: "1rem", padding: "1rem", borderRadius: "5px" }}><DeleteRounded sx={{ color: "red[500]" }} /></IconButton>
            </Box>

            {/* Table Component */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                onChange={(e) => handleSelectAllOnPage(e.target.checked)}
                                indeterminate={
                                    selectedRows.length > 0 &&
                                    selectedRows.length < currentPage * rowsPerPage
                                }
                                checked={
                                    currentPage * rowsPerPage > 0 &&
                                    selectedRows.length === currentPage * rowsPerPage
                                }
                            />
                        </TableCell>
                        {columns.map((item, idx) => (<TableCell key={idx} sx={{ fontWeight: 600 }}>{item}</TableCell>))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.length > 0 && filteredData
                        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                        .map((row) => (
                            <TableRow key={row.id} sx={{ backgroundColor: selectedRows.includes(row.id) ? '#e8e8e8' : '' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedRows.includes(row.id)}
                                        onChange={() => handleSelectRow(row.id)}
                                    />
                                </TableCell>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>
                                    {editingId === row.id ? (
                                        <TextField
                                            value={editedData.name || row.name}
                                            name='name'
                                            onChange={handleEditChange}
                                            variant="standard"
                                            inputProps={{ style: { fontSize: "14px", } }}
                                        />
                                    ) : (
                                        row.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === row.id ? (
                                        <TextField
                                            value={editedData.email || row.email}
                                            name='email'
                                            onChange={handleEditChange}
                                            variant="standard"
                                            inputProps={{ style: { fontSize: "14px" } }}
                                        />
                                    ) : (
                                        row.email
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === row.id ? (
                                        <TextField
                                            value={editedData.role || row.role}
                                            name='role'
                                            onChange={handleEditChange}
                                            variant="standard"
                                            inputProps={{ style: { fontSize: "14px", width: "127px" } }}
                                        />
                                    ) : (
                                        row.role
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === row.id ? (
                                        <div>
                                            <IconButton
                                                className="save"
                                                onClick={() => handleSaveRow(row.id)}
                                            >
                                                <CheckRounded />
                                            </IconButton>
                                            <IconButton
                                                className="save"
                                                onClick={() => handleCancleEdit()}
                                            >
                                                <CloseRounded />
                                            </IconButton>
                                        </div>
                                    ) : (
                                        <div>
                                            <IconButton
                                                className="edit"
                                                onClick={() => handleEditRow(row.id)}
                                            >
                                                <DriveFileRenameOutlineRounded />
                                            </IconButton>
                                            <IconButton
                                                className="delete"
                                                onClick={() => handleDeleteRow(row.id)}
                                            >
                                                <DeleteRounded />
                                            </IconButton>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            {filteredData.length > 0 && <Pagination
                totalPages={Math.ceil(filteredData.length / rowsPerPage)}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />}
            {filteredData.length < 1 && <Typography textAlign={'center'} mt={2}>No data available.</Typography>}
        </Box>
    );
};

export default MyTable;

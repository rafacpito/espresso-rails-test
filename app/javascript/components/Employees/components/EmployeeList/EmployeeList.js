import {
  Box,
  Avatar,
  Typography,
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TablePagination
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useState } from 'react'
import { styles } from './styles.js'
import { DialogConfirmDeletion, DialogEditEmployee } from '../'

const EmployeeList = ({
  employees,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  refresh,
  setRefresh,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const [openDeletion, setOpenDeletion] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState()
  const [deleteEmployee, setDeleteEmployee] = useState({})
  const [openEdit, setOpenEdit] = useState(false)
  const [editEmployee, setEditEmployee] = useState({})

  const defineAvatarLetters = (employee) => {
    let splitName = employee.name.split(' ')

    if (splitName.length == 1) {
      if (splitName[0].length == 1) return splitName[0][0].toUpperCase()
      return `${splitName[0][0]}${splitName[0][1]}`.toUpperCase()
    }

    return `${splitName[0][0]}${splitName[1][0]}`.toUpperCase()
  }

  const openDialogConfirmDeletion = (employee, index) => {
    setDeleteEmployee(employee)
    setDeleteIndex(index)
    setOpenDeletion(true)
  }

  const openDialogEditEmployee = (employee) => {
    setEditEmployee(employee)
    setOpenEdit(true)
  }

  const handleChangePage = (newPage) => {
    setPage(newPage + 1);
  }

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(parseInt(value, 10))
    setPage(1)
  }

  return (
    <Box mt={6}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {employees?.length === 0 ? (

            <TableRow>
              <TableCell>Até o momento, não há funcionários cadastrados.</TableCell>
            </TableRow>
          ) : (
            ''
          )}
          {employees?.map((employee, index) => (
            <TableRow
              key={employee.id}
            >
              <TableCell scope="row" sx={{ width: '5px', paddingRight: '0' }}>
                <Avatar data-testid={`avatar-${employee.id}`} children={defineAvatarLetters(employee)} />
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    {employee.name}
                  </Typography>
                  <Typography variant='body2'>
                    {employee.email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant='outlined'
                  size="small"
                  onClick={() =>
                    openDialogEditEmployee(employee)
                  }
                  style={styles.editButton}
                >
                  <Box mr={1}>
                    Editar
                  </Box>
                  <EditIcon fontSize='small' />
                </Button>
                <Button
                  color="error"
                  variant='outlined'
                  size="small"
                  onClick={() =>
                    openDialogConfirmDeletion(employee, index)
                  }
                  style={styles.button}
                >
                  <Box mr={1}>
                    Deletar
                  </Box>
                  <DeleteIcon fontSize='small' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={"Quantidade por página:"}
        component="div"
        count={100}
        page={page - 1}
        onPageChange={(e, number) => { handleChangePage(number) }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { handleChangeRowsPerPage(e.target.value) }}
      />
      <DialogConfirmDeletion
        open={openDeletion}
        setOpen={setOpenDeletion}
        employee={deleteEmployee}
        index={deleteIndex}
        employees={employees}
        page={page}
        setPage={setPage}
        refresh={refresh}
        setRefresh={setRefresh}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
        setOpenErrorSnackbar={setOpenErrorSnackbar}
        setErrorMessage={setErrorMessage}
      />
      <DialogEditEmployee
        open={openEdit}
        setOpen={setOpenEdit}
        refresh={refresh}
        setRefresh={setRefresh}
        employee={editEmployee}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
        setOpenErrorSnackbar={setOpenErrorSnackbar}
        setErrorMessage={setErrorMessage}
      />
    </Box>
  )
}

export default EmployeeList
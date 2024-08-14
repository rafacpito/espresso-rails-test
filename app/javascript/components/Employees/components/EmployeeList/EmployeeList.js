import {
  Box,
  Avatar,
  Typography,
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody
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
  setEmployees,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const [openDeletion, setOpenDeletion] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState()
  const [deleteEmployee, setDeleteEmployee] = useState({})
  const [openEdit, setOpenEdit] = useState(false)
  const [editIndex, setEditIndex] = useState()
  const [editEmployee, setEditEmployee] = useState({})

  const defineAvatarLetters = (employee) => {
    let splitName = employee.name.split(' ')

    if (splitName.length == 1) {
      return `${splitName[0][0]}${splitName[0][1]}`.toUpperCase()
    }

    return `${splitName[0][0]}${splitName[1][0]}`.toUpperCase()
  }

  const openDialogConfirmDeletion = (employee, index) => {
    setDeleteEmployee(employee)
    setDeleteIndex(index)
    setOpenDeletion(true)
  }

  const openDialogEditEmployee = (employee, index) => {
    setEditEmployee(employee)
    setEditIndex(index)
    setOpenEdit(true)
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
                <Avatar children={defineAvatarLetters(employee)} />
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
                    openDialogEditEmployee(employee, index)
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
      <DialogConfirmDeletion
        open={openDeletion}
        setOpen={setOpenDeletion}
        employee={deleteEmployee}
        index={deleteIndex}
        setEmployees={setEmployees}
        employees={employees}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
      />
      <DialogEditEmployee
        open={openEdit}
        setOpen={setOpenEdit}
        employee={editEmployee}
        index={editIndex}
        setEmployees={setEmployees}
        employees={employees}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
        setOpenErrorSnackbar={setOpenErrorSnackbar}
        setErrorMessage={setErrorMessage}
      />
    </Box>
  )
}

export default EmployeeList
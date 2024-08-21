import React from 'react'
import Layout from '../Layout'
import { useEffect, useState } from 'react'
import { EmployeeList, DialogCreateEmployee } from './components'
import {
  Box,
  Typography,
  Container,
  Button,
  Alert,
  IconButton,
  Snackbar
} from '@mui/material'
import {
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import axios from 'axios'
import helpers from '../../helpers'

const Main = (props) => {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
  const [erroMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [employees, setEmployees] = useState([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    axios.get(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=${rowsPerPage}&page=${page}`).then((response) => {
      setEmployees(response.data.users)
    })
  }, [rowsPerPage, page, refresh])

  return (
    <Layout user={props.user}>
      <Container>
        <Box mt={6} display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant="h4">Funcionários</Typography>
          <Button
            variant='contained'
            onClick={() => { setOpen(true) }}
          >
            Cadastrar Funcionário <AddIcon />
          </Button>
        </Box>

        <EmployeeList
          employees={employees}
          setEmployees={setEmployees}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          refresh={refresh}
          setRefresh={setRefresh}
          setOpenSuccessSnackbar={setOpenSuccessSnackbar}
          setSuccessMessage={setSuccessMessage}
          setOpenErrorSnackbar={setOpenErrorSnackbar}
          setErrorMessage={setErrorMessage}
        />

        <DialogCreateEmployee
          open={open}
          setOpen={setOpen}
          user={props.user}
          refresh={refresh}
          setRefresh={setRefresh}
          setOpenErrorSnackbar={setOpenErrorSnackbar}
          setOpenSuccessSnackbar={setOpenSuccessSnackbar}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />

        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={4000}
          onClose={() => { setOpenErrorSnackbar(false) }}
        >
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                data-testid="close-alert"
                onClick={() => {
                  setOpenErrorSnackbar(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {erroMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={4000}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Layout >
  )
}

export default Main
import React from 'react'
import Layout from '../Layout'
import { useEffect, useState } from 'react'
import { CardList, DialogCreateCard } from './components'
import axios from 'axios'
import {
  Box,
  Typography,
  Container,
  Button,
  Alert,
  Snackbar
} from '@mui/material'
import {
  Add as AddIcon,
} from '@mui/icons-material'

const Main = (props) => {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
  const [erroMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [cards, setCards] = useState([])
  const [open, setOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    axios.get(`http://localhost:3000/cards?per_page=${rowsPerPage}&page=${page}`).then((response) => {
      if (response.status == 200) {
        setCards(response.data.cards)
      }
    }).catch(error => console.log(error.message))

    axios.get('http://localhost:3000/employees').then((response) => {
      if (response.status == 200) {
        setEmployees(response.data.users)
      }
    }).catch(error => console.log(error.message))
  }, [rowsPerPage, page, refresh])

  return (
    <Layout user={props.user}>
      <Container>
        <Box mt={6} display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant="h4">Cartões</Typography>
          <Button
            variant='contained'
            onClick={() => { setOpen(true) }}
          >
            Cadastrar Cartão <AddIcon />
          </Button>
        </Box>

        <CardList
          cards={cards}
          setCards={setCards}
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

        <DialogCreateCard
          open={open}
          setOpen={setOpen}
          employees={employees}
          refresh={refresh}
          setRefresh={setRefresh}
          setOpenErrorSnackbar={setOpenErrorSnackbar}
          setOpenSuccessSnackbar={setOpenSuccessSnackbar}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />

        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={6000}
          onClose={() => { setOpenErrorSnackbar(false) }}
        >
          <Alert
            onClose={() => { setOpenErrorSnackbar(false) }}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {erroMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={6000}
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
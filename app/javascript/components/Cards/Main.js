import React from 'react'
import Layout from '../Layout'
import { useEffect, useState } from 'react'
import { CardList, DialogCreateCard } from './components'
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

  useEffect(() => {
    fetch('http://localhost:3000/cards', {
      method: "GET"
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((response) => {
      setCards(response.cards)
    }).catch(error => console.log(error.message))

    fetch('http://localhost:3000/employees', {
      method: "GET"
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((response) => {
      setEmployees(response.users)
    }).catch(error => console.log(error.message))
  }, [])

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
          setOpenSuccessSnackbar={setOpenSuccessSnackbar}
          setSuccessMessage={setSuccessMessage}
          setOpenErrorSnackbar={setOpenErrorSnackbar}
          setErrorMessage={setErrorMessage}
        />

        <DialogCreateCard
          open={open}
          setOpen={setOpen}
          user={props.user}
          cards={cards}
          setCards={setCards}
          employees={employees}
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
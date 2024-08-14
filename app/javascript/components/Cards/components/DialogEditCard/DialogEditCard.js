import { useEffect } from 'react'
import {
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Box
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import { useForm } from "react-hook-form"
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'

const DialogEditCard = ({
  open,
  setOpen,
  cards,
  setCards,
  setOpenErrorSnackbar,
  setOpenSuccessSnackbar,
  setErrorMessage,
  setSuccessMessage,
  card,
  index
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset(card);
  }, [card]);

  const onSubmit = (data) => {
    fetch(`http://localhost:3000/cards/${card.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        card: {
          user_email: data.email
        }
      })
    }).then(async response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) })
      }
      else {
        setSuccessMessage('Funcionário associado ao cartão editado com sucesso!')
        setOpenSuccessSnackbar(true)
        return response.json()
      }
    }).then(response => {
      cards.splice(index, 1, response.card)
      setCards(cards)
      setOpen(false)
      reset()
      setTimeout(() => {
        setOpenSuccessSnackbar(false)
      }, "3000")
    }).catch(error => {
      setErrorMessage(JSON.parse(error.message).error.message)
      setOpenErrorSnackbar(true)
    })
  }

  return (
    <Dialog
      open={open}
      onClose={() => { setOpen(false) }}
      fullWidth
      width="lg"
    >
      <DialogTitle>
        Associar funcionário
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => { setOpen(false) }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ paddingTop: '0px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin='normal'
            name='email'
            label='E-mail'
            type='email'
            id='email'
            autoFocus
            fullWidth
            required
            {...register("email")}
            error={!!errors?.email}
            helperText={errors?.email?.message}
          />
          <Box mt={3}>
            <Button variant='contained' type='submit' autoFocus>
              Editar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog >
  )
}

export default DialogEditCard
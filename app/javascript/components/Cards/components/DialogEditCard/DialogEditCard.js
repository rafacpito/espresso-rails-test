import { useEffect } from 'react'
import {
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  setRef
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import axios from 'axios'
import { useForm } from "react-hook-form"
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'

const DialogEditCard = ({
  open,
  setOpen,
  card,
  refresh,
  setRefresh,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
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
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    axios.put(`http://localhost:3000/cards/${card.id}`,
      JSON.stringify({
        card: {
          user_email: data.email
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf
        },
      }).then(response => {
        if (response.status == 200) {
          setSuccessMessage('Funcionário associado ao cartão editado com sucesso!')
          setOpenSuccessSnackbar(true)
          setRefresh(refresh + 1)
          setOpen(false)
          reset()
          setTimeout(() => {
            setOpenSuccessSnackbar(false)
          }, "3000")
        }
      }).catch(error => {
        setErrorMessage(error.response.data.error.message)
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
import { useEffect } from 'react'
import {
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import axios from 'axios'
import { useForm } from "react-hook-form"
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import helpers from '../../../../helpers'

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

    axios.put(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards/${card.id}`,
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
      }).then(() => {
        setSuccessMessage('Funcionário associado ao cartão editado com sucesso!')
        setOpenSuccessSnackbar(true)
        setRefresh(refresh + 1)
        setOpen(false)
        reset()
        setTimeout(() => {
          setOpenSuccessSnackbar(false)
        }, "3000")
      }).catch(error => {
        if (error?.response?.data?.error?.message != undefined) {
          setErrorMessage(error.response.data.error.message)
        } else {
          setErrorMessage("Erro interno")
        }
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
        data-testid="close-edit-dialog"
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
            inputProps={{
              "data-testid": "user-email-input",
            }}
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
            <Button data-testid="edit-button" variant='contained' type='submit' autoFocus>
              Editar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog >
  )
}

export default DialogEditCard
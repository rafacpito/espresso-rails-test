import { useState } from 'react'
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
import axios from 'axios'

const DialogCreateEmployee = ({
  open,
  setOpen,
  refresh,
  setRefresh,
  setOpenErrorSnackbar,
  setOpenSuccessSnackbar,
  setErrorMessage,
  setSuccessMessage
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    axios.post('http://localhost:3000/categories/create',
      JSON.stringify({
        category: {
          name: data.name,
        }
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        if (response.status == 201) {
          setSuccessMessage('Categoria criado com sucesso!')
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
        Cadastrar categoria
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
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant='body1'>Informe os dados</Typography>
          <TextField
            margin='normal'
            name='name'
            label='Nome'
            type='name'
            id='name'
            autoFocus
            fullWidth
            required
            {...register("name")}
            error={!!errors?.name}
            helperText={errors?.name?.message}
          />
          <Box mt={3}>
            <Button variant='contained' type='submit' autoFocus>
              Cadastrar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog >
  )
}

export default DialogCreateEmployee
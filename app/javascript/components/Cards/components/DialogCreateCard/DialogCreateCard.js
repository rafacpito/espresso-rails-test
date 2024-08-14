import { useState } from 'react'
import {
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Select,
  MenuItem
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import { useForm, Controller } from "react-hook-form"
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'

const DialogCreateCard = ({
  open,
  setOpen,
  cards,
  setCards,
  employees,
  setOpenErrorSnackbar,
  setOpenSuccessSnackbar,
  setErrorMessage,
  setSuccessMessage
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    fetch('http://localhost:3000/cards/create', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        card: {
          last4: data.last4,
          user_id: data.user_id,
        }
      })
    }).then(async response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) })
      }
      else {
        setSuccessMessage('Cartão criado com sucesso!')
        setOpenSuccessSnackbar(true)
        return response.json()
      }
    }).then(response => {
      setCards([...cards, response.card])
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
        Cadastrar cartão
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
            name='last4'
            label='Nome'
            type='last4'
            id='last4'
            autoFocus
            fullWidth
            required
            {...register("last4")}
            error={!!errors?.last4}
            helperText={errors?.last4?.message}
          />
          <Controller
            render={({ }) => (
              <TextField
                {...register('user_id')}
                select // tell TextField to render select
                label="Funcionário"
                fullWidth
                defaultValue={[]}
                required
              >
                <MenuItem disabled value="">
                  <em>Funcionário</em>
                </MenuItem>
                {employees.map((employee) =>
                  <MenuItem key={employee.id} value={employee.id}>{employee.name}</MenuItem>
                )}
              </TextField>
            )}
            name='user_id'
            control={control}
            label='Funcionário'
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

export default DialogCreateCard
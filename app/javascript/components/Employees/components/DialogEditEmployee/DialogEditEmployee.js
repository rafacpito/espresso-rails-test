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

const DialogEditEmployee = ({
  open,
  setOpen,
  employees,
  setEmployees,
  setOpenErrorSnackbar,
  setOpenSuccessSnackbar,
  setErrorMessage,
  setSuccessMessage,
  employee,
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
    reset(employee);
  }, [employee]);

  const onSubmit = (data) => {
    fetch(`http://localhost:3000/users/${employee.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          name: data.name,
          email: data.email
        }
      })
    }).then(async response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) })
      }
      else {
        setSuccessMessage('Funcionário editado com sucesso!')
        setOpenSuccessSnackbar(true)
        return response.json()
      }
    }).then(response => {
      employees.splice(index, 1, response.user)
      setEmployees(employees)
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
    >
      <DialogTitle>
        Editar funcionário
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

export default DialogEditEmployee
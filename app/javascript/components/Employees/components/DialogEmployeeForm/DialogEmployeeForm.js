import {
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import { useForm } from "react-hook-form"
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'

const DialogEmployeeForm = ({ open, setOpen }) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    fetch('http://localhost:3000/users/create', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          name: data.name,
          email: data.email,
          role: 2
        }
      })
    }).then(async response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) })
      }
      else {
        setOpenSuccessSnackbar(true)
        setTimeout(() => {
          window.location.href = '/'
        }, "3000");
        return response.json()
      }
    })
      .catch(error => {
        setMessage(JSON.parse(error.message).error.message)
        setOpenErrorSnackbar(true)
      })
  }

  return (
    <Dialog
      open={open}
      onClose={() => { setOpen(false) }}
    >
      <DialogTitle>
        Cadastrar funcionário
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => { setOpen(false) }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent component='form' onSubmit={handleSubmit(onSubmit)}>
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
            Cadastrar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default DialogEmployeeForm
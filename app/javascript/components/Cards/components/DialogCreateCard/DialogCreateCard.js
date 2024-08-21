import {
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  MenuItem
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import axios from 'axios'
import { useForm } from "react-hook-form"
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import helpers from '../../../../helpers'


const DialogCreateCard = ({
  open,
  setOpen,
  employees,
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    axios.post(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards`,
      JSON.stringify({
        card: {
          last4: data.last4,
          user_id: data.user_id,
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf
        },
      }).then(() => {
        setSuccessMessage('Cartão criado com sucesso!')
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
        Cadastrar cartão
      </DialogTitle>
      <IconButton
        data-testid="close-dialog"
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
            label='Últimos 4 digitos do cartão'
            type='text'
            inputProps={{
              "data-testid": "last4-input",
            }}
            autoFocus
            fullWidth
            {...register("last4")}
            error={!!errors?.last4}
            helperText={errors?.last4?.message}
          />
          <TextField
            name='user_id'
            {...register('user_id')}
            select
            label="Funcionário"
            inputProps={{
              "data-testid": "user-id-input",
            }}
            fullWidth
            defaultValue={[]}
            error={!!errors?.user_id}
            helperText={errors?.user_id?.message}
          >
            <MenuItem disabled value="">
              <em>Funcionário</em>
            </MenuItem>
            {employees.map(employee => (
              <MenuItem key={employee.id} value={employee.id}>{employee.name}</MenuItem>
            ))}
          </TextField>
          <Box mt={3}>
            <Button data-testid="create-card" variant='contained' type='submit' autoFocus>
              Cadastrar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog >
  )
}

export default DialogCreateCard
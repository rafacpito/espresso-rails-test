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
import helpers from '../../../../helpers'

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
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    axios.post(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories`,
      JSON.stringify({
        category: {
          name: data.name,
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf
        },
      }).then(() => {
        setSuccessMessage('Categoria criada com sucesso!')
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
        Cadastrar categoria
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
            inputProps={{
              "data-testid": "name-input",
            }}
            margin='normal'
            name='name'
            label='Nome'
            type='name'
            id='name'
            autoFocus
            fullWidth
            {...register("name")}
            error={!!errors?.name}
            helperText={errors?.name?.message}
          />
          <Box mt={3}>
            <Button data-testid="create-category-button" variant='contained' type='submit' autoFocus>
              Cadastrar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog >
  )
}

export default DialogCreateEmployee
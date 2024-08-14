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

const DialogEditCategory = ({
  open,
  setOpen,
  categories,
  setCategories,
  setOpenErrorSnackbar,
  setOpenSuccessSnackbar,
  setErrorMessage,
  setSuccessMessage,
  category,
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
    reset(category);
  }, [category]);

  const onSubmit = (data) => {
    fetch(`http://localhost:3000/categories/${category.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          name: data.name
        }
      })
    }).then(async response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) })
      }
      else {
        setSuccessMessage('Categoria editada com sucesso!')
        setOpenSuccessSnackbar(true)
        return response.json()
      }
    }).then(response => {
      categories.splice(index, 1, response.category)
      setCategories(categories)
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
        Editar categoria
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
              Editar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog >
  )
}

export default DialogEditCategory
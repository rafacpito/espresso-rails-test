import { useState } from 'react'
import {
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Box
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'

const DialogConfirmDeletion = ({
  open,
  setOpen,
  category,
  index,
  setCategories,
  categories,
  setOpenSuccessSnackbar,
  setSuccessMessage
}) => {
  const deleteUser = () => {
    fetch(`http://localhost:3000/categories/${category.id}`, {
      method: "DELETE"
    }).then((response) => {
      if (response.ok) {
        categories.splice(index, 1)
        setCategories(categories)
        setSuccessMessage('Categoria deletada com sucesso!')
        setOpenSuccessSnackbar(true)
        setTimeout(() => {
          setOpenSuccessSnackbar(false)
        }, 3000)
        setOpen(false)
        return response.json();
      }
    }).catch(error => console.log(error.message));
  }

  return (
    <Dialog
      open={open}
      onClose={() => { setOpen(false) }}
    >
      <DialogTitle>
        Deletar categoria
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
        <Typography variant='body1'>Deletar categoria?</Typography>
        <Box mt={3}>
          <Button variant='outlined' onClick={() => { setOpen(false) }} autoFocus sx={{ marginRight: '10px' }}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={() => { deleteUser(index) }} autoFocus>
            Confirmar
          </Button>
        </Box>
      </DialogContent>
    </Dialog >
  )
}

export default DialogConfirmDeletion
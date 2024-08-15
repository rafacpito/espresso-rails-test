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
import axios from 'axios'

const DialogConfirmDeletion = ({
  open,
  setOpen,
  category,
  index,
  categories,
  page,
  setPage,
  refresh,
  setRefresh,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const deleteCategory = () => {
    axios.delete(`http://localhost:3000/categories/${category.id}`).then((response) => {
      if (response.status == 200) {
        if (categories.length == 1 & page > 1) setPage(page - 1)
        setRefresh(refresh + 1)
        setSuccessMessage('Categoria deletado com sucesso!')
        setOpenSuccessSnackbar(true)
        setTimeout(() => {
          setOpenSuccessSnackbar(false)
        }, 3000)
        setOpen(false)
      } else {
        return response.text().then(text => { throw new Error(text) })
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
          <Button variant='contained' onClick={() => { deleteCategory(index) }} autoFocus>
            Confirmar
          </Button>
        </Box>
      </DialogContent>
    </Dialog >
  )
}

export default DialogConfirmDeletion
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
  employee,
  index,
  employees,
  page,
  setPage,
  refresh,
  setRefresh,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const deleteUser = () => {
    axios.delete(`http://localhost:3000/users/${employee.id}`).then((response) => {
      if (response.status == 200) {
        if (employees.length == 1 & page > 1) setPage(page - 1)
        setRefresh(refresh + 1)
        setSuccessMessage('Funcionário deletado com sucesso!')
        setOpenSuccessSnackbar(true)
        setTimeout(() => {
          setOpenSuccessSnackbar(false)
        }, 3000)
        setOpen(false)
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
        Deletar funcionário
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
        <Typography variant='body1'>Deletar funcionário?</Typography>
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
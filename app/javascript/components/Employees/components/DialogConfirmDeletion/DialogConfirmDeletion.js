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
  employee,
  index,
  setEmployees,
  employees,
  setOpenSuccessSnackbar,
  setSuccessMessage
}) => {
  const deleteUser = () => {
    fetch(`http://localhost:3000/users/${employee.id}`, {
      method: "DELETE"
    }).then((response) => {
      if (response.ok) {
        // remove 1 funcionário e atualiza o state de funcionários para a nova lista
        employees.splice(index, 1)
        setEmployees(employees)
        // abre a snackbar e define a mensagem
        setSuccessMessage('Funcionário deletado com sucesso!')
        setOpenSuccessSnackbar(true)
        // fecha a snackbar em 3 segundos e fecha a dialog
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
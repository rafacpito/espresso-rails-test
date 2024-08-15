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
import axios from 'axios'
import {
  Close as CloseIcon
} from '@mui/icons-material'

const DialogConfirmDeletion = ({
  open,
  setOpen,
  card,
  index,
  cards,
  page,
  setPage,
  refresh,
  setRefresh,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const deleteCard = () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    axios.delete(`http://localhost:3000/cards/${card.id}`, {
      headers: {
        'X-CSRF-Token': csrf
      },
    }).then((response) => {
      if (response.status == 200) {
        if (cards.length == 1 & page > 1) setPage(page - 1)
        setRefresh(refresh + 1)
        setSuccessMessage('Cartão deletado com sucesso!')
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
        Deletar cartão
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
        <Typography variant='body1'>Deletar cartão?</Typography>
        <Box mt={3}>
          <Button variant='outlined' onClick={() => { setOpen(false) }} autoFocus sx={{ marginRight: '10px' }}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={() => { deleteCard(index) }} autoFocus>
            Confirmar
          </Button>
        </Box>
      </DialogContent>
    </Dialog >
  )
}

export default DialogConfirmDeletion
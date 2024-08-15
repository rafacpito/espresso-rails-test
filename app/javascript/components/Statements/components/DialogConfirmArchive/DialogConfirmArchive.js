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

const DialogConfirmArchive = ({
  open,
  setOpen,
  statement,
  index,
  statements,
  refresh,
  setRefresh,
  page,
  setPage,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const archiveStatement = () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    axios.delete(`http://localhost:3000/statements/${statement.id}`, {
      headers: {
        'X-CSRF-Token': csrf
      },
    }).then((response) => {
      if (response.status == 200) {
        if (statements.length == 1 & page > 1) setPage(page - 1)
        setRefresh(refresh + 1)
        setSuccessMessage('Despesa arquivada com sucesso!')
        setOpenSuccessSnackbar(true)
        setTimeout(() => {
          setOpenSuccessSnackbar(false)
        }, 3000)
        setOpen(false)
      }
    }).catch(error => {
      setErrorMessage(error.response.data.error.message)
      setOpenErrorSnackbar(true)
      setOpen(false)
    })
  }

  return (
    <Dialog
      open={open}
      onClose={() => { setOpen(false) }}
    >
      <DialogTitle>
        Arquivar despesa
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
        <Typography variant='body1'>Ao arquivar a despesa ela será movida para a aba "Arquivadas".</Typography>
        <Box mt={3}>
          <Button variant='contained' onClick={() => { archiveStatement(index) }} autoFocus>
            Arquivar
          </Button>
        </Box>
      </DialogContent>
    </Dialog >
  )
}

export default DialogConfirmArchive
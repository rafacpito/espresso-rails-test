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
import helpers from '../../../../helpers'

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
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    axios.delete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories/${category.id}`, {
      headers: {
        'X-CSRF-Token': csrf
      },
    }).then(() => {
      if (categories.length == 1 & page > 1) setPage(page - 1)
      setRefresh(refresh + 1)
      setSuccessMessage('Categoria deletado com sucesso!')
      setOpenSuccessSnackbar(true)
      setTimeout(() => {
        setOpenSuccessSnackbar(false)
      }, 3000)
      setOpen(false)
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
    >
      <DialogTitle>
        Deletar categoria
      </DialogTitle>
      <IconButton
        data-testid="close-delete-dialog"
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
          <Button data-testid="confirm-click" variant='contained' onClick={() => { deleteCategory(index) }} autoFocus>
            Confirmar
          </Button>
        </Box>
      </DialogContent>
    </Dialog >
  )
}

export default DialogConfirmDeletion
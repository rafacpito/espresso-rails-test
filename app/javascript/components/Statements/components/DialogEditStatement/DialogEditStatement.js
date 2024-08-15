import { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Box
} from '@mui/material'
import axios from 'axios'
import {
  Close as CloseIcon,
  UploadFile as UploadFileIcon
} from '@mui/icons-material'
import { useForm, Controller } from "react-hook-form"
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'

const DialogEditStatement = ({
  open,
  setOpen,
  statement,
  categories,
  refresh,
  setRefresh,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const [fileName, setFileName] = useState('')
  const [files, setFiles] = useState([])

  useEffect(() => {
    setFileName(`${statement?.attachment?.file?.original_filename}.${statement?.attachment?.file?.original_extension}`)
  }, [statement])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      category_id: statement?.category?.id || ''
    },
    resolver: yupResolver(schema)
  })

  const onSubmit = (data) => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    const formData = new FormData()
    formData.append('statement[category_id]', data.category_id)
    formData.append('statement[file]', files[0])
    axios.put(`http://localhost:3000/statements/${statement.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRF-Token': csrf
      },
    }).then(response => {
      if (response.status == 200) {
        setSuccessMessage('Comprovante vinculado a despesa e categoria definida.')
        setOpenSuccessSnackbar(true)
        setRefresh(refresh + 1)
        setOpen(false)
        reset()
        setTimeout(() => {
          setOpenSuccessSnackbar(false)
        }, "3000")
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
      fullWidth
      width="lg"
    >
      <DialogTitle>
        Editar despesa
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
          <Typography variant='body1' sx={{ marginBottom: '10px' }}>Faça o upload do comprovante da despesa (.jpeg, .png ou .pdf)</Typography>
          <TextField
            type="text"
            label="Carregar imagem"
            fullWidth
            disabled
            value={fileName || ''}
            InputProps={{
              endAdornment: (
                <IconButton component="label">
                  <UploadFileIcon />
                  <input
                    {...register('file')}
                    styles={{ display: "none" }}
                    type="file"
                    hidden
                    name="file"
                    accept='.pdf, .jpeg, .png'
                    onChange={(e) => {
                      setFiles(e.target.files)
                      setFileName(e.target.files[0].name)
                    }}
                  />
                </IconButton>
              ),
            }}
          />
          <Typography variant='body1' sx={{ marginY: '10px' }}>Escolha a categoria da despesa</Typography>
          <Controller
            render={({ }) => (
              <TextField
                {...register('category_id')}
                select
                label="Selecione"
                fullWidth
                required
                defaultValue={statement?.category?.id}
              >
                <MenuItem disabled value="">
                  <em>Categoria</em>
                </MenuItem>
                {categories.map((category) =>
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                )}
              </TextField>
            )}
            name='category_id'
            control={control}
            label='Funcionário'
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

export default DialogEditStatement
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
import helpers from '../../../../helpers'

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
    if (open == true) {
      if (statement.attachment != null) setFileName(`${statement?.attachment?.file?.original_filename}.${statement?.attachment?.file?.original_extension}`)
      if (statement?.category?.id == undefined) {
        setValue('category_id', '')
      } else {
        setValue('category_id', statement.category.id)
      }
    }
  }, [open])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      category_id: ''
    },
    resolver: yupResolver(schema)
  })

  const onSubmit = (data) => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    const formData = new FormData()
    formData.append('statement[category_id]', data.category_id)
    formData.append('statement[file]', files[0])
    axios.put(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/${statement.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRF-Token': csrf
      },
    }).then(() => {
      reset()
      setFileName('')
      setSuccessMessage('Comprovante vinculado a despesa e categoria definida.')
      setOpenSuccessSnackbar(true)
      setRefresh(refresh + 1)
      setOpen(false)
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
      onClose={() => {
        reset()
        setFileName('')
        setOpen(false)
      }}
      fullWidth
      width="lg"
    >
      <DialogTitle>
        Editar despesa
      </DialogTitle>
      <IconButton
        data-testid="close-edit-dialog"
        aria-label="close"
        onClick={() => {
          reset()
          setFileName('')
          setOpen(false)
        }}
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
                    data-testid="file-input"
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
                inputProps={{
                  "data-testid": "category-id-input",
                }}
                {...register('category_id')}
                select
                label="Selecione"
                fullWidth
                required
                value={getValues("category_id")}
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
            <Button data-testid="edit-statement-button" variant='contained' type='submit' autoFocus>
              Editar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog >
  )
}

export default DialogEditStatement
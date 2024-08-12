import React from 'react'
import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material'
import { useForm } from "react-hook-form"
import { styles } from './styles.js'
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'

const SignUp = () => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  })
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
  const [message, setMessage] = useState('')
  const cnpjValue = watch("cnpj")

  const normalizeCnpjNumber = (value) => {
    if (!value) return ''

    return value.replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  useEffect(() => {
    setValue("cnpj", normalizeCnpjNumber(cnpjValue))
  }, [cnpjValue])

  const onSubmit = (data) => {
    fetch('http://localhost:3000/users/create', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          name: data.name,
          email: data.email,
          password: data.password,
          companyName: data.companyName,
          cnpj: data.cnpj,
          role: 1
        }
      })
    }).then(async response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) })
      }
      else {
        setOpenSuccessSnackbar(true)
        setTimeout(() => {
          window.location.href = '/'
        }, "3000");
        return response.json()
      }
    })
      .catch(error => {
        setMessage(JSON.parse(error.message).error.message)
        setOpenErrorSnackbar(true)
      })
  }

  const handleClose = () => {
    setOpenErrorSnackbar(false)
  }

  return (
    <React.Fragment>
      <Container style={styles.root} maxWidth={false}>
        <Box display='flex' justifyContent='center'>
          <Box
            height={100}
            width={200}
            display='flex'
            alignItems='flex-end'
          >
            <img src='https://cdn.prod.website-files.com/6508b54accf2fa0ede086e1a/6511d4247a3cea68ae1f3e74_Marca%20Espresso%20Branca.svg' />
          </Box>
        </Box>

        <Box
          mt={8}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            backgroundColor='white'
            mt={1}
            padding={2}
            borderRadius={1}
            display='flex'
            flexDirection='column'
            width='30%'
          >
            <Typography variant="h5">Criar conta</Typography>
            <Box mt={5}>
              <Typography>Informe os seus dados pessoais</Typography>
            </Box>
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
            <TextField
              margin='normal'
              name='email'
              label='E-mail'
              type='email'
              id='email'
              autoFocus
              fullWidth
              required
              {...register("email")}
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
            <TextField
              margin='normal'
              name='password'
              label='Senha'
              type='password'
              id='password'
              autoComplete='current-password'
              fullWidth
              required
              {...register("password")}
              error={!!errors?.password}
              helperText={errors?.password?.message}
            />
            <TextField
              margin='normal'
              name='companyName'
              label='Nome da empresa'
              type='companyName'
              id='companyName'
              autoFocus
              fullWidth
              required
              {...register("companyName")}
              error={!!errors?.companyName}
              helperText={errors?.companyName?.message}
            />
            <TextField
              margin='normal'
              name='cnpj'
              label='CNPJ'
              type='cnpj'
              id='cnpj'
              autoFocus
              fullWidth
              required
              {...register("cnpj")}
              error={!!errors?.cnpj}
              helperText={errors?.cnpj?.message}
            />
            <Box>
              <Button
                type='submit'
                variant='contained'
                sx={{ mt: 3, mb: 2, mr: 1 }}
              >
                Criar conta
              </Button>
            </Box>
          </Box>
        </Box>
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={6000}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Usuário criado com sucesso!
          </Alert>
        </Snackbar>
      </Container>
    </React.Fragment>
  )
}

export default SignUp

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
import axios from 'axios'
import helpers from '../../helpers'

const SignUp = () => {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  })

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
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    axios.post(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users`,
      JSON.stringify({
        user: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: 1,
          company: {
            name: data.companyName,
            cnpj: data.cnpj,
          }
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf
        },
      }).then(() => {
        setOpenSuccessSnackbar(true)
        setTimeout(() => {
          window.location.href = '/'
        }, "3000");
      }).catch(error => {
        if (error?.response?.data?.error?.message != undefined) {
          setMessage(error.response.data.error.message)
        } else {
          setMessage("Erro interno")
        }
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
              inputProps={{
                "data-testid": "name-input",
              }}
              margin='normal'
              name='name'
              label='Nome'
              type='name'
              id='name'
              autoFocus
              fullWidth
              {...register("name")}
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
            <TextField
              inputProps={{
                "data-testid": "email-input",
              }}
              margin='normal'
              name='email'
              label='E-mail'
              type='email'
              id='email'
              fullWidth
              {...register("email")}
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
            <TextField
              inputProps={{
                "data-testid": "password-input",
              }}
              margin='normal'
              name='password'
              label='Senha'
              type='password'
              id='password'
              autoComplete='current-password'
              fullWidth
              {...register("password")}
              error={!!errors?.password}
              helperText={errors?.password?.message}
            />
            <TextField
              inputProps={{
                "data-testid": "company-name-input",
              }}
              margin='normal'
              name='companyName'
              label='Nome da empresa'
              type='companyName'
              id='companyName'
              fullWidth
              {...register("companyName")}
              error={!!errors?.companyName}
              helperText={errors?.companyName?.message}
            />
            <TextField
              inputProps={{
                "data-testid": "cnpj-input",
              }}
              margin='normal'
              name='cnpj'
              label='CNPJ'
              type='cnpj'
              id='cnpj'
              fullWidth
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
          autoHideDuration={4000}
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
          autoHideDuration={4000}
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

import React from 'react'
import { useState } from 'react'
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

const Main = () => {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    axios.post(`${helpers.functions.setUrl(process.env.NODE_ENV)}/login`,
      JSON.stringify({
        user: {
          email: data.email,
          password: data.password
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf
        },
      }).then(() => {
        window.location.href = '/statements/list'
      }).catch(() => {
        setOpen(true)
      })
  }

  const createUser = () => {
    window.location.href = '/signup'
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Container style={styles.root} maxWidth={false}>
        <Box display='flex' justifyContent='center'>
          <Box
            height={200}
            width={200}
            mt={10}
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
            <Typography variant="h5">Logar no Expresso</Typography>
            <TextField
              inputProps={{
                "data-testid": "email-login-input",
              }}
              margin='normal'
              name='email'
              label='Usuário'
              type='email'
              id='email'
              autoFocus
              fullWidth
              {...register("email")}
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
            <TextField
              inputProps={{
                "data-testid": "password-login-input",
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
            <Box>
              <Button
                type='submit'
                variant='contained'
                sx={{ mt: 3, mb: 2, mr: 1 }}
              >
                Entrar
              </Button>
              <Button
                onClick={createUser}
                variant='outlined'
                sx={{ mt: 3, mb: 2 }}
              >
                Criar Conta
              </Button>
            </Box>
          </Box>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Login inválido!
          </Alert>
        </Snackbar>
      </Container>
    </React.Fragment >
  )
}

export default Main

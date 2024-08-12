import React from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button
} from '@mui/material'
import { useForm } from "react-hook-form"
import { styles } from './styles.js'
import schema from './schema'
import { yupResolver } from '@hookform/resolvers/yup'

const Main = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    fetch(`http://localhost:3000/login`, {
      method: "POST",
      body: JSON.stringify({
        user: {
          email: data.email,
          password: data.password
        }
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    }).then(response => this.props.history.push(`/expenses`))
      .catch(error => console.log(error.message));
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
                type='submit'
                variant='outlined'
                sx={{ mt: 3, mb: 2 }}
              >
                Criar Conta
              </Button>
            </Box>
          </Box>
        </Box>


      </Container>
    </React.Fragment >
  )
}

export default Main

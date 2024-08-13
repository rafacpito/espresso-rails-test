import React from 'react'
import Layout from '../Layout'
import { useEffect, useState } from 'react'
import { EmployeeList, DialogEmployeeForm } from './components'
import {
  Box,
  Typography,
  Toolbar,
  IconButton,
  AppBar,
  Avatar,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  TextField,
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import {
  Add as AddIcon,
} from '@mui/icons-material'
import { styles } from './styles.js'

const Main = (props) => {
  const [employees, setEmployees] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/employees', {
      method: "GET"
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((response) => {
      setEmployees(response.users)
    }).catch(error => console.log(error.message));
  }, [])

  return (
    <Layout user={props.user}>
      <Container>
        <Box mt={6} display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant="h4">Funcionários</Typography>
          <Button
            variant='contained'
            onClick={() => { setOpen(true) }}
          >
            Cadastrar Funcionário <AddIcon />
          </Button>
        </Box>

        <EmployeeList employees={employees} />

        <DialogEmployeeForm open={open} setOpen={setOpen} />
      </Container>
    </Layout >
  )
}

export default Main
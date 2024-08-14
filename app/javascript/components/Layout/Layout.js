import React from 'react'
import { useState } from 'react'
import {
  Box,
  Typography,
  Toolbar,
  IconButton,
  AppBar,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  Category as CategoryIcon
} from '@mui/icons-material'
import { styles } from './styles.js'

const Layout = ({ children, user }) => {
  const [open, setOpen] = useState(false)

  const logout = () => {
    fetch('http://localhost:3000/logout', {
      method: "DELETE"
    }).then(response => {
      if (response.ok) {
        window.location.href = '/'
        return response.json();
      }
    }).catch(error => console.log(error.message));
  }

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen)
  }

  const itemIcon = (index) => {
    switch (index) {
      case 0:
        return <ReceiptIcon />
      case 1:
        return <PersonIcon />
      case 2:
        return <CreditCardIcon />
      case 3:
        return <CategoryIcon />
    }
  }

  const itemRedirect = (index) => {
    switch (index) {
      case 0:
        break
      case 1:
        window.location.href = '/employees/list'
        break
      case 2:
        break
      case 3:
        window.location.href = '/categories/list'
        break
    }
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar style={styles.toolbar}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => { toggleDrawer(true) }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer open={open} onClose={() => { toggleDrawer(false) }}>
            <Box sx={{ width: 250 }} role="presentation" onClick={() => { toggleDrawer(false) }}>
              <List>
                {['Despesas', 'Funcionários', 'Cartões', 'Categorias'].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton onClick={() => { itemRedirect(index) }}>
                      <ListItemIcon>
                        {itemIcon(index)}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            Espresso
          </Typography>
          <Box mr={2}>
            <Avatar />
          </Box>
          <Box mr={3}>
            <Typography variant="body1" component="div" >
              {user.name}
            </Typography>
            <Typography variant="caption" component="div" >
              {user.email}
            </Typography>
          </Box>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={logout}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  )
}

export default Layout
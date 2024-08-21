import React from 'react'
import Layout from '../Layout'
import { useEffect, useState } from 'react'
import { StatementList } from './components'
import {
  Box,
  Typography,
  Container,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material'
import {
  Close as CloseIcon,
} from '@mui/icons-material'
import axios from 'axios'
import helpers from '../../helpers'

const Main = (props) => {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
  const [erroMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [statements, setStatements] = useState([])
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [categories, setCategories] = useState([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    axios.get(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories`).then((response) => {
      setCategories(response.data.categories)
    })
  }, [])

  useEffect(() => {
    if (currentTabIndex === 0) {
      axios.get(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=${rowsPerPage}&page=${page}`).then((response) => {
        setStatements(response.data.statements)
      })
    } else {
      axios.get(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/archived?per_page=${rowsPerPage}&page=${page}`).then((response) => {
        setStatements(response.data.statements)
      })
    }
  }, [currentTabIndex, rowsPerPage, page, refresh])

  return (
    <Layout user={props.user}>
      <Container>
        <Box mt={6} display='flex' alignItems='center' justifyContent='space-between'>
          <Typography data-testid="statement-title" variant="h4">Despesas</Typography>
        </Box>

        <StatementList
          user={props.user}
          statements={statements}
          setStatements={setStatements}
          categories={categories}
          currentTabIndex={currentTabIndex}
          setCurrentTabIndex={setCurrentTabIndex}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          refresh={refresh}
          setRefresh={setRefresh}
          setOpenSuccessSnackbar={setOpenSuccessSnackbar}
          setSuccessMessage={setSuccessMessage}
          setOpenErrorSnackbar={setOpenErrorSnackbar}
          setErrorMessage={setErrorMessage}
        />

        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={4000}
          onClose={() => { setOpenErrorSnackbar(false) }}
        >
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                data-testid="close-alert"
                onClick={() => {
                  setOpenErrorSnackbar(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {erroMessage}
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
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Layout >
  )
}

export default Main
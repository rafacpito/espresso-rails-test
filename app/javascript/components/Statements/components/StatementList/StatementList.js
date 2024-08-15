import {
  Box,
  Typography,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Avatar,
  Tab,
  Tabs,
  Chip,
  IconButton,
  TablePagination
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  Visibility as VisibilityIcon,
  Archive as ArchiveIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { useState } from 'react'
import { DialogConfirmArchive, DialogEditStatement } from '../'

const Statement = ({
  user,
  statements,
  setStatements,
  categories,
  currentTabIndex,
  setCurrentTabIndex,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  refresh,
  setRefresh,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const [openArchive, setOpenArchive] = useState(false)
  const [archiveIndex, setArchiveIndex] = useState()
  const [archiveStatement, setArchiveStatement] = useState({})
  const [openEdit, setOpenEdit] = useState(false)
  const [editStatment, setEditStatement] = useState({})

  const openDialogConfirmArchive = (statement, index) => {
    setArchiveStatement(statement)
    setArchiveIndex(index)
    setOpenArchive(true)
  }

  const openEditStatementDialog = (statement, index) => {
    setEditStatement(statement)
    setOpenEdit(true)
  }

  const formatCost = (cost) => {
    return `R$${(cost / 100).toFixed(2).toString().replace('.', ',')}`
  }

  const formatDate = (stringDate) => {
    let date = new Date(stringDate)
    let day = date.getDate()
    let month = date.getMonth() + 1
    if (day < 10) day = '0' + day
    if (month < 10) month = '0' + month
    return `${day}/${month}/${date.getFullYear()}`
  }

  const handleTabChange = (tabIndex) => {
    setCurrentTabIndex(tabIndex)
  }

  const handleChangePage = (newPage) => {
    setPage(newPage + 1);
  }

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(parseInt(value, 10))
    setPage(1)
  }

  return (
    <Box mt={6}>
      {user.role == 1 ? (
        <Tabs value={currentTabIndex} onChange={(e, tabIndex) => { handleTabChange(tabIndex) }} aria-label="basic tabs example">
          <Tab label="Lista" />
          <Tab label="Arquivadas" />
        </Tabs>
      ) : ''}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Estabelecimento</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Data de criação</TableCell>
            <TableCell>Cartão</TableCell>
            <TableCell>Comprovação</TableCell>
            <TableCell>Funcionário</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {statements?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9}>Até o momento, não há despesas {currentTabIndex === 0 ? 'listadas' : 'arquivadas'}.  </TableCell>
            </TableRow>
          ) : (
            ''
          )}
          {statements?.map((statement, index) => (
            <TableRow
              key={statement.id}
            >
              <TableCell scope="row" sx={{ width: '5px', paddingRight: '0' }}>
                <Avatar>
                  {statement?.attachment?.file != null ? (
                    <img src={statement?.attachment?.file?.secure_url} />
                  ) : (
                    <ReceiptIcon />
                  )}
                </Avatar>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    {statement.merchant}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    {formatCost(statement.cost)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    {formatDate(statement.performed_at)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    {statement.card.last4}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  {statement.status == 'UNPROVEN' ? (
                    <Chip label="Não comprovada" />
                  ) : (
                    <Chip label="Comprovada" color="success" />
                  )}
                </Box>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    {statement.user.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    {statement?.category?.name || '-'}
                  </Typography>
                </Box>
              </TableCell>
              {currentTabIndex === 0 ? (
                user.role == 1 ? (
                  <TableCell align="right">
                    <IconButton
                      aria-label="close"
                      onClick={() => { openDialogConfirmArchive(statement, index) }}
                    >
                      <ArchiveIcon />
                    </IconButton>
                    <IconButton
                      aria-label="close"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                ) : (
                  <TableCell align="right">
                    <IconButton
                      aria-label="close"
                      onClick={() => { openEditStatementDialog(statement, index) }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                )
              ) : ''}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={"Quantidade por página:"}
        component="div"
        count={100}
        page={page - 1}
        onPageChange={(e, number) => { handleChangePage(number) }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { handleChangeRowsPerPage(e.target.value) }}
      />
      <DialogConfirmArchive
        open={openArchive}
        setOpen={setOpenArchive}
        statement={archiveStatement}
        index={archiveIndex}
        setStatements={setStatements}
        statements={statements}
        refresh={refresh}
        setRefresh={setRefresh}
        page={page}
        setPage={setPage}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
        setOpenErrorSnackbar={setOpenErrorSnackbar}
        setErrorMessage={setErrorMessage}
      />
      <DialogEditStatement
        open={openEdit}
        setOpen={setOpenEdit}
        statement={editStatment}
        categories={categories}
        refresh={refresh}
        setRefresh={setRefresh}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
        setOpenErrorSnackbar={setOpenErrorSnackbar}
        setErrorMessage={setErrorMessage}
      />
    </Box>
  )
}

export default Statement
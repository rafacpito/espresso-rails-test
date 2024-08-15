import {
  Box,
  Avatar,
  Typography,
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TablePagination
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import { useState } from 'react'
import { styles } from './styles.js'
import { DialogConfirmDeletion, DialogEditCard } from '../'

const CardList = ({
  cards,
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
  const [openDeletion, setOpenDeletion] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState()
  const [deleteCard, setDeleteCard] = useState({})
  const [openEdit, setOpenEdit] = useState(false)
  const [editCard, setEditCard] = useState({})

  const openDialogConfirmDeletion = (card, index) => {
    setDeleteCard(card)
    setDeleteIndex(index)
    setOpenDeletion(true)
  }

  const openDialogEditCard = (card) => {
    setEditCard(card)
    setOpenEdit(true)
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
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {cards?.length === 0 ? (

            <TableRow>
              <TableCell>Até o momento, não há cartões cadastrados.</TableCell>
            </TableRow>
          ) : (
            ''
          )}
          {cards?.map((card, index) => (
            <TableRow
              key={card.id}
            >
              <TableCell scope="row" sx={{ width: '5px', paddingRight: '0' }}>
                <Avatar>
                  <CreditCardIcon />
                </Avatar>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    Cartão {card.user.name}
                  </Typography>
                  <Typography variant='body2'>
                    **** **** **** {card.last4}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant='outlined'
                  size="small"
                  onClick={() =>
                    openDialogEditCard(card, index)
                  }
                  style={styles.editButton}
                >
                  <Box mr={1}>
                    Editar
                  </Box>
                  <EditIcon fontSize='small' />
                </Button>
                <Button
                  color="error"
                  variant='outlined'
                  size="small"
                  onClick={() =>
                    openDialogConfirmDeletion(card, index)
                  }
                  style={styles.button}
                >
                  <Box mr={1}>
                    Deletar
                  </Box>
                  <DeleteIcon fontSize='small' />
                </Button>
              </TableCell>
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
      <DialogConfirmDeletion
        open={openDeletion}
        setOpen={setOpenDeletion}
        card={deleteCard}
        index={deleteIndex}
        cards={cards}
        page={page}
        setPage={setPage}
        refresh={refresh}
        setRefresh={setRefresh}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
        setOpenErrorSnackbar={setOpenErrorSnackbar}
        setErrorMessage={setErrorMessage}
      />
      <DialogEditCard
        open={openEdit}
        setOpen={setOpenEdit}
        card={editCard}
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

export default CardList
import {
  Box,
  Typography,
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody,
  Avatar
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useState } from 'react'
import { styles } from './styles.js'
import { DialogConfirmDeletion, DialogEditCategory } from '../'

const CategoryList = ({
  categories,
  setCategories,
  setOpenSuccessSnackbar,
  setSuccessMessage,
  setOpenErrorSnackbar,
  setErrorMessage
}) => {
  const [openDeletion, setOpenDeletion] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState()
  const [deleteCategory, setDeleteCategory] = useState({})
  const [openEdit, setOpenEdit] = useState(false)
  const [editIndex, setEditIndex] = useState()
  const [editCategory, setEditCategory] = useState({})

  const openDialogConfirmDeletion = (category, index) => {
    setDeleteCategory(category)
    setDeleteIndex(index)
    setOpenDeletion(true)
  }

  const openDialogEditEmployee = (category, index) => {
    setEditCategory(category)
    setEditIndex(index)
    setOpenEdit(true)
  }

  return (
    <Box mt={6}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {categories?.length === 0 ? (

            <TableRow>
              <TableCell>Até o momento, não há categorias cadastradas.</TableCell>
            </TableRow>
          ) : (
            ''
          )}
          {categories?.map((category, index) => (
            <TableRow
              key={category.id}
            >
              <TableCell scope="row" sx={{ width: '5px', paddingRight: '0' }}>
                <Avatar>
                  <CategoryIcon />
                </Avatar>
              </TableCell>
              <TableCell scope="row">
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>
                    {category.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant='outlined'
                  size="small"
                  onClick={() =>
                    openDialogEditEmployee(category, index)
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
                    openDialogConfirmDeletion(category, index)
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
      <DialogConfirmDeletion
        open={openDeletion}
        setOpen={setOpenDeletion}
        category={deleteCategory}
        index={deleteIndex}
        setCategories={setCategories}
        categories={categories}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
      />
      <DialogEditCategory
        open={openEdit}
        setOpen={setOpenEdit}
        category={editCategory}
        index={editIndex}
        setCategories={setCategories}
        categories={categories}
        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
        setSuccessMessage={setSuccessMessage}
        setOpenErrorSnackbar={setOpenErrorSnackbar}
        setErrorMessage={setErrorMessage}
      />
    </Box>
  )
}

export default CategoryList
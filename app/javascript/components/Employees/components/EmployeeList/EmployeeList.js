import {
  Box,
  makeStyles,
  Grid,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Table,
  TableCell,
  TableRow,
  TableBody
} from '@mui/material'

const EmployeeList = ({ employees }) => {
  return (
    <Box mt={6}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {employees?.length === 0 ? (

            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>Até o momento, não há funcionários cadastrados.</TableCell>
            </TableRow>
          ) : (
            ''
          )}
          {employees?.map((employee) => (
            <TableRow
              key={employee.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {employee.name}
              </TableCell>
              <TableCell align="right">{employee.calories}</TableCell>
              <TableCell align="right">{employee.fat}</TableCell>
              <TableCell align="right">{employee.carbs}</TableCell>
              <TableCell align="right">{employee.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default EmployeeList
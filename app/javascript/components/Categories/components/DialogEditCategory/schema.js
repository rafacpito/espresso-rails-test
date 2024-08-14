import * as yup from 'yup'

export const schema = yup.object().shape({
  name: yup.string().required('É necessário informar um nome.'),
})

export default schema
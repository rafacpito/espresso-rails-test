import * as yup from 'yup'

export const schema = yup.object().shape({
  email: yup.string().email('É necessário informar um e-mail válido').required('É obrigatório informar um email.'),
  name: yup.string().required('É necessário informar um nome.'),
})

export default schema
import * as yup from 'yup'

export const schema = yup.object().shape({
  email: yup.string().email('É necessário informar um e-mail válido').required('É obrigatório informar um email.'),
  password: yup.string().required('É obrigatório informar uma senha.'),
})

export default schema
import * as yup from 'yup'

export const schema = yup.object().shape({
  email: yup.string().email('É necessário informar um e-mail válido').required('É obrigatório informar um email.'),
  password: yup.string().required('É obrigatório informar uma senha.'),
  name: yup.string().required('É necessário informar um nome.'),
  companyName: yup.string().required('É necessário informar um nome da empresa'),
  cnpj: yup.string().required('É necessário informar um CNPJ.')
})

export default schema
import * as yup from 'yup'

export const schema = yup.object().shape({
  file: yup.mixed().required('É necessário informar um arquivo.'),
  category_id: yup.string().required('Informe uma categoria')
})

export default schema
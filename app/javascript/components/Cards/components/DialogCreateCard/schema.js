import * as yup from 'yup'

export const schema = yup.object().shape({
  last4: yup.string().required('Informe apenas os 4 números finais do cartão.').matches(/^[0-9]+$/, "Deve conter apenas números.")
    .min(4, 'Deve ter exatamente 4 digitos.').max(4, 'Deve ter exatamente 4 digitos.'),
})

export default schema
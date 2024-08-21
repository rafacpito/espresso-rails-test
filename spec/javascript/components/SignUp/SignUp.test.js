import SignUp from "../../../../app/javascript/components/SignUp/SignUp"
import helpers from "../../../../app/javascript/helpers"
import { render, screen, fireEvent, waitFor, act, getByTestId } from "@testing-library/react"
import "@testing-library/jest-dom"
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'

const mock = new MockAdapter(axios)
const userSetup = userEvent.setup()

let metaElement
beforeAll(() => {
  metaElement = document.createElement("meta")
  metaElement.name = "csrf-token"
  metaElement.content = "test-token"
  document.head.append(metaElement)
})
afterAll(() => {
  metaElement.remove()
})

// testa componente SignUp
describe('testing signup', () => {
  describe('test rendering signup', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<SignUp />)
      })
    })

    it('renders SignUp with text Informe os seus dados pessoais and with all inputs', () => {
      expect(screen.queryByText('Informe os seus dados pessoais')).toBeInTheDocument()
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('password-input')).toBeInTheDocument()
      expect(screen.getByTestId('company-name-input')).toBeInTheDocument()
      expect(screen.getByTestId('cnpj-input')).toBeInTheDocument()
    })
  })

  describe('trying to SignUp', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<SignUp />)
      })
    })

    it('displays validation errors when form is submitted with invalid data', async () => {
      await userSetup.click(screen.getByRole('button', { name: 'Criar conta' }))

      await waitFor(() => {
        expect(screen.getByText('É obrigatório informar um nome.')).toBeInTheDocument()
        expect(screen.getByText('É obrigatório informar um email.')).toBeInTheDocument()
        expect(screen.getByText('É obrigatório informar uma senha.')).toBeInTheDocument()
        expect(screen.getByText('É obrigatório informar um nome da empresa.')).toBeInTheDocument()
        expect(screen.getByText('É obrigatório informar um CNPJ.')).toBeInTheDocument()
      })
    })

    it('when SignUp successfully', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users`).reply(200, {
        success: true,
      })
      const testUrl = '/'

      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }

      fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Teste 1' } })
      fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })
      fireEvent.input(screen.getByTestId('password-input'), { target: { value: '123456' } })
      fireEvent.input(screen.getByTestId('company-name-input'), { target: { value: 'Empresa Teste 1' } })
      fireEvent.input(screen.getByTestId('cnpj-input'), { target: { value: '34620017000163' } })

      await waitFor(() => {
        expect(screen.getByTestId("name-input")).toHaveValue("Teste 1")
        expect(screen.getByTestId("email-input")).toHaveValue("test1@test")
        expect(screen.getByTestId("password-input")).toHaveValue("123456")
        expect(screen.getByTestId("company-name-input")).toHaveValue("Empresa Teste 1")
        expect(screen.getByTestId("cnpj-input")).toHaveValue("34.620.017/0001-63")
      })

      await userSetupTimer.click(screen.getByRole('button', { name: 'Criar conta' }))
      await waitFor(() => {
        expect(screen.getByText(/Usuário criado com sucesso!/i)).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      })
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      await waitFor(() => {
        expect(window.location.href).toBe(testUrl)
        window.location = originalLocation
      })
      jest.useRealTimers()
    })

    it('when receive error trying to SignUp', async () => {
      jest.useFakeTimers()
      const errorMessage = 'Simulate error!'
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users`).reply(422, {
        error: {
          message: errorMessage
        }
      })

      fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Teste 1' } })
      fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })
      fireEvent.input(screen.getByTestId('password-input'), { target: { value: '123456' } })
      fireEvent.input(screen.getByTestId('company-name-input'), { target: { value: 'Empresa Teste 1' } })
      fireEvent.input(screen.getByTestId('cnpj-input'), { target: { value: '34620017000163' } })

      await waitFor(() => {
        expect(screen.getByTestId("name-input")).toHaveValue("Teste 1")
        expect(screen.getByTestId("email-input")).toHaveValue("test1@test")
        expect(screen.getByTestId("password-input")).toHaveValue("123456")
        expect(screen.getByTestId("company-name-input")).toHaveValue("Empresa Teste 1")
        expect(screen.getByTestId("cnpj-input")).toHaveValue("34.620.017/0001-63")
      })

      fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
      act(() => {
        jest.advanceTimersByTime(4000)
      })
      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })

    it('when receive error trying to SignUp, but the error isnt formatted', async () => {
      jest.useFakeTimers()
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users`).reply(422, {
        message: 'erro'
      })

      fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Teste 1' } })
      fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })
      fireEvent.input(screen.getByTestId('password-input'), { target: { value: '123456' } })
      fireEvent.input(screen.getByTestId('company-name-input'), { target: { value: 'Empresa Teste 1' } })
      fireEvent.input(screen.getByTestId('cnpj-input'), { target: { value: '34620017000163' } })

      fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

      await waitFor(() => {
        expect(screen.getByText('Erro interno')).toBeInTheDocument()
      })
    })
  })
})
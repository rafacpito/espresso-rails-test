import Main from "../../../../app/javascript/components/Login/Main"
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

// testa componente Login/Main
describe('testing login', () => {
  describe('test rendering login main', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<Main />)
      })
    })

    it('renders Login with text Logar no Expresso and with email and password inputs', () => {
      expect(screen.queryByText('Logar no Expresso')).toBeInTheDocument()
      expect(screen.getByTestId('email-login-input')).toBeInTheDocument()
      expect(screen.getByTestId('password-login-input')).toBeInTheDocument()
    })

    it('redirect when click on button Criar Conta', async () => {
      const testUrl = '/signup'

      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }

      await userSetup.click(screen.getByRole('button', { name: 'Criar Conta' }))
      expect(window.location.href).toBe(testUrl)
      window.location = originalLocation
    })
  })

  describe('trying to Login', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<Main />)
      })
    })

    it('displays validation errors when form is submitted with invalid data', async () => {
      await userSetup.click(screen.getByRole('button', { name: 'Entrar' }))

      await waitFor(() => {
        expect(screen.getByText('É obrigatório informar um email.')).toBeInTheDocument()
        expect(screen.getByText('É obrigatório informar uma senha.')).toBeInTheDocument()
      })
    })

    it('when Login successfully', async () => {
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/login`).reply(200, {
        success: true,
      })
      const testUrl = '/statements/list'

      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }

      fireEvent.input(screen.getByTestId('email-login-input'), { target: { value: 'test1@test' } })
      fireEvent.input(screen.getByTestId('password-login-input'), { target: { value: '123456' } })

      await waitFor(() => {
        expect(screen.getByTestId("email-login-input")).toHaveValue("test1@test")
        expect(screen.getByTestId("password-login-input")).toHaveValue("123456")
      })

      await userSetup.click(screen.getByRole('button', { name: 'Entrar' }))
      expect(window.location.href).toBe(testUrl)
      window.location = originalLocation
    })

    it('when receive error trying to Login', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/login`).reply(422)

      fireEvent.input(screen.getByTestId('email-login-input'), { target: { value: 'test1@test' } })
      fireEvent.input(screen.getByTestId('password-login-input'), { target: { value: '123456' } })

      await waitFor(() => {
        expect(screen.getByTestId("email-login-input")).toHaveValue("test1@test")
        expect(screen.getByTestId("password-login-input")).toHaveValue("123456")
      })

      fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

      await waitFor(() => {
        expect(screen.getByText('Login inválido!')).toBeInTheDocument()
      })
      act(() => {
        jest.advanceTimersByTime(4000)
      })
      await waitFor(() => {
        expect(screen.queryByText('Login inválido!')).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })
  })
})
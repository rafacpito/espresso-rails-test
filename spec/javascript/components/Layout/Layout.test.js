import Layout from "../../../../app/javascript/components/Layout/Layout"
import helpers from "../../../../app/javascript/helpers"
import { render, screen, fireEvent, waitFor, act, getByTestId } from "@testing-library/react"
import "@testing-library/jest-dom"
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'

const mock = new MockAdapter(axios)
const userSetup = userEvent.setup()
const user = {
  role: 1,
  name: 'UserName Test',
  email: 'test@email.com'
}

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

// testa componente Layout
describe('testing layout', () => {
  describe('test rendering layout', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<Layout user={user} children={<div data-testid='div-test-oi'>oi</div>} />)
      })
    })

    it('renders Layout with user name and children div ', () => {
      expect(screen.queryByText(user.name)).toBeInTheDocument()
      expect(screen.getByTestId('div-test-oi')).toBeInTheDocument()
    })

    it('send to window.location.href / when logout', async () => {
      const testUrl = '/'

      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }

      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/logout`).reply(200)
      await userSetup.click(screen.getByTestId('logout-button'))
      expect(window.location.href).toBe(testUrl)
      window.location = originalLocation
    })
  })

  describe('with user role ADMIN', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<Layout user={user} children={<div data-testid='div-test-oi'>oi</div>} />)
      })
    })

    it('open drawer', async () => {
      expect(screen.queryByText('Despesas')).not.toBeInTheDocument()
      expect(screen.queryByText('Funcionários')).not.toBeInTheDocument()
      expect(screen.queryByText('Cartões')).not.toBeInTheDocument()
      expect(screen.queryByText('Categorias')).not.toBeInTheDocument()

      await userSetup.click(screen.getByTestId('open-menu'))

      expect(screen.queryByText('Despesas')).toBeInTheDocument()
      expect(screen.queryByText('Funcionários')).toBeInTheDocument()
      expect(screen.queryByText('Cartões')).toBeInTheDocument()
      expect(screen.queryByText('Categorias')).toBeInTheDocument()
    })

    it('close drawer when clicking outside it', async () => {
      expect(screen.queryByText('Despesas')).not.toBeInTheDocument()
      await userSetup.click(screen.getByTestId('open-menu'))
      expect(screen.queryByText('Despesas')).toBeInTheDocument()
      await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
      await waitFor(() => {
        expect(screen.queryByText('Despesas')).not.toBeInTheDocument()
      })
    })
  })

  describe('with user role EMPLOYEE', () => {
    const employeeUser = {
      role: 2,
      name: 'Test2',
      email: 'test2@email.com'
    }

    it('cant open drawer', async () => {
      await act(async () => {
        render(<Layout user={employeeUser} children={<div data-testid='div-test-oi'>oi</div>} />)
      })

      expect(screen.queryByText('Despesas')).not.toBeInTheDocument()
      expect(screen.queryByText('Funcionários')).not.toBeInTheDocument()
      expect(screen.queryByText('Cartões')).not.toBeInTheDocument()
      expect(screen.queryByText('Categorias')).not.toBeInTheDocument()

      await userSetup.click(screen.getByTestId('open-menu'))

      expect(screen.queryByText('Despesas')).not.toBeInTheDocument()
      expect(screen.queryByText('Funcionários')).not.toBeInTheDocument()
      expect(screen.queryByText('Cartões')).not.toBeInTheDocument()
      expect(screen.queryByText('Categorias')).not.toBeInTheDocument()
    })
  })

  describe('testing itemRedirect', () => {
    it('changes window.location.href to /statements/list when Despesas button is clicked', async () => {
      const testUrl = '/statements/list'

      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }

      await act(async () => {
        render(<Layout user={user} children={<div data-testid='div-test-oi'>oi</div>} />)
      })

      await userSetup.click(screen.getByTestId('open-menu'))
      await userSetup.click(screen.getByRole('button', { name: 'Despesas' }))
      expect(window.location.href).toBe(testUrl)
      window.location = originalLocation
    })

    it('changes window.location.href to /employees/list when Despesas button is clicked', async () => {
      const testUrl = '/employees/list'

      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }

      await act(async () => {
        render(<Layout user={user} children={<div data-testid='div-test-oi'>oi</div>} />)
      })

      await userSetup.click(screen.getByTestId('open-menu'))
      await userSetup.click(screen.getByRole('button', { name: 'Funcionários' }))
      expect(window.location.href).toBe(testUrl)
      window.location = originalLocation
    })

    it('changes window.location.href to /cards/list when Despesas button is clicked', async () => {
      const testUrl = '/cards/list'

      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }

      await act(async () => {
        render(<Layout user={user} children={<div data-testid='div-test-oi'>oi</div>} />)
      })

      await userSetup.click(screen.getByTestId('open-menu'))
      await userSetup.click(screen.getByRole('button', { name: 'Cartões' }))
      expect(window.location.href).toBe(testUrl)
      window.location = originalLocation
    })

    it('changes window.location.href to /categories/list when Despesas button is clicked', async () => {
      const testUrl = '/categories/list'

      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }

      await act(async () => {
        render(<Layout user={user} children={<div data-testid='div-test-oi'>oi</div>} />)
      })

      await userSetup.click(screen.getByTestId('open-menu'))
      await userSetup.click(screen.getByRole('button', { name: 'Categorias' }))
      expect(window.location.href).toBe(testUrl)
      window.location = originalLocation
    })
  })
})
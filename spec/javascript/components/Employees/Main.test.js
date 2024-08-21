import Main from "../../../../app/javascript/components/Employees/Main"
import helpers from "../../../../app/javascript/helpers"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'

const mock = new MockAdapter(axios)
const userSetup = userEvent.setup()
const user = {
  role: 1,
  name: 'Test',
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

// testa componente EmployeeList
describe('testing employee list', () => {
  describe('employees list return an empty array', function () {
    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=10&page=1`).reply(200, { users: [] })

      await act(async () => {
        render(<Main user={user} />)
      })
    })

    it('renders Main with Cadastrar Funcionário', async () => {
      expect(screen.queryByText('Cadastrar Funcionário')).toBeInTheDocument()
    })

    it('shows "Até o momento, não há funcionários cadastrados." when employees array empty', async () => {
      await waitFor(() => {
        expect(screen.getByText("Até o momento, não há funcionários cadastrados.")).toBeInTheDocument()
      })
    })
  })
  describe('employee list returns an array, send one as RandomName to avatar set', function () {
    const mockData = [
      { id: 1, name: 'Test 1', email: 'test1@test' },
      { id: 2, name: 'RandomName', email: 'test2@test' },
      { id: 3, name: 'R', email: 'test3@test' }
    ]
    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=10&page=1`).reply(200, { users: mockData })
    })

    it('fetches data and displays it in a table', async () => {
      await act(async () => {
        render(<Main user={user} />)
      })

      await waitFor(() => {
        expect(screen.getByTestId("avatar-1", { children: 'T1' })).toBeInTheDocument()
        expect(screen.getByTestId("avatar-2", { children: 'RA' })).toBeInTheDocument()
        expect(screen.getByTestId("avatar-3", { children: 'R' })).toBeInTheDocument()
        expect(screen.getByText("Test 1")).toBeInTheDocument()
        expect(screen.getByText("RandomName")).toBeInTheDocument()
        expect(screen.getByText("test1@test")).toBeInTheDocument()
        expect(screen.getByText("test2@test")).toBeInTheDocument()
        expect(screen.getByText("test3@test")).toBeInTheDocument()
      })
    })

    // testa TablePagination no EmployeeList
    it('test TablePagination', async () => {
      mock.reset()
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=10&page=1`)
        .reply(200, {
          users: Array.from({ length: 10 }, (_, i) => ({
            id: (i + 1).toString(),
            name: `Test ${i + 1}`,
            email: `test${i + 1}@teste`,
          })),
        })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=10&page=2`)
        .reply(200, {
          users: Array.from({ length: 10 }, (_, i) => ({
            id: (i + 11).toString(),
            name: `Test ${i + 11}`,
            email: `test${i + 11}@teste`,
          })),
        })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=5&page=1`)
        .reply(200, {
          users: Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            name: `Test ${i + 1}`,
            email: `test${i + 1}@teste`,
          })),
        })

      await act(async () => {
        render(<Main user={user} />)
      })

      await waitFor(() => {
        expect(screen.getByText('Test 1')).toBeInTheDocument()
        expect(screen.getByText('Test 10')).toBeInTheDocument()
        expect(screen.queryByText('Test 11')).not.toBeInTheDocument()
      })

      await userSetup.click(screen.getByLabelText('Go to next page'))

      await waitFor(() => {
        expect(screen.getByText('Test 11')).toBeInTheDocument();
        expect(screen.getByText('Test 20')).toBeInTheDocument();
        expect(screen.queryByText('Test 10')).not.toBeInTheDocument()
      })

      fireEvent.mouseDown(screen.getByRole('combobox'))
      await userSetup.click(
        screen.getByRole("option", {
          name: '5'
        })
      )

      await waitFor(() => {
        expect(screen.getByText('Test 1')).toBeInTheDocument();
        expect(screen.getByText('Test 5')).toBeInTheDocument();
        expect(screen.queryByText('Test 6')).not.toBeInTheDocument();
      })
    })
  })
})

// // testa DialogConfirmDeletion
describe('testing DialogConfirmDeletion', () => {
  const mockData = [
    { id: 1, name: 'Test 1', email: 'test1@test' },
    { id: 2, name: 'Test 2', email: 'test2@test' }
  ]

  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=10&page=1`).reply(200, { users: mockData })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogConfirmDeletion when "Deletar" button is clicked', async () => {
    expect(screen.queryByText('Deletar funcionário')).not.toBeInTheDocument()

    const allItems = screen.getAllByText('Deletar')

    expect(allItems).toHaveLength(2)

    await userSetup.click(allItems[0])

    expect(screen.queryByText('Deletar funcionário')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Deletar funcionário')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar funcionário')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Deletar funcionário')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on close icon button', async () => {
    expect(screen.queryByText('Deletar funcionário')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar funcionário')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('close-delete-dialog'))
    await waitFor(() => {
      expect(screen.queryByText('Deletar funcionário')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on Cancelar button', async () => {
    expect(screen.queryByText('Deletar funcionário')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar funcionário')).toBeInTheDocument()
    await userSetup.click(screen.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => {
      expect(screen.queryByText('Deletar funcionário')).not.toBeInTheDocument()
    })
  })

  it('when it is the unique employee in the second page delete Employee and send to page 1', async () => {
    const mockData = [
      { id: 3, name: 'Test 3', email: 'test3@test' },
    ]
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=10&page=2`).reply(200, { users: mockData })
    mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users/3`).reply(200, { user: { id: 3, name: 'Test 3', email: 'test3@test' } })

    await userSetup.click(screen.getByLabelText('Go to next page'))

    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar funcionário')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('confirm-click'))
    await waitFor(() => {
      expect(screen.getByText('Funcionário deletado com sucesso!')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      //first page elements
      expect(screen.getByText("Test 1")).toBeInTheDocument()
      expect(screen.getByText("Test 2")).toBeInTheDocument()
    })
  })

  describe('using faketimer', () => {
    it('delete Employee', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users/1`).reply(200, { user: { id: 1, name: 'Test 1', email: 'test1@test' } })

      await userSetupTimer.click(screen.getAllByText('Deletar')[0])
      expect(screen.queryByText('Deletar funcionário')).toBeInTheDocument()
      await userSetupTimer.click(screen.getByTestId('confirm-click'))
      await waitFor(() => {
        expect(screen.getByText('Funcionário deletado com sucesso!')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      })
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      await waitFor(() => {
        expect(screen.queryByText('Funcionário deletado com sucesso!')).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })

    it('error trying to delete employee', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      const errorMessage = 'Simulate error!'
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users/1`).reply(422, {
        success: false,
        error: {
          message: errorMessage
        },
      })

      await userSetupTimer.click(screen.getAllByText('Deletar')[0])
      expect(screen.queryByText('Deletar funcionário')).toBeInTheDocument()
      await userSetupTimer.click(screen.getByTestId('confirm-click'))
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

    it('error trying to delete employee with wrong error message, show Erro interno message', async () => {
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users/1`).reply(422, {
        success: false,
        message: 'test error'
      })

      await userSetup.click(screen.getAllByText('Deletar')[0])
      await userSetup.click(screen.getByTestId('confirm-click'))
      await waitFor(() => {
        expect(screen.getByText('Erro interno')).toBeInTheDocument()
      })
    })
  })
})

// testa DialogCreateEmployee
describe('testing DialogCreateEmployee', () => {
  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=10&page=1`).reply(200, { users: [] })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogCreateEmployee when "Cadastrar Funcionário" button is clicked', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()

    await userSetup.click(screen.getByText(/Cadastrar Funcionário/i))

    expect(screen.queryByText('Informe os dados')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    await userSetup.click(screen.getByText(/Cadastrar Funcionário/i))
    expect(screen.queryByText('Informe os dados')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    })
  })

  it('displays validation errors when form is submitted with invalid data', async () => {
    await userSetup.click(screen.getByText(/Cadastrar Funcionário/i))

    await userSetup.click(screen.getByTestId('create-employee-button'))

    await waitFor(() => {
      expect(screen.getByText('É obrigatório informar um email.')).toBeInTheDocument()
      expect(screen.getByText('É necessário informar um nome.')).toBeInTheDocument()
    })
  })

  it('close DialogCreateEmployee when trigger onClick close', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    await userSetup.click(screen.getByText(/Cadastrar Funcionário/i))
    expect(await screen.findByText('Informe os dados')).toBeInTheDocument();
    await userSetup.click(screen.getByTestId('close-dialog'))

    await waitFor(() => {
      expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    })
  })

  it('fail creating, show an error Snackbar and close it by clicking Alert Icon', async () => {
    const errorMessage = 'Simulate error!'
    mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users`).reply(422, {
      success: false,
      error: {
        message: errorMessage
      },
    })

    await userSetup.click(screen.getByText(/Cadastrar Funcionário/i))

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
    })

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test 1' } })
    fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })
    await waitFor(() => {
      expect(screen.getByTestId("name-input")).toHaveValue("Test 1")
      expect(screen.getByTestId("email-input")).toHaveValue("test1@test")
    })

    await userSetup.click(screen.getByTestId('create-employee-button'))
    expect(screen.getByText(errorMessage)).toBeInTheDocument()

    await userSetup.click(screen.getByTestId('close-alert'))
    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
    })
  })

  it('fail creating with wrong return message, show Erro interno message', async () => {
    mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users`).reply(422, {
      success: false,
      message: 'test error'
    })

    await userSetup.click(screen.getByText(/Cadastrar Funcionário/i))

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: '1234' } })
    fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })
    await userSetup.click(screen.getByTestId('create-employee-button'))
    await waitFor(() => {
      expect(screen.getByText('Erro interno')).toBeInTheDocument()
    })
  })

  describe('using faketimer', () => {
    it('fail creating, show an error Snackbar and disappear snackbar', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      const errorMessage = 'Simulate error!'
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users`).reply(422, {
        success: false,
        error: {
          message: errorMessage
        },
      })

      await userSetupTimer.click(screen.getByText(/Cadastrar Funcionário/i))
      await waitFor(() => {
        expect(screen.getByTestId('name-input')).toBeInTheDocument()
        expect(screen.getByTestId('email-input')).toBeInTheDocument()
      })

      fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test 1' } })
      fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })
      await waitFor(() => {
        expect(screen.getByTestId("name-input")).toHaveValue("Test 1")
        expect(screen.getByTestId("email-input")).toHaveValue("test1@test")
      })

      fireEvent.click(screen.getByTestId('create-employee-button'))

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })

    it('create a new employee, show success Snackbar and disappear snackbar', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users`).reply(201, {
        success: true,
      })

      await userSetupTimer.click(screen.getByText(/Cadastrar Funcionário/i))

      await waitFor(() => {
        expect(screen.getByTestId('name-input')).toBeInTheDocument()
        expect(screen.getByTestId('email-input')).toBeInTheDocument()
      })

      fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test 1' } })
      fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })

      await waitFor(() => {
        expect(screen.getByTestId("name-input")).toHaveValue("Test 1")
        expect(screen.getByTestId("email-input")).toHaveValue("test1@test")
      })

      await userSetupTimer.click(screen.getByTestId('create-employee-button'))

      await waitFor(() => {
        expect(screen.getByText(/Funcionário criado com sucesso!/i)).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      })
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      await waitFor(() => {
        expect(screen.queryByText('Funcionário criado com sucesso!')).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })
  })
})

// testa DialogEditEmployee
describe('testing DialogEditEmployee', () => {
  const mockData = [
    { id: 1, name: 'Test 1', email: 'test1@test' },
    { id: 2, name: 'Test 2', email: 'test2@test' }
  ]

  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees?per_page=10&page=1`).reply(200, { users: mockData })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogEditEmployee when "Editar" button is clicked', async () => {
    expect(screen.queryByText('Editar funcionário')).not.toBeInTheDocument()
    const allItems = screen.getAllByText('Editar')
    expect(allItems).toHaveLength(2)
    await userSetup.click(allItems[0])
    expect(screen.queryByText('Editar funcionário')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Editar funcionário')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Editar')[0])
    expect(screen.queryByText('Editar funcionário')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Editar funcionário')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on close icon button', async () => {
    expect(screen.queryByText('Editar funcionário')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Editar')[0])
    expect(screen.queryByText('Editar funcionário')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('close-edit-dialog'))
    await waitFor(() => {
      expect(screen.queryByText('Editar funcionário')).not.toBeInTheDocument()
    })
  })

  it('fail edit, show an error Snackbar and disappear snackbar', async () => {
    const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()
    const errorMessage = 'Simulate error!'
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users/1`).reply(422, {
      success: false,
      error: {
        message: errorMessage
      },
    })

    await userSetupTimer.click((screen.getAllByText('Editar')[0]))
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
    })

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test 1' } })
    fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })

    await waitFor(() => {
      expect(screen.getByTestId("name-input")).toHaveValue("Test 1")
      expect(screen.getByTestId("email-input")).toHaveValue("test1@test")
    })

    fireEvent.click(screen.getByTestId('edit-button'))
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
    })
    jest.useRealTimers()
  })

  it('fail edit with wrong return message, show Erro interno message', async () => {
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users/1`).reply(422, {
      success: false,
      message: 'Test error'
    })

    await userSetup.click((screen.getAllByText('Editar')[0]))
    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test 1' } })
    fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })
    await waitFor(() => {
      expect(screen.getByTestId("name-input")).toHaveValue("Test 1")
      expect(screen.getByTestId("email-input")).toHaveValue("test1@test")
    })

    await userSetup.click(screen.getByTestId('edit-button'))
    await waitFor(() => {
      expect(screen.getByText('Erro interno')).toBeInTheDocument()
    })
  })

  it('edit a employee, show success Snackbar and disappear snackbar', async () => {
    const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/users/1`).reply(200, {
      success: true,
    })

    await userSetupTimer.click((screen.getAllByText('Editar')[0]))
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
    })

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test 1' } })
    fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test1@test' } })

    await waitFor(() => {
      expect(screen.getByTestId("name-input")).toHaveValue("Test 1")
      expect(screen.getByTestId("email-input")).toHaveValue("test1@test")
    })

    await userSetupTimer.click(screen.getByTestId('edit-button'))
    await waitFor(() => {
      expect(screen.getByText('Funcionário editado com sucesso!')).toBeInTheDocument()
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    await waitFor(() => {
      expect(screen.queryByText('Funcionário editado com sucesso!')).not.toBeInTheDocument()
    })
    jest.useRealTimers()
  })
})
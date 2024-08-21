import Main from "../../../../app/javascript/components/Cards/Main"
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

// testa componente CardList
describe('testing card list', () => {
  describe('cards list returns empty array', function () {
    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees`).reply(200, { users: [{ id: 1, name: 'test' }] })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=10&page=1`).reply(200, { cards: [] })

      await act(async () => {
        render(<Main user={user} />)
      })
    })

    it('renders Main with Cadastrar Cartão', async () => {
      expect(screen.queryByText('Cadastrar Cartão')).toBeInTheDocument()
    })

    it('shows "Até o momento, não há cartões cadastrados." when card array is empty', async () => {
      await waitFor(() => {
        expect(screen.getByText("Até o momento, não há cartões cadastrados.")).toBeInTheDocument()
      })
    })
  })

  describe('card list returns an array', function () {
    const mockData = [
      { id: 1, last4: '1234', user: { name: 'Test' } },
      { id: 2, last4: '1111', user: { name: 'Teste' } }
    ]
    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees`).reply(200, { users: [{ id: 1, name: 'test' }] })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=10&page=1`).reply(200, { cards: mockData })
    })

    it('fetches data and displays it in a table', async () => {
      await act(async () => {
        render(<Main user={user} />)
      })

      await waitFor(() => {
        expect(screen.getByText("Cartão Test")).toBeInTheDocument()
        expect(screen.getByText("Cartão Teste")).toBeInTheDocument()
        expect(screen.getByText("**** **** **** 1234")).toBeInTheDocument()
        expect(screen.getByText("**** **** **** 1111")).toBeInTheDocument()
      })
    })

    // testa TablePagination no CardList
    it('test TablePagination', async () => {
      mock.reset()
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees`).reply(200, { users: [{ id: 1, name: 'test' }] })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=10&page=1`)
        .reply(200, {
          cards: Array.from({ length: 10 }, (_, i) => ({
            id: (i + 1).toString(),
            last4: `123${i}`,
            user: { name: `Test ${i + 1}` }
          })),
        })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=10&page=2`)
        .reply(200, {
          cards: Array.from({ length: 10 }, (_, i) => ({
            id: (i + 11).toString(),
            name: `123${i}`,
            user: { name: `Test ${i + 11}` }
          })),
        })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=5&page=1`)
        .reply(200, {
          cards: Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            name: `123${i}`,
            user: { name: `Test ${i + 1}` }
          })),
        })

      await act(async () => {
        render(<Main user={user} />)
      })

      await waitFor(() => {
        expect(screen.getByText('Cartão Test 1')).toBeInTheDocument()
        expect(screen.getByText('Cartão Test 10')).toBeInTheDocument()
        expect(screen.queryByText('Cartão Test 11')).not.toBeInTheDocument()
      })

      await userSetup.click(screen.getByLabelText('Go to next page'))

      await waitFor(() => {
        expect(screen.getByText('Cartão Test 11')).toBeInTheDocument();
        expect(screen.getByText('Cartão Test 20')).toBeInTheDocument();
        expect(screen.queryByText('Cartão Test 10')).not.toBeInTheDocument()
      })

      fireEvent.mouseDown(screen.getByRole('combobox'))
      await userSetup.click(
        screen.getByRole("option", {
          name: '5'
        })
      )

      await waitFor(() => {
        expect(screen.getByText('Cartão Test 1')).toBeInTheDocument();
        expect(screen.getByText('Cartão Test 5')).toBeInTheDocument();
        expect(screen.queryByText('Cartão Test 6')).not.toBeInTheDocument();
      })
    })
  })
})

// testa DialogConfirmDeletion
describe('testing DialogConfirmDeletion', () => {
  const mockData = [
    { id: 1, last4: '1111', user: { name: 'Test name 1' } },
    { id: 2, last4: '2222', user: { name: 'Test name 2' } }
  ]

  beforeAll(async () => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees`).reply(200, { users: [{ id: 1, name: 'test' }] })
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=10&page=1`).reply(200, { cards: mockData })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogConfirmDeletion when "Deletar" button is clicked', async () => {
    expect(screen.queryByText('Deletar cartão')).not.toBeInTheDocument()

    const allItems = screen.getAllByText('Deletar')

    expect(allItems).toHaveLength(2)

    await userSetup.click(allItems[0])

    expect(screen.queryByText('Deletar cartão')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Deletar cartão')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar cartão')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Deletar cartão')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on close icon button', async () => {
    expect(screen.queryByText('Deletar cartão')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar cartão')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('close-delete-dialog'))
    await waitFor(() => {
      expect(screen.queryByText('Deletar cartão')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on Cancelar button', async () => {
    expect(screen.queryByText('Deletar cartão')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar cartão')).toBeInTheDocument()
    await userSetup.click(screen.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => {
      expect(screen.queryByText('Deletar cartão')).not.toBeInTheDocument()
    })
  })

  it('delete Card when it is the unique card in the second page, send to page 1', async () => {
    const mockData = [
      { id: 3, last4: '3333', user: { name: 'Test name 3' } },
    ]
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=10&page=2`).reply(200, { cards: mockData })
    mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards/3`).reply(200, { card: { id: 3, last4: '3333', user: { name: 'Test name 3' } } })

    await userSetup.click(screen.getByLabelText('Go to next page'))

    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar cartão')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('confirm-click'))
    await waitFor(() => {
      expect(screen.getByText('Cartão deletado com sucesso!')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      //first page elements
      expect(screen.getByText("**** **** **** 1111")).toBeInTheDocument()
      expect(screen.getByText("**** **** **** 2222")).toBeInTheDocument()
    })
  })

  it('error trying to delete card with wrong error message, show Erro interno message', async () => {
    mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards/1`).reply(422, {
      success: false,
      message: 'test error'
    })

    await userSetup.click(screen.getAllByText('Deletar')[0])
    await userSetup.click(screen.getByTestId('confirm-click'))
    await waitFor(() => {
      expect(screen.getByText('Erro interno')).toBeInTheDocument()
    })
  })

  describe('using faketimer', () => {
    it('delete Card', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards/1`).reply(200, { card: { id: 1, last4: '1111', user: { name: 'Teste' } } })

      await userSetupTimer.click(screen.getAllByText('Deletar')[0])
      expect(screen.queryByText('Deletar cartão')).toBeInTheDocument()
      await userSetupTimer.click(screen.getByTestId('confirm-click'))
      await waitFor(() => {
        expect(screen.getByText('Cartão deletado com sucesso!')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      })
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      await waitFor(() => {
        expect(screen.queryByText('Cartão deletado com sucesso!')).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })

    it('error trying to delete card', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      const errorMessage = 'Simulate error!'
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards/1`).reply(422, {
        success: false,
        error: {
          message: errorMessage
        },
      })

      await userSetupTimer.click(screen.getAllByText('Deletar')[0])
      expect(screen.queryByText('Deletar cartão')).toBeInTheDocument()
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
  })
})

// testa DialogCreateCard
describe('testing DialogCreateCard', () => {
  beforeEach(async () => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees`).reply(200, { users: [{ id: 1, name: 'test' }] })
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=10&page=1`).reply(200, { cards: [] })

    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogCreateCard when "Cadastrar Cartão" button is clicked', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()

    await userSetup.click(screen.getByText(/Cadastrar Cartão/i))

    expect(screen.queryByText('Informe os dados')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    await userSetup.click(screen.getByText(/Cadastrar Cartão/i))
    expect(screen.queryByText('Informe os dados')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    })
  })

  it('displays validation errors when form is submitted with invalid data', async () => {
    await userSetup.click(screen.getByText(/Cadastrar Cartão/i))

    await userSetup.click(screen.getByTestId('create-card'))

    await waitFor(() => {
      expect(screen.getByText(/Informe apenas os 4 números finais do cartão./i)).toBeInTheDocument()
      expect(screen.getByText(/Escolha um funcionário para vincular com o cartão./i)).toBeInTheDocument()
    })
  })

  it('displays another validation errors when form is submitted with invalid data', async () => {
    await userSetup.click(screen.getByText(/Cadastrar Cartão/i))

    userEvent.type(screen.getByTestId('last4-input'), '12345')

    await userSetup.click(screen.getByTestId('create-card'))

    await waitFor(() => {
      expect(screen.getByText(/Deve ter exatamente 4 digitos./i)).toBeInTheDocument()
      expect(screen.getByText(/Escolha um funcionário para vincular com o cartão./i)).toBeInTheDocument()
    })
  })

  it('fail creating, show an error Snackbar and close clicking Alert Icon', async () => {
    const errorMessage = 'Simulate error!'
    mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards`).reply(422, {
      success: false,
      error: {
        message: errorMessage
      },
    })

    await userSetup.click(screen.getByText(/Cadastrar Cartão/i))

    await waitFor(() => {
      expect(screen.getByTestId('last4-input')).toBeInTheDocument()
      expect(screen.getByTestId('user-id-input')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)
    expect(await screen.findByText('test')).toBeInTheDocument()

    fireEvent.input(screen.getByTestId('last4-input'), { target: { value: '1234' } })
    const dropdownItem = await screen.findByRole("option", { name: 'test' });

    await userSetup.click(dropdownItem);

    await waitFor(() => {
      expect(screen.getByTestId("last4-input")).toHaveValue("1234")
      expect(screen.getByTestId("user-id-input")).toHaveValue("1")
    })

    await userSetup.click(screen.getByTestId('create-card'))
    expect(screen.getByText(errorMessage)).toBeInTheDocument()

    await userSetup.click(screen.getByTestId('close-alert'))
    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
    })
  })

  it('close DialogCreateCard when trigger onClick close', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    await userSetup.click(screen.getByText(/Cadastrar Cartão/i))
    expect(await screen.findByText('Informe os dados')).toBeInTheDocument();
    await userSetup.click(screen.getByTestId('close-dialog'))

    await waitFor(() => {
      expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    })
  })

  describe('using faketimer', () => {
    it('fail creating, show an error Snackbar and disappear snackbar', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      const errorMessage = 'Simulate error!'
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards`).reply(422, {
        success: false,
        error: {
          message: errorMessage
        },
      })

      await userSetupTimer.click(screen.getByText(/Cadastrar Cartão/i))

      await waitFor(() => {
        expect(screen.getByTestId('last4-input')).toBeInTheDocument()
        expect(screen.getByTestId('user-id-input')).toBeInTheDocument()
      })

      const select = screen.getByRole('combobox')
      fireEvent.mouseDown(select)
      expect(await screen.findByText('test')).toBeInTheDocument()

      fireEvent.input(screen.getByTestId('last4-input'), { target: { value: '1234' } })
      const dropdownItem = await screen.findByRole("option", { name: 'test' });

      await userSetupTimer.click(dropdownItem);

      await waitFor(() => {
        expect(screen.getByTestId("last4-input")).toHaveValue("1234")
        expect(screen.getByTestId("user-id-input")).toHaveValue("1")
      })

      await userSetupTimer.click(screen.getByTestId('create-card'))
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

    it('fail creating  with wrong return message, show Erro interno message', async () => {
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards`).reply(422, {
        success: false,
        message: 'test error'
      })

      await userSetup.click(screen.getByText(/Cadastrar Cartão/i))

      const select = screen.getByRole('combobox')
      fireEvent.mouseDown(select)
      fireEvent.input(screen.getByTestId('last4-input'), { target: { value: '1234' } })
      const dropdownItem = await screen.findByRole("option", { name: 'test' });
      await userSetup.click(dropdownItem);

      await userSetup.click(screen.getByTestId('create-card'))
      await waitFor(() => {
        expect(screen.getByText('Erro interno')).toBeInTheDocument()
      })
    })

    it('create a new card, show success Snackbar and disappear snackbar', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards`).reply(201, {
        success: true,
      })

      await userSetupTimer.click(screen.getByText(/Cadastrar Cartão/i))

      await waitFor(() => {
        expect(screen.getByTestId('last4-input')).toBeInTheDocument()
        expect(screen.getByTestId('user-id-input')).toBeInTheDocument()
      })

      const select = screen.getByRole('combobox')
      fireEvent.mouseDown(select)
      expect(await screen.findByText('test')).toBeInTheDocument()

      fireEvent.input(screen.getByTestId('last4-input'), { target: { value: '1234' } })
      const dropdownItem = await screen.findByRole("option", { name: 'test' });

      await userSetupTimer.click(dropdownItem);

      await waitFor(() => {
        expect(screen.getByTestId("last4-input")).toHaveValue("1234")
        expect(screen.getByTestId("user-id-input")).toHaveValue("1")
      })

      await userSetupTimer.click(screen.getByTestId('create-card'))

      await waitFor(() => {
        expect(screen.getByText(/Cartão criado com sucesso!/i)).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      })
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      await waitFor(() => {
        expect(screen.queryByText('Cartão criado com sucesso!')).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })
  })
})

// testa DialogEditCard
describe('testing DialogEditCard', () => {
  const mockData = [
    { id: 1, last4: '1234', user: { name: 'Test' } },
    { id: 2, last4: '1111', user: { name: 'Teste' } }
  ]

  beforeAll(async () => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/employees`).reply(200, { users: [{ id: 1, name: 'test' }] })
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards?per_page=10&page=1`).reply(200, { cards: mockData })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogEditCard when "Editar" button is clicked', async () => {
    expect(screen.queryByText('Associar funcionário')).not.toBeInTheDocument()
    const allItems = screen.getAllByText('Editar')
    expect(allItems).toHaveLength(2)
    await userSetup.click(allItems[0])
    expect(screen.queryByText('Associar funcionário')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Associar funcionário')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Editar')[0])
    expect(screen.queryByText('Associar funcionário')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Associar funcionário')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on close icon button', async () => {
    expect(screen.queryByText('Associar funcionário')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Editar')[0])
    expect(screen.queryByText('Associar funcionário')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('close-edit-dialog'))
    await waitFor(() => {
      expect(screen.queryByText('Associar funcionário')).not.toBeInTheDocument()
    })
  })

  it('fail edit, show an error Snackbar and disappear snackbar', async () => {
    const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()
    const errorMessage = 'Simulate error!'
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards/1`).reply(422, {
      success: false,
      error: {
        message: errorMessage
      },
    })

    await userSetupTimer.click((screen.getAllByText('Editar')[0]))
    await waitFor(() => {
      expect(screen.getByTestId('user-email-input')).toBeInTheDocument()
    })

    fireEvent.input(screen.getByTestId('user-email-input'), { target: { value: '1234@test' } })
    await waitFor(() => {
      expect(screen.getByTestId("user-email-input")).toHaveValue("1234@test")
    })

    await userSetupTimer.click(screen.getByTestId('edit-button'))
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
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards/1`).reply(422, {
      success: false,
      message: 'Test error'
    })

    await userSetup.click((screen.getAllByText('Editar')[0]))
    fireEvent.input(screen.getByTestId('user-email-input'), { target: { value: '1234@test' } })
    await waitFor(() => {
      expect(screen.getByTestId("user-email-input")).toHaveValue("1234@test")
    })

    await userSetup.click(screen.getByTestId('edit-button'))
    await waitFor(() => {
      expect(screen.getByText('Erro interno')).toBeInTheDocument()
    })
  })

  it('edit a card, show success Snackbar and disappear snackbar', async () => {
    const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/cards/1`).reply(200, {
      success: true,
    })

    await userSetupTimer.click((screen.getAllByText('Editar')[0]))
    await waitFor(() => {
      expect(screen.getByTestId('user-email-input')).toBeInTheDocument()
    })

    fireEvent.input(screen.getByTestId('user-email-input'), { target: { value: '1234@test' } })
    await waitFor(() => {
      expect(screen.getByTestId("user-email-input")).toHaveValue("1234@test")
    })

    await userSetupTimer.click(screen.getByTestId('edit-button'))
    await waitFor(() => {
      expect(screen.getByText('Funcionário associado ao cartão editado com sucesso!')).toBeInTheDocument()
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    await waitFor(() => {
      expect(screen.queryByText('Funcionário associado ao cartão editado com sucesso!')).not.toBeInTheDocument()
    })
    jest.useRealTimers()
  })
})
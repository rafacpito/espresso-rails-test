import Main from "../../../../app/javascript/components/Statements/Main"
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

// testa componente StatementList
describe('testing statement list', () => {
  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories`).reply(200, { categories: [] })
  })

  describe('statements list return an empty array', function () {
    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=5&page=1`).reply(200, { statements: [] })

      await act(async () => {
        render(<Main user={user} />)
      })
    })

    it('renders Main with statement title', async () => {
      expect(screen.getByTestId('statement-title')).toBeInTheDocument()
    })

    it('shows "Até o momento, não há despesas listadas." when statements array empty', async () => {
      await waitFor(() => {
        expect(screen.getByText("Até o momento, não há despesas listadas.")).toBeInTheDocument()
      })
    })
  })

  describe('statement list returns an array', function () {
    const mockData = [
      { id: 1, merchant: 'Merchant 1', cost: 1000, performed_at: '2024-08-10T00:00:00.000-03:00', status: 'UNPROVEN', card: { last4: '1234' }, user: { name: 'Name 1' } },
      {
        id: 2, merchant: 'Merchant 2', cost: 1200, performed_at: '2024-08-11T00:00:00.000-03:00', status: 'PROVEN', card: { last4: '1233' }, user: { name: 'Name 2' },
        category: { name: 'Categoria 1' }, attachment: { file: { sercure_url: 'fake_url' } }
      }
    ]
    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=5&page=1`).reply(200, { statements: mockData })
    })

    it('fetches data and displays it in a table', async () => {
      await act(async () => {
        render(<Main user={user} />)
      })

      await waitFor(() => {
        expect(screen.getByText("Merchant 1")).toBeInTheDocument()
        expect(screen.getByText("Merchant 2")).toBeInTheDocument()
        expect(screen.getByText("R$10,00")).toBeInTheDocument()
        expect(screen.getByText("R$12,00")).toBeInTheDocument()
        expect(screen.getByText("10/08/2024")).toBeInTheDocument()
        expect(screen.getByText("11/08/2024")).toBeInTheDocument()
        expect(screen.getByText("1234")).toBeInTheDocument()
        expect(screen.getByText("1233")).toBeInTheDocument()
        expect(screen.getByText("Name 1")).toBeInTheDocument()
        expect(screen.getByText("Name 2")).toBeInTheDocument()
        expect(screen.getByText("Não comprovada")).toBeInTheDocument()
        expect(screen.getByText("Comprovada")).toBeInTheDocument()
        expect(screen.getByText("Categoria 1")).toBeInTheDocument()
        expect(screen.getAllByTestId("archive-button")[0]).toBeInTheDocument()
      })
    })

    describe('when change tab to archived', () => {
      const mockData = [
        { id: 3, merchant: 'Merchant 3', cost: 1000, performed_at: '2024-08-10T00:00:00.000-03:00', status: 'UNPROVEN', card: { last4: '2222' }, user: { name: 'Name 3' } },
      ]
      beforeEach(async () => {
        mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/archived?per_page=5&page=1`).reply(200, { statements: mockData })
      })

      it('when change tab to archived show archived elements only', async () => {
        await act(async () => {
          render(<Main user={user} />)
        })
        await userSetup.click(screen.getByTestId('archived-tab'))
        await waitFor(() => {
          expect(screen.getByText("Merchant 3")).toBeInTheDocument()
          expect(screen.getByText("R$10,00")).toBeInTheDocument()
          expect(screen.getByText("10/08/2024")).toBeInTheDocument()
          expect(screen.getByText("2222")).toBeInTheDocument()
          expect(screen.getByText("Name 3")).toBeInTheDocument()
          expect(screen.getByText("Não comprovada")).toBeInTheDocument()
          expect(screen.queryByTestId("archive-button")).not.toBeInTheDocument()
        })
      })

      it('when change tab to archived but has no one archived statement', async () => {
        mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/archived?per_page=5&page=1`).reply(200, { statements: [] })
        await act(async () => {
          render(<Main user={user} />)
        })
        await userSetup.click(screen.getByTestId('archived-tab'))
        await waitFor(() => {
          expect(screen.getByText("Até o momento, não há despesas arquivadas.")).toBeInTheDocument()
        })
      })
    })

    // testa TablePagination no StatementList
    it('test TablePagination', async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=5&page=1`)
        .reply(200, {
          statements: Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            merchant: `Merchant ${i + 1}`,
            cost: 1000,
            performed_at: '2024-08-10T00:00:00.000-03:00',
            status: 'UNPROVEN',
            card: { last4: '1234' },
            user: { name: `Name ${i + 1}` }
          })),
        })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=5&page=2`)
        .reply(200, {
          statements: Array.from({ length: 5 }, (_, i) => ({
            id: (i + 6).toString(),
            merchant: `Merchant ${i + 6}`,
            cost: 1000,
            performed_at: '2024-08-10T00:00:00.000-03:00',
            status: 'UNPROVEN',
            card: { last4: '1234' },
            user: { name: `Name ${i + 6}` }
          })),
        })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=10&page=1`)
        .reply(200, {
          statements: Array.from({ length: 10 }, (_, i) => ({
            id: (i + 1).toString(),
            merchant: `Merchant ${i + 1}`,
            cost: 1000,
            performed_at: '2024-08-10T00:00:00.000-03:00',
            status: 'UNPROVEN',
            card: { last4: '1234' },
            user: { name: `Name ${i + 1}` }
          })),
        })

      await act(async () => {
        render(<Main user={user} />)
      })

      await waitFor(() => {
        expect(screen.getByText('Merchant 1')).toBeInTheDocument()
        expect(screen.getByText('Merchant 5')).toBeInTheDocument()
        expect(screen.queryByText('Merchant 6')).not.toBeInTheDocument()
      })

      await userSetup.click(screen.getByLabelText('Go to next page'))

      await waitFor(() => {
        expect(screen.getByText('Merchant 6')).toBeInTheDocument();
        expect(screen.getByText('Merchant 10')).toBeInTheDocument();
        expect(screen.queryByText('Merchant 5')).not.toBeInTheDocument()
        expect(screen.queryByText('Merchant 11')).not.toBeInTheDocument()
      })

      fireEvent.mouseDown(screen.getByRole('combobox'))
      await userSetup.click(
        screen.getByRole("option", {
          name: '10'
        })
      )

      await waitFor(() => {
        expect(screen.getByText('Merchant 1')).toBeInTheDocument();
        expect(screen.getByText('Merchant 10')).toBeInTheDocument();
        expect(screen.queryByText('Merchant 11')).not.toBeInTheDocument();
      })
    })
  })

  describe('employeeUser', () => {
    const employeeUser = {
      role: 2,
      name: 'Test2',
      email: 'test2@email.com'
    }
    const mockData = [
      { id: 1, merchant: 'Merchant 1', cost: 1000, performed_at: '2024-08-10T00:00:00.000-03:00', status: 'UNPROVEN', card: { last4: '1234' }, user: { name: 'Name 1' } },
      {
        id: 2, merchant: 'Merchant 2', cost: 1200, performed_at: '2024-08-11T00:00:00.000-03:00', status: 'PROVEN', card: { last4: '1233' }, user: { name: 'Name 2' },
        category: { name: 'Categoria 1' }, attachment: { file: { sercure_url: 'fake_url' } }
      }
    ]

    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=5&page=1`).reply(200, { statements: mockData })

      await act(async () => {
        render(<Main user={employeeUser} />)
      })
    })

    it('should not show tabs and archive-button, but should show edit-button', async () => {
      await waitFor(() => {
        expect(screen.queryByTestId("archive-button")).not.toBeInTheDocument()
        expect(screen.queryByTestId("list-tab")).not.toBeInTheDocument()
        expect(screen.queryByTestId("archived-tab")).not.toBeInTheDocument()
        expect(screen.queryAllByTestId("edit-button")[0]).toBeInTheDocument()
      })
    })
  })
})

// testa DialogConfirmArchive
describe('testing DialogConfirmArchive', () => {
  const mockData = [
    { id: 1, merchant: 'Merchant 1', cost: 1000, performed_at: '2024-08-10T00:00:00.000-03:00', status: 'UNPROVEN', card: { last4: '1234' }, user: { name: 'Name 1' } },
    {
      id: 2, merchant: 'Merchant 2', cost: 1200, performed_at: '2024-08-11T00:00:00.000-03:00', status: 'PROVEN', card: { last4: '1233' }, user: { name: 'Name 2' },
      category: { name: 'Categoria 1' }, attachment: { file: { sercure_url: 'fake_url' } }
    }
  ]

  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=5&page=1`).reply(200, { statements: mockData })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogConfirmArchive when "Deletar" button is clicked', async () => {
    expect(screen.queryByText('Arquivar despesa')).not.toBeInTheDocument()

    const allItems = screen.getAllByTestId("archive-button")

    expect(allItems).toHaveLength(2)

    await userSetup.click(allItems[0])

    expect(screen.queryByText('Arquivar despesa')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Arquivar despesa')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByTestId("archive-button")[0])
    expect(screen.queryByText('Arquivar despesa')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Arquivar despesa')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on close icon button', async () => {
    expect(screen.queryByText('Arquivar despesa')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByTestId("archive-button")[0])
    expect(screen.queryByText('Arquivar despesa')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('close-archive-dialog'))
    await waitFor(() => {
      expect(screen.queryByText('Arquivar despesa')).not.toBeInTheDocument()
    })
  })

  it('when it is the unique statement in the second page and archive Statement, then send to page 1', async () => {
    const mockData = [
      { id: 1, merchant: 'Test 1', cost: 10, performed_at: '10/08/2024', status: 'UNPROVEN', card: { last4: '1234' }, user: { name: 'Test 1' } },
    ]
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=5&page=2`).reply(200, { statements: mockData })
    mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/1`).reply(200, { statement: { id: 1, merchant: 'Test 1', cost: 10, performed_at: '10/08/2024', status: 'UNPROVEN', card: { last4: '1234' }, user: { name: 'Test 1' } } })

    await userSetup.click(screen.getByLabelText('Go to next page'))

    await userSetup.click(screen.getAllByTestId("archive-button")[0])
    expect(screen.queryByText('Arquivar despesa')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('archive-statement-button'))
    await waitFor(() => {
      expect(screen.getByText('Despesa arquivada com sucesso!')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      //first page elements
      expect(screen.getByText("Name 1")).toBeInTheDocument()
      expect(screen.getByText("Name 2")).toBeInTheDocument()
      expect(screen.getByText("Não comprovada")).toBeInTheDocument()
      expect(screen.getByText("Comprovada")).toBeInTheDocument()
      expect(screen.getAllByTestId("archive-button")[0]).toBeInTheDocument()
    })
  })

  it('error trying to archive statement with wrong error message, show Erro interno message, and close with close alert button', async () => {
    mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/1`).reply(422, {
      success: false,
      message: 'test error'
    })

    await userSetup.click(screen.getAllByTestId("archive-button")[0])
    await userSetup.click(screen.getByTestId('archive-statement-button'))
    await waitFor(() => {
      expect(screen.getByText('Erro interno')).toBeInTheDocument()
    })

    await userSetup.click(screen.getByTestId('close-alert'))
    await waitFor(() => {
      expect(screen.queryByText('Erro interno')).not.toBeInTheDocument()
    })
  })

  describe('using faketimer', () => {
    it('archive Statement', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/1`).reply(200, { statement: { id: 1, merchant: 'Test 1', cost: 10, performed_at: '10/08/2024', status: 'UNPROVEN', card: { last4: '1234' }, user: { name: 'Test 1' } } })

      await userSetupTimer.click(screen.getAllByTestId("archive-button")[0])
      expect(screen.queryByText('Arquivar despesa')).toBeInTheDocument()
      await userSetupTimer.click(screen.getByTestId('archive-statement-button'))
      await waitFor(() => {
        expect(screen.getByText('Despesa arquivada com sucesso!')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      })
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      await waitFor(() => {
        expect(screen.queryByText('Despesa arquivada com sucesso!')).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })

    it('error trying to archive statement', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      const errorMessage = 'Simulate error!'
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/1`).reply(422, {
        success: false,
        error: {
          message: errorMessage
        },
      })

      await userSetupTimer.click(screen.getAllByTestId("archive-button")[0])
      expect(screen.queryByText('Arquivar despesa')).toBeInTheDocument()
      await userSetupTimer.click(screen.getByTestId('archive-statement-button'))
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

// testa DialogEditStatement
describe('testing DialogEditStatement', () => {
  let file
  const employeeUser = {
    role: 2,
    name: 'Test2',
    email: 'test2@email.com'
  }
  const mockData = [
    {
      id: 1, merchant: 'Test 1', cost: 10, performed_at: '10/08/2024', status: 'UNPROVEN', card: { last4: '1234' }, user: { name: 'Test 1' },
      category: { id: 1, name: 'Categoria Nova 1' }, attachment: { file: { sercure_url: 'fake_url' } }
    },
    { id: 2, merchant: 'Test 2', cost: 10, performed_at: '10/08/2024', status: 'UNPROVEN', card: { last4: '1234' }, user: { name: 'Test 1' } }
  ]

  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories`).reply(200, {
      categories: [
        { id: 1, name: 'Categoria Nova 1' },
        { id: 2, name: 'Categoria Nova 2' }
      ]
    })
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements?per_page=5&page=1`).reply(200, { statements: mockData })
  })

  beforeEach(async () => {
    file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" })

    await act(async () => {
      render(<Main user={employeeUser} />)
    })
  })

  it('shows DialogEditStatement when "Editar" button is clicked', async () => {
    expect(screen.queryByText('Editar despesa')).not.toBeInTheDocument()
    const allItems = screen.getAllByTestId('edit-button')
    expect(allItems).toHaveLength(2)
    await userSetup.click(allItems[1])
    expect(screen.queryByText('Editar despesa')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Editar despesa')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByTestId('edit-button')[0])
    expect(screen.queryByText('Editar despesa')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Editar despesa')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on close icon button', async () => {
    expect(screen.queryByText('Editar despesa')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByTestId('edit-button')[0])
    expect(screen.queryByText('Editar despesa')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('close-edit-dialog'))
    await waitFor(() => {
      expect(screen.queryByText('Editar despesa')).not.toBeInTheDocument()
    })
  })

  it('fail edit, show an error Snackbar and disappear snackbar', async () => {
    const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()
    const errorMessage = 'Simulate error!'
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/1`).reply(422, {
      success: false,
      error: {
        message: errorMessage
      },
    })

    await userSetupTimer.click((screen.getAllByTestId('edit-button')[0]))
    await waitFor(() => {
      expect(screen.getByTestId('file-input')).toBeInTheDocument()
      expect(screen.getByTestId('category-id-input')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)
    expect(await screen.findByText('Categoria Nova 2')).toBeInTheDocument()

    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } })
    const dropdownItem = await screen.findByRole("option", { name: 'Categoria Nova 2' });

    await userSetupTimer.click(dropdownItem);

    await waitFor(() => {
      expect(screen.getByTestId("category-id-input")).toHaveValue("2")
    })

    fireEvent.click(screen.getByTestId('edit-statement-button'))
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
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/1`).reply(422, {
      success: false,
      message: 'Test error'
    })

    await userSetup.click((screen.getAllByTestId('edit-button')[0]))
    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } })
    const dropdownItem = await screen.findByRole("option", { name: 'Categoria Nova 2' });
    await userSetup.click(dropdownItem);

    await userSetup.click(screen.getByTestId('edit-statement-button'))
    await waitFor(() => {
      expect(screen.getByText('Erro interno')).toBeInTheDocument()
    })
  })

  it('edit a statement, show success Snackbar and disappear snackbar', async () => {
    const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/statements/1`).reply(200, {
      success: true,
    })

    await userSetupTimer.click((screen.getAllByTestId('edit-button')[0]))
    await waitFor(() => {
      expect(screen.getByTestId('file-input')).toBeInTheDocument()
      expect(screen.getByTestId('category-id-input')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)
    expect(await screen.findByText('Categoria Nova 2')).toBeInTheDocument()

    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } })
    const dropdownItem = await screen.findByRole("option", { name: 'Categoria Nova 2' });

    await userSetupTimer.click(dropdownItem);

    await waitFor(() => {
      expect(screen.getByTestId("category-id-input")).toHaveValue("2")
    })

    await userSetupTimer.click(screen.getByTestId('edit-statement-button'))
    await waitFor(() => {
      expect(screen.getByText('Comprovante vinculado a despesa e categoria definida.')).toBeInTheDocument()
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    await waitFor(() => {
      expect(screen.queryByText('Comprovante vinculado a despesa e categoria definida.')).not.toBeInTheDocument()
    })
    jest.useRealTimers()
  })
})
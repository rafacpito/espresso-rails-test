import Main from "../../../../app/javascript/components/Categories/Main"
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

// testa componente CategoryList
describe('testing category list', () => {
  describe('categories list return an empty array', function () {
    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=10&page=1`).reply(200, { categories: [] })

      await act(async () => {
        render(<Main user={user} />)
      })
    })

    it('renders Main with Cadastrar Categoria', async () => {
      expect(screen.queryByText('Cadastrar Categoria')).toBeInTheDocument()
    })

    it('shows "Até o momento, não há categorias cadastradas." when categories array empty', async () => {
      await waitFor(() => {
        expect(screen.getByText("Até o momento, não há categorias cadastradas.")).toBeInTheDocument()
      })
    })
  })
  describe('category list returns an array', function () {
    const mockData = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' }
    ]
    beforeEach(async () => {
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=10&page=1`).reply(200, { categories: mockData })
    })

    it('fetches data and displays it in a table', async () => {
      await act(async () => {
        render(<Main user={user} />)
      })

      await waitFor(() => {
        expect(screen.getByText("Test 1")).toBeInTheDocument()
        expect(screen.getByText("Test 2")).toBeInTheDocument()
      })
    })

    // testa TablePagination no CategoryList
    it('test TablePagination', async () => {
      mock.reset()
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=10&page=1`)
        .reply(200, {
          categories: Array.from({ length: 10 }, (_, i) => ({
            id: (i + 1).toString(),
            name: `Test ${i + 1}`,
          })),
        })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=10&page=2`)
        .reply(200, {
          categories: Array.from({ length: 10 }, (_, i) => ({
            id: (i + 11).toString(),
            name: `Test ${i + 11}`,
          })),
        })
      mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=5&page=1`)
        .reply(200, {
          categories: Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            name: `Test ${i + 1}`,
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

// testa DialogConfirmDeletion
describe('testing DialogConfirmDeletion', () => {
  const mockData = [
    { id: 1, name: 'Test name 1' },
    { id: 2, name: 'Test name 2' }
  ]

  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=10&page=1`).reply(200, { categories: mockData })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogConfirmDeletion when "Deletar" button is clicked', async () => {
    expect(screen.queryByText('Deletar categoria')).not.toBeInTheDocument()

    const allItems = screen.getAllByText('Deletar')

    expect(allItems).toHaveLength(2)

    await userSetup.click(allItems[0])

    expect(screen.queryByText('Deletar categoria')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Deletar categoria')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar categoria')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Deletar categoria')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on close icon button', async () => {
    expect(screen.queryByText('Deletar categoria')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar categoria')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('close-delete-dialog'))
    await waitFor(() => {
      expect(screen.queryByText('Deletar categoria')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on Cancelar button', async () => {
    expect(screen.queryByText('Deletar categoria')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar categoria')).toBeInTheDocument()
    await userSetup.click(screen.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => {
      expect(screen.queryByText('Deletar categoria')).not.toBeInTheDocument()
    })
  })

  it('when it is the unique category in the second page delete Category and send to page 1', async () => {
    const mockData = [
      { id: 3, name: 'Test name 3' },
    ]
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=10&page=2`).reply(200, { categories: mockData })
    mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories/3`).reply(200, { category: { id: 3, name: 'Test name 3' } })

    await userSetup.click(screen.getByLabelText('Go to next page'))

    await userSetup.click(screen.getAllByText('Deletar')[0])
    expect(screen.queryByText('Deletar categoria')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('confirm-click'))
    await waitFor(() => {
      expect(screen.getByText('Categoria deletado com sucesso!')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      //first page elements
      expect(screen.getByText("Test name 1")).toBeInTheDocument()
      expect(screen.getByText("Test name 2")).toBeInTheDocument()
    })
  })

  describe('using faketimer', () => {
    it('delete Category', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories/1`).reply(200, { category: { id: 1, name: 'Test 1' } })

      await userSetupTimer.click(screen.getAllByText('Deletar')[0])
      expect(screen.queryByText('Deletar categoria')).toBeInTheDocument()
      await userSetupTimer.click(screen.getByTestId('confirm-click'))
      await waitFor(() => {
        expect(screen.getByText('Categoria deletado com sucesso!')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      })
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      await waitFor(() => {
        expect(screen.queryByText('Categoria deletado com sucesso!')).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })

    it('error trying to delete category', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      const errorMessage = 'Simulate error!'
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories/1`).reply(422, {
        success: false,
        error: {
          message: errorMessage
        },
      })

      await userSetupTimer.click(screen.getAllByText('Deletar')[0])
      expect(screen.queryByText('Deletar categoria')).toBeInTheDocument()
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

    it('error trying to delete category with wrong error message, show Erro interno message', async () => {
      mock.onDelete(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories/1`).reply(422, {
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

// testa DialogCreateCategory
describe('testing DialogCreateCategory', () => {
  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=10&page=1`).reply(200, { categories: [] })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogCreateCategory when "Cadastrar Categoria" button is clicked', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()

    await userSetup.click(screen.getByText(/Cadastrar Categoria/i))

    expect(screen.queryByText('Informe os dados')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    await userSetup.click(screen.getByText(/Cadastrar Categoria/i))
    expect(screen.queryByText('Informe os dados')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    })
  })

  it('displays validation errors when form is submitted with invalid data', async () => {
    await userSetup.click(screen.getByText(/Cadastrar Categoria/i))

    await userSetup.click(screen.getByTestId('create-category-button'))

    await waitFor(() => {
      expect(screen.getByText('É necessário informar um nome.')).toBeInTheDocument()
    })
  })

  it('close DialogCreateCategory when trigger onClick close', async () => {
    expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    await userSetup.click(screen.getByText(/Cadastrar Categoria/i))
    expect(await screen.findByText('Informe os dados')).toBeInTheDocument();
    await userSetup.click(screen.getByTestId('close-dialog'))

    await waitFor(() => {
      expect(screen.queryByText('Informe os dados')).not.toBeInTheDocument()
    })
  })

  it('fail creating, show an error Snackbar and close it by clicking Alert Icon', async () => {
    const errorMessage = 'Simulate error!'
    mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories`).reply(422, {
      success: false,
      error: {
        message: errorMessage
      },
    })

    await userSetup.click(screen.getByText(/Cadastrar Categoria/i))

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
    })

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test 1' } })
    await waitFor(() => {
      expect(screen.getByTestId("name-input")).toHaveValue("Test 1")
    })

    await userSetup.click(screen.getByTestId('create-category-button'))
    expect(screen.getByText(errorMessage)).toBeInTheDocument()

    await userSetup.click(screen.getByTestId('close-alert'))
    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
    })
  })

  it('fail creating with wrong return message, show Erro interno message', async () => {
    mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories`).reply(422, {
      success: false,
      message: 'test error'
    })

    await userSetup.click(screen.getByText(/Cadastrar Categoria/i))

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: '1234' } })
    await userSetup.click(screen.getByTestId('create-category-button'))
    await waitFor(() => {
      expect(screen.getByText('Erro interno')).toBeInTheDocument()
    })
  })

  describe('using faketimer', () => {
    it('fail creating, show an error Snackbar and disappear snackbar', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      const errorMessage = 'Simulate error!'
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories`).reply(422, {
        success: false,
        error: {
          message: errorMessage
        },
      })

      await userSetupTimer.click(screen.getByText(/Cadastrar Categoria/i))
      await waitFor(() => {
        expect(screen.getByTestId('name-input')).toBeInTheDocument()
      })

      fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test 1' } })
      await waitFor(() => {
        expect(screen.getByTestId("name-input")).toHaveValue("Test 1")
      })

      fireEvent.click(screen.getByTestId('create-category-button'))

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

    it('create a new category, show success Snackbar and disappear snackbar', async () => {
      const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      jest.useFakeTimers()
      mock.onPost(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories`).reply(201, {
        success: true,
      })

      await userSetupTimer.click(screen.getByText(/Cadastrar Categoria/i))

      await waitFor(() => {
        expect(screen.getByTestId('name-input')).toBeInTheDocument()
      })

      fireEvent.input(screen.getByTestId('name-input'), { target: { value: '1234' } })

      await waitFor(() => {
        expect(screen.getByTestId("name-input")).toHaveValue("1234")
      })

      await userSetupTimer.click(screen.getByTestId('create-category-button'))

      await waitFor(() => {
        expect(screen.getByText(/Categoria criada com sucesso!/i)).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
      })
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      await waitFor(() => {
        expect(screen.queryByText('Categoria criada com sucesso!')).not.toBeInTheDocument()
      })
      jest.useRealTimers()
    })
  })
})

// testa DialogEditCategory
describe('testing DialogEditCategory', () => {
  const mockData = [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' }
  ]

  beforeAll(() => {
    mock.onGet(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories?per_page=10&page=1`).reply(200, { categories: mockData })
  })

  beforeEach(async () => {
    await act(async () => {
      render(<Main user={user} />)
    })
  })

  it('shows DialogEditCategory when "Editar" button is clicked', async () => {
    expect(screen.queryByText('Editar categoria')).not.toBeInTheDocument()
    const allItems = screen.getAllByText('Editar')
    expect(allItems).toHaveLength(2)
    await userSetup.click(allItems[0])
    expect(screen.queryByText('Editar categoria')).toBeInTheDocument()
  })

  it('close Dialog if click outside it', async () => {
    expect(screen.queryByText('Editar categoria')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Editar')[0])
    expect(screen.queryByText('Editar categoria')).toBeInTheDocument()
    await userSetup.click(screen.getAllByRole('presentation')[0].firstChild)
    await waitFor(() => {
      expect(screen.queryByText('Editar categoria')).not.toBeInTheDocument()
    })
  })

  it('close Dialog if click on close icon button', async () => {
    expect(screen.queryByText('Editar categoria')).not.toBeInTheDocument()
    await userSetup.click(screen.getAllByText('Editar')[0])
    expect(screen.queryByText('Editar categoria')).toBeInTheDocument()
    await userSetup.click(screen.getByTestId('close-edit-dialog'))
    await waitFor(() => {
      expect(screen.queryByText('Editar categoria')).not.toBeInTheDocument()
    })
  })

  it('fail edit, show an error Snackbar and disappear snackbar', async () => {
    const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()
    const errorMessage = 'Simulate error!'
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories/1`).reply(422, {
      success: false,
      error: {
        message: errorMessage
      },
    })

    await userSetupTimer.click((screen.getAllByText('Editar')[0]))
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
    })

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test Edit 1' } })
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue("Test Edit 1")
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
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories/1`).reply(422, {
      success: false,
      message: 'Test error'
    })

    await userSetup.click((screen.getAllByText('Editar')[0]))
    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test Edit 1' } })
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue("Test Edit 1")
    })

    await userSetup.click(screen.getByTestId('edit-button'))
    await waitFor(() => {
      expect(screen.getByText('Erro interno')).toBeInTheDocument()
    })
  })

  it('edit a category, show success Snackbar and disappear snackbar', async () => {
    const userSetupTimer = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()
    mock.onPut(`${helpers.functions.setUrl(process.env.NODE_ENV)}/categories/1`).reply(200, {
      success: true,
    })

    await userSetupTimer.click((screen.getAllByText('Editar')[0]))
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
    })

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Test Edit 1' } })
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue("Test Edit 1")
    })

    await userSetupTimer.click(screen.getByTestId('edit-button'))
    await waitFor(() => {
      expect(screen.getByText('Categoria editada com sucesso!')).toBeInTheDocument()
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    await waitFor(() => {
      expect(screen.queryByText('Categoria editada com sucesso!')).not.toBeInTheDocument()
    })
    jest.useRealTimers()
  })
})
import { putData } from '../main'

let originalConsoleError // Визначаємо змінну в області видимості, доступній для обох хуків
let originalConsoleLog // Визначаємо змінну в області видимості, доступній для обох хуків

// Мокуємо `fetch` глобально за допомогою jest
beforeEach(() => {
  jest.resetAllMocks()
  originalConsoleError = console.error // Зберігаємо оригінальний console.error
  originalConsoleLog = console.log // Зберігаємо оригінальний console.log
  console.error = jest.fn() // Приглушаємо console.error
  console.log = jest.fn() // Приглушаємо console.log
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' })
    })
  )
})

afterEach(() => {
  console.error = originalConsoleError // Відновлюємо console.error
  console.log = originalConsoleLog // Відновлюємо console.log
})
describe('putData function', () => {
  it('successfully updates data and returns the result', async () => {
    const id = 1
    const newData = { title: 'Updated Post' }

    const result = await putData(id, newData)
    expect(result).toEqual({ message: 'Success' })
    expect(fetch).toHaveBeenCalledWith(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(newData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  })

  it('returns error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')))

    const result = await putData(1, {})
    expect(result).toContain('Network error')
  })
})

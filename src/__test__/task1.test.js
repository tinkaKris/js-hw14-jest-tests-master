import { getData } from '../main'

let originalConsoleError // Визначаємо змінну в області видимості, доступній для обох хуків
let originalConsoleLog // Визначаємо змінну в області видимості, доступній для обох хуків

// Мокуємо `fetch` глобально за допомогою jest
beforeEach(() => {
  jest.resetAllMocks()
  originalConsoleError = console.error // Зберігаємо оригінальний console.error
  originalConsoleLog = console.log // Зберігаємо оригінальний console.log
  console.error = jest.fn() // Приглушаємо console.error
  console.log = jest.fn() // Приглушаємо console.log
  global.fetch = jest.fn()
})

afterEach(() => {
  console.error = originalConsoleError // Відновлюємо console.error
  console.log = originalConsoleLog // Відновлюємо console.log
})

describe('getData function', () => {
  it('uses GET method for fetching data', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, title: 'Test Post' })
    }))

    await getData('/posts/1')

    // Перевіряємо, що fetch викликаний з методом GET
    expect(fetch.mock.calls[0][1].method).toBe('GET')
  })

  it('returns data on successful fetch', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, title: 'Test Post' })
    }))

    const data = await getData('/posts/1')
    expect(data).toEqual({ id: 1, title: 'Test Post' })
  })

  it('returns status code on fetch error', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      status: 404
    }))

    const statusCode = await getData('/nonexistent')
    expect(statusCode).toBe(404)
  })

  it('returns error message when fetch operation fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')))

    const errorMessage = await getData('/error')
    expect(errorMessage).toContain('Network error')
  })
})

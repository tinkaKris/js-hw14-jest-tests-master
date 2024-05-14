import { postData } from '../main'

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

describe('postData function', () => {
  it('uses POST method to send data', async () => {
    const mockData = { title: 'Test', body: 'This is a test', userId: 1 }
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData)
    }))

    await postData('/posts', mockData)

    // Перевіряємо, що fetch викликається із правильним методом, URL, заголовками та тілом
    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST', // Тепер ми явно перевіряємо метод
        body: JSON.stringify(mockData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  })

  it('successfully posts data to an API', async () => {
    const mockData = { title: 'Test', body: 'This is a test', userId: 1 }
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData)
    }))

    const result = await postData('/posts', mockData)
    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts', expect.anything())
  })

  it('returns an error message on a failed request', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: false, status: 404 }))

    const result = await postData('/posts', {})
    expect(result).toContain('HTTP error! status: 404')
  })
})

import { deleteData } from '../main'

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

describe('deleteData function error handling', () => {
  it('returns true on successful deletion', async () => {
    // Симулюємо успішну відповідь
    fetch.mockResolvedValue({ ok: true, status: 200 })

    const id = 1 // Використовуємо ідентифікатор для сценарію успішного видалення
    const result = await deleteData(id)
    expect(result).toBe(true) // Явно перевіряємо, що результат є true

    // Перевіряємо, що fetch був викликаний з правильним URL і методом
    expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE'
    })
  })

  it('returns error message when the fetch call fails', async () => {
    // Симулюємо помилку fetch запиту
    fetch.mockRejectedValue(new Error('Network failure'))

    const id = 3 // Використовуємо ідентифікатор, який симулює сценарій помилки
    const result = await deleteData(id)
    expect(result).toBe('Network failure') // Перевіряємо, що функція повернула повідомлення помилки

    // Перевіряємо, що fetch був викликаний з правильним URL і методом
    expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE'
    })
  })

  it('returns status code on non-200 response', async () => {
    // Симулюємо відповідь, що імітує неуспішне видалення
    fetch.mockResolvedValue({ ok: false, status: 500 })

    const id = 4 // Ідентифікатор для сценарію неуспішного видалення
    const result = await deleteData(id)
    expect(result).toBe(500) // Перевіряємо, що функція повернула статус код помилки

    // Перевіряємо, що fetch був викликаний з правильним URL і методом
    expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE'
    })
  })
})

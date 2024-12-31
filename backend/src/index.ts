import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono()

app.get('/', (c) => {
  const prisma = new PrismaClient().$extends(withAccelerate())

  return c.text('Hello Hono!')
})

app.post('/signup', (c) => {
  return c.text('Hello from signup!')
})

app.post('/signin', (c) => {
  return c.text('Hello from signin!')
})

app.post('/api/v1/blog', (c) => {
  return c.text('Hello from post blog!')
})
app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Hello from get all blog!')
})
app.put('/api/v1/blog/:blogId', (c) => {
  return c.text('Hello from update blog from id!')
})

export default app

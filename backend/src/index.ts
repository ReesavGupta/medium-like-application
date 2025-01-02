import { Context, Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify, decode } from 'hono/jwt'
const app = new Hono<{
  Bindings: {
    Database_URL: string
  }
}>()

app.use('api/v1/blog/*', async (c, next) => {
  try {
    const jwt = c.req.header('Authorization')
    if (!jwt) {
      c.status(401)
      return c.json({ error: 'Unauthorized: Missing token' })
    }

    const token = jwt.split(' ')[1]
    if (!token) {
      c.status(401)
      return c.json({ error: 'Unauthorized: Invalid token format' })
    }

    const secret = 'secret'
    const payload = await verify(token, secret)

    if (!payload) {
      c.status(401)
      return c.json({ error: 'Unauthorized: Invalid token' })
    }

    c.set('user', payload)
    await next()
  } catch (error) {
    c.status(500)
    return c.json({ error: 'Internal Server Error' })
  }
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/signup', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.Database_URL,
    }).$extends(withAccelerate())

    interface SignupBody {
      email: string
      password: string
      name: string
    }
    const body: SignupBody = await c.req.json()

    const findUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (!findUser) {
      throw new Error('User already exist!')
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    })

    if (!user) {
      throw new Error('User not created!')
    }

    const token = sign({ id: user.id }, 'sercet')

    return c.json({
      token,
      message: 'User created!',
    })
  } catch (error) {
    return c.text('Error from signup!')
  }
})

app.post('/signin', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.Database_URL,
    }).$extends(withAccelerate())

    const body: { email: string; password: string } = await c.req.json()

    if (!body.email || !body.password) {
      throw new Error('Email or password is missing!')
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (!user) {
      throw new Error('User not found!')
    }

    if (user.password !== body.password) {
      throw new Error('Password is incorrect!')
    }

    const token = sign({ id: user.id }, 'sercet')

    return c.json({
      token,
      message: 'User logged in!',
    })
  } catch (error) {
    return c.text('Error from signin!')
  }
})

app.post('/api/v1/blog/create', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.Database_URL,
    }).$extends(withAccelerate())

    interface BlogBody {
      title: string
      content: string
    }
    return c.text('Hello from create blog!')
  } catch (error) {
    return c.text('Error from get blog from id!')
  }
})
app.get('/api/v1/blog/', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.Database_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.pOST.findMany()

    if (!blogs) {
      throw new Error('No blogs found!')
    }

    return c.json({ blogs, message: 'Blogs fetched!' })
  } catch (error) {
    return c.text('Error from get bulk blog!')
  }
})
app.put('/api/v1/blog/:blogId', (c) => {
  return c.text('Hello from update blog from id!')
})

export default app

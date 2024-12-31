import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/signup', (c) => {

})

app.post('/signin', (c) => {

})

app.post('/api/v1/blog', (c) => {
  
})
app.get('/api/v1/blog/bulk', (c) => {

})
app.put('/api/v1/', (c) => {

})

export default app

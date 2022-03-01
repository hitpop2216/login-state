const { urlencoded } = require('express')
const express = require('express')
const exphbs = require('express-handlebars')
require('./config/mongoose')
const Account = require('./models/account')
const cookieParser = require('cookie-parser')

const PORT = 3000
const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('utils'))
app.use(cookieParser())

app.get('/', (req, res) => {
  const cookieUser = req.cookies
  if (cookieUser) {
    res.render('show', {data: cookieUser})
  } else {
    res.render('index')
  }
})
app.post('/', (req, res) => {
  const postUser = req.body
  Account
    .findOne(postUser)
    .lean()
    .then(data => data ? data : res.redirect('/'))
    .then(data => {
      res.cookie('firstName', data.firstName)
      res.cookie('email', data.email)
      res.cookie('password', data.password)
      res.render('show', { data })
    })
    .catch(err => console(err))
})

app.get('/show', (req, res) => {
  res.render('show')
})

app.get('/logout', (req, res) => {
  res.clearCookie('firstName')
  res.clearCookie('email')
  res.clearCookie('password')

  res.render('index')
})

app.listen(PORT, () => {
  console.log(`The app is running on http://localhost:${PORT}`)
})
// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// підключили класи User, ...
const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Transaction } = require('../class/transaction')

const testTransaction1 = Transaction.create(
  'Stripe',
  'Receipt',
  100.2,
)
const testTransaction2 = Transaction.create(
  'Coinbase',
  'Receipt',
  200.55,
)

const testTransaction3 = Transaction.create(
  'Diana Roof',
  'Sending',
  300.8,
  'diana@mail.com',
)

const testTransaction4 = Transaction.create(
  '9.10.2024_michel',
  'Sending',
  500.99,
  'michel@mail.com',
)

//+++++++++++++++++++++++++++++++
router.get('/settings', function (req, res) {})
//+++++++++++++++++++++++++++++++
router.post('/settings', function (req, res) {
  try {
    // changedData = new email or new password
    const {
      token,
      oldPassword,
      changedInput,
      changedData,
    } = req.body
    // console.log('changedData', changedData) //ok чи приходить відповідь з бекенду
    // console.log('oldPassword', oldPassword) //ok
    // console.log('token', token) //!!!ok
    // console.log('changedInput', changedInput) //!!!ok

    if (!oldPassword || !changedData || !changedInput) {
      return res.status(400).json({
        message: 'Fill all the fields with correct values',
      })
    }

    if (!token) {
      return res.status(400).json({
        message: 'You need to sign in',
      })
    }

    const session = Session.get(token)
    // console.log('session', session)
    if (!session) {
      return res.status(400).json({
        message: 'You need to sign in',
      })
    }

    //for changedData = new email
    if (changedInput === 'email_new') {
      session.user.email = changedData
    }

    const existedUser = User.getUserById(session.user.id)
    // console.log('existedUser', existedUser)

    if (!existedUser) {
      return res.status(400).json({
        message: 'Error! User with such id was not found',
      })
    }

    //записали новий email в клас User
    if (changedInput === 'email_new') {
      existedUser.email = changedData
    }

    // console.log(
    //   'existedUser after email change',
    //   existedUser,
    // ) //ok

    //записали новий password в клас User
    if (changedInput === 'password_new') {
      existedUser.password = changedData
    }

    // console.log(
    //   'existedUser afte password change',
    //   existedUser,
    // )

    //сгенерувати новий токен
    const newToken = Session.generateToken()
    //перезаписати новий токен в класі user, session
    existedUser.token = newToken
    session.token = newToken

    // console.log('session', session)

    return res.status(200).json({
      //це дані, які повернуться на фронт
      session, // тут є токен та user{id, email, isConfirm}
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})
//+++++++++++++++++++++++++++++++
router.get('/balance', function (req, res) {})
//++++++++++++++++++++++++++++++
router.get('/balance-data', function (req, res) {
  const { token } = req.query //ok
  console.log('token', token)
  console.log('session', Session.get(token))

  try {
    const list = Transaction.getList()
    // console.log('list', list) //ok
    if (list.length === 0) {
      return res.status(400).json({
        message: 'You have no transactions yet',
      })
    }

    return res.status(200).json({
      list: list.map((trans) => ({
        id: trans.id,
        author: trans.author,
        type: trans.type,
        date: trans.date,
        amount: trans.amount,
      })),
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})
//++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++
router.get('/transaction', function (req, res) {})
//++++++++++++++++++++++++++++++
router.get('/transaction-item', function (req, res) {
  const { id } = req.query
  // console.log('id', id)

  if (!id) {
    return res.status(400).json({
      message: 'Transaction ID is missed',
    })
  }

  const transaction = Transaction.get(id)
  // console.log('transaction', transaction)

  if (!transaction) {
    return res.status(400).json({
      message: 'There is no transaction with such ID',
    })
  }

  return res.status(200).json({
    transaction: {
      id: transaction.id,
      author: transaction.author,
      email: transaction.email,
      type: transaction.type,
      date: transaction.date,
      amount: transaction.amount,
    },
  })
})
//++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++
router.get('/send', function (req, res) {})
//+++++++++++++++++++++++++++++++
router.post('/send', function (req, res) {
  try {
    const {
      email,
      password,
      // isConfirm = false,
      // token,
    } = req.body

    // console.log('email', email) //!!! чи приходить відповідь з бекенду
    // console.log('password', password) //!!!

    if (!email || !password) {
      return res.status(400).json({
        message: 'Fill all the fields with correct values',
      })
    }

    const existedUser = User.getUserByEmail(email)
    // console.log('existedUser', existedUser)

    if (existedUser) {
      return res.status(400).json({
        message:
          'Error! A user with the same name is already exist',
      })
    }

    const newUser = User.createUser(email, password)
    // console.log('newUser', newUser)//ok
    const session = Session.create(newUser)
    // console.log('session', session)

    Confirm.create(newUser.email)

    return res.status(200).json({
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//+++++++++++++++++++++++++++++++
// router.get('/receive', function (req, res) {})

//+++++++++++++++++++++++++++++++
// Експортуємо глобальний роутер
module.exports = router

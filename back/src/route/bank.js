// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// підключили класи User, ...
const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Transaction } = require('../class/transaction')
const { Notification } = require('../class/notification')

const testTransaction1 = Transaction.create(
  'test@gmail.com',
  'Stripe',
  'test@gmail.com',
  'Receipt',
  100.2,
)
const testTransaction2 = Transaction.create(
  'test@gmail.com',
  'Coinbase',
  'test@gmail.com',
  'Receipt',
  200.55,
)

const testTransaction3 = Transaction.create(
  'test@gmail.com',
  null,
  'diana@gmail.com',
  'Sending',
  300.8,
)

const testTransaction4 = Transaction.create(
  'diana@gmail.com',
  null,
  'test@gmail.com',
  'Receipt',
  400.9,
)

const notification = Notification.create(
  'test@gmail.com',
  'New reward system',
  'Announcement',
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

    const existedUser = User.getUserById(session.user.id)
    // console.log('existedUser', existedUser)

    if (!existedUser) {
      return res.status(400).json({
        message: 'Error! User with such id was not found',
      })
    }

    //for changedData = new email
    if (changedInput === 'email_new') {
      if (existedUser.email === changedData) {
        return res.status(400).json({
          message:
            'The new email is identical with the old email',
        })
      }
      //записали новий email в клас User
      existedUser.email = changedData
      //записали новий email в session
      session.user.email = changedData
      //!!!!!!! змінюємо email користувача в існуючому листі нотифікацій
      Notification.changeEmail(
        existedUser.email,
        changedData,
      )

      // змінюємо email користувача в існуючому листі транзакцій
      //!!!!!
      // console.log('existedUser.email', existedUser.email)
      // console.log('changedData', changedData)
      Transaction.changeEmail(
        existedUser.email,
        changedData,
      )

      Notification.create(
        changedData,
        'Email changed',
        'Warning',
      )
    }

    //for changedData = new password
    if (changedInput === 'password_new') {
      if (existedUser.password === changedData) {
        return res.status(400).json({
          message:
            'The new password is identical with the old password',
        })
      }

      //записали новий password в клас User
      existedUser.password = changedData

      Notification.create(
        existedUser.email,
        'Password changed',
        'Warning',
      )
    }

    //сгенерувати новий токен
    const newToken = Session.generateToken()

    //перезаписати новий токен в User
    existedUser.token = newToken
    //перезаписати новий токен в session
    session.token = newToken

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
  // console.log('token', token)
  // const { authToken } = req.headers
  // console.log('token from headers', authToken)

  if (!token) {
    return res.status(400).json({
      message: 'You need to sign in',
    })
  }

  const session = Session.get(token)
  // console.log('session', session)//ok

  if (!session) {
    return res.status(400).json({
      message: 'You need to sign in',
    })
  }

  const email = session.user.email //ok
  // console.log('email', email)

  if (!email) {
    return res.status(400).json({
      message: 'There is no user with such email',
    })
  }

  try {
    const transactions =
      Transaction.getUserTransactions(email)
    // console.log('transactions', transactions) //ok

    if (transactions.length === 0) {
      return res.status(400).json({
        sum: 0,
        list: null,
        message: 'You have no transactions yet',
      })
    }

    return res.status(200).json({
      sum: Transaction.getSum(email),
      list: transactions.map((trans) => ({
        id: trans.id,
        payer_email: trans.payer_email,
        payment_system: trans.payment_system,
        recipient_email: trans.recipient_email,
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
  const { token } = req.query
  console.log('token', token)

  if (!id) {
    return res.status(400).json({
      message: 'Transaction ID is missed',
    })
  }
  //НАДО ПЕРЕДАТЬ ТОКЕН!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!его нет в контексте!
  const session = Session.get(token)
  // console.log('session', session)//ok

  if (!session) {
    return res.status(400).json({
      message: 'You need to sign in',
    })
  }

  const email = session.user.email //ok
  console.log('email', email)

  if (!email) {
    return res.status(400).json({
      message: 'There is no user with such email',
    })
  }

  const transaction = Transaction.get(email, id)
  console.log('transaction.get(email, id)', transaction)

  if (!transaction) {
    return res.status(400).json({
      message: 'There is no transaction with such ID',
    })
  }

  return res.status(200).json({
    transaction: {
      id: transaction.id,
      payment_system: transaction.payment_system,
      recipient_email: transaction.recipient_email,
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
    const { email, amount } = req.body
    const { token } = req.query

    if (!email || !amount) {
      return res.status(400).json({
        message: 'Fill all the fields with correct values',
      })
    }

    const recipient = User.getUserByEmail(email)
    // console.log('recipient', recipient)

    if (!recipient) {
      return res.status(400).json({
        message: 'Error! There is no user with such email',
      })
    }

    const session = Session.get(token)
    const payer_email = session.user.email

    const transaction = Transaction.create(
      payer_email,
      null,
      email,
      'Sending',
      amount,
    )

    const transaction_minus = Transaction.create(
      email,
      null,
      payer_email,
      'Receipt',
      amount,
    )

    const notification = Notification.create(
      payer_email,
      'New transaction',
      'Info',
    )

    const notification2 = Notification.create(
      email,
      'New transaction',
      'Info',
    )

    console.log('notification send', notification)
    console.log('notification2 send', notification2)

    return res.status(200).json({
      transaction,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++
router.get('/receive', function (req, res) {})
//+++++++++++++++++++++++++++++++
router.post('/receive', function (req, res) {
  try {
    const { amount, payment_system } = req.body
    const { token } = req.query
    // const { tokenHeaders } = req.headers
    // console.log('token from header', tokenHeaders) //underfined!!!
    console.log(
      'amount, payment_system',
      amount,
      payment_system,
    ) //!!! чи приходить відповідь з бекенду

    const session = Session.get(token)
    const payer_email = session.user.email

    const transaction = Transaction.create(
      payer_email,
      payment_system,
      payer_email,
      'Receipt',
      amount,
    )
    console.log('transaction receive', transaction)

    const notification = Notification.create(
      payer_email,
      'New transaction',
      'Info',
    )
    // console.log('notification receive', notification)
    return res.status(200).json({
      transaction, //?????
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//+++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++
router.get('/notifications', function (req, res) {})
//++++++++++++++++++++++++++++++
router.get('/notifications-data', function (req, res) {
  const { token } = req.query //ok
  // console.log('token', token)
  // const { authToken } = req.headers
  // console.log('token from headers', authToken)

  if (!token) {
    return res.status(400).json({
      message: 'You need to sign in',
    })
  }

  const session = Session.get(token)
  // console.log('session', session)//ok

  if (!session) {
    return res.status(400).json({
      message: 'You need to sign in',
    })
  }
  const email = session.user.email //ok
  // console.log('email', email)

  if (!email) {
    return res.status(400).json({
      message: 'There is no user with such email',
    })
  }

  try {
    const list = Notification.getUserNotif(email)
    console.log('list of notif', list)

    if (list.length === 0) {
      return res.status(400).json({
        message: 'No notifications',
      })
    }

    return res.status(200).json({
      list: list,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})
//++++++++++++++++++++++++++++++
// Експортуємо глобальний роутер
module.exports = router

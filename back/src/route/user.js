// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

//підключили класс User

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

const testUser = User.createUser(
  'test@gmail.com',
  'A123aaaaa',
  false,
)

// console.log('testov user', testUser)

router.post('/signup', function (req, res) {
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
      //це дані, які повернуться на фронт
      // user: {
      //   email: newUser.email,
      //   isConfirm: newUser.isConfirm,
      //   // token: newUser.token,
      // },
      session, // тут є токен
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//+++++++++++++++++++++++++++++++
router.get('/signup-confirm', function (req, res) {})
//+++++++++++++
router.post('/signup-confirm', function (req, res) {
  const { token, code } = req.body

  // console.log('code, token', code, token) //ok ! чи приходить відповідь з бекенду

  if (!code || !token) {
    return res.status(400).json({
      message: 'Enter the code you received',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Error! You need to sign up.',
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Error! Invalid code',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Error! Invalid code',
      })
    }

    //оновили isConfirm в сесії
    session.user.isConfirm = true
    //оновили isConfirm в класі User,бо це різні об'єкти
    const user = User.getUserByEmail(session.user.email)
    user.isConfirm = true

    //+++++++++++++++

    return res.status(200).json({
      message: 'You account was successfully confirmed!',
      //це дані, які повернуться на фронт
      // user: {
      //   id: user.id,
      //   email: user.email,
      //   isConfirm: user.isConfirm,
      // },
      // token: user.token,
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//+++++++++++++++++++++++++++++++
router.get('/recovery', function (req, res) {})
//+++++++++++++++++++++++++++++++
router.post('/recovery', function (req, res) {
  const { email } = req.body

  // console.log('email from backend', email) //ok! чи приходить відповідь з бекенду
  try {
    if (!email) {
      return res.status(400).json({
        message:
          'Error! Fill all the fields with correct values',
      })
    }

    const existedUser = User.getUserByEmail(email)
    // console.log('existedUser', existedUser) //null

    if (!existedUser) {
      return res.status(400).json({
        message: 'Error! User was not found',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Recovery code was send to you',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//+++++++++++++++
//+++++++++++++
router.get('/recovery-confirm', function (req, res) {})
//+++++++++++++++++++++++++++++++
router.post('/recovery-confirm', function (req, res) {
  const { code, password } = req.body

  // console.log('code, password', code, password) //ok! чи приходить відповідь з бекенду
  try {
    if (!password || !code) {
      return res.status(400).json({
        message:
          'Error! Fill all the fields with correct values',
      })
    }

    //obj = в List в класі Confirm об'єкт з code and data(=email)
    const email = Confirm.getData(Number(code)) //getData returns obj.data, i.o. email '12345@mail.com'
    // console.log('email', email) //ok

    if (!email) {
      return res.status(400).json({
        message: 'Error! Enter the correct code, please!',
      })
    }

    const user = User.getUserByEmail(email) ///
    if (!user) {
      return res.status(400).json({
        message: 'User with such email is not exist',
      })
    }
    user.password = password

    // console.log('user', user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'You password was successfully changed',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//+++++++++++++++++++++++++++++++
router.get('/signin', function (req, res) {})
//+++++++++++++++++++++++++++++++
router.post('/signin', function (req, res) {
  try {
    const { email, password } = req.body

    // console.log('email', email) //!!! чи приходить відповідь з бекенду
    // console.log('password', password) //!!!

    if (!email || !password) {
      return res.status(400).json({
        message: 'Fill all the fields with correct values',
      })
    }

    const existedUser = User.getUserByEmail(email)
    // console.log('existedUser', existedUser)

    if (!existedUser) {
      return res.status(400).json({
        message:
          'Error! User with such email was not found',
      })
    }

    if (existedUser.password !== password) {
      return res.status(400).json({
        message:
          'Error! Enter the correct password, please',
      })
    }

    const session = Session.create(existedUser)
    // console.log('session', session)

    Confirm.create(existedUser.email)

    return res.status(200).json({
      message: 'You are log in',
      //це дані, які повернуться на фронт

      // user: {
      //   email: newUser.email,
      //   isConfirm: newUser.isConfirm,
      //   // token: newUser.token,
      // },
      session, // тут є токен
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//+++++++++++++++++++++++++++++++
// Експортуємо глобальний роутер
module.exports = router

// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

//підключили класс User
// const { User } = require('../class/user')
// const { Confirm } = require('../class/confirm')
// const { Session } = require('../class/session')

//+++++++++++++++++++++++++++++++
router.get('/balance', function (req, res) {})
//+++++++++++++++++++++++++++++++
router.post('/balance', function (req, res) {})
//+++++++++++++++++++++++++++++++

router.get('/send', function (req, res) {})
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
router.get('/receive', function (req, res) {})

//+++++++++++++++++++++++++++++++
// Експортуємо глобальний роутер
module.exports = router

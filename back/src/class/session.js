class Session {
  //приватний список of tokens
  static #list = []

  constructor(user) {
    this.token = Session.generateToken()
    this.user = {
      id: user.id,
      email: user.email,
      isConfirm: user.isConfirm, // чи підтверджено аккаунт через пошту
    }
  }

  static generateToken = () => {
    const length = 6
    const characters =
      'ABCDEFGHIKLMNOPQRSTUWXYZabcdefghiklmnopqrtstuwxyz0123456789'
    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length,
      )
      result += characters[randomIndex]
    }

    return result
  }

  static create = (user) => {
    const session = new Session(user)
    this.#list.push(session)

    return session
  }

  static get = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      null
    )
  }
}

module.exports = {
  Session,
}

console.log(Session.generateToken()) //ok

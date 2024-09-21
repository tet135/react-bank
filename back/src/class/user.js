class User {
  static #list = []

  ///не ставити в конструкторі коми!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  constructor(email, password, isConfirm = false) {
    this.id = new Date().getTime()
    this.email = String(email).toLowerCase()
    this.password = String(password)
    this.isConfirm = isConfirm
  }

  static createUser(email, password, isConfirm) {
    const newUser = new User(email, password, isConfirm)

    // console.log(newUser)

    this.#list.push(newUser)
    // console.log(this.#list)

    return newUser
  }

  static getUserByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(),
      ) || null
    )
  }

  static getUserById(id) {
    return (
      this.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }
}

module.exports = {
  User,
}

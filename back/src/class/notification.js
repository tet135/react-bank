class Notification {
  static #list = []

  ///не ставити в конструкторі коми!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  constructor(name, type) {
    this.id = Math.round(Math.random() * 10000)
    this.name = name
    this.type = type
    this.date = new Date()
  }

  static create = (email, name, type) => {
    const notification = new Notification(name, type)

    const user =
      this.#list.find((user) => user.email === email) ||
      null

    // console.log('user', user)

    if (user) {
      user.notificationList.push(notification)
    } else {
      let userNotif = []
      userNotif.push(notification)

      this.#list.push({
        email: email,
        notificationList: userNotif,
      })
    }

    return notification
  }

  static getUserNotif = (email) => {
    const user = this.#list.find(
      (item) => item.email === email,
    )
    return user === undefined ? [] : user.notificationList
  }

  //for settings page, update user`s email
  static changeEmail = (oldEmail, newEmail) => {
    const user = this.#list.find(
      (item) => item.email === oldEmail,
    )
    user.email = newEmail
    return user
  }
}

module.exports = {
  Notification,
}

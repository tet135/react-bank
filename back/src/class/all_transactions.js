const { Transaction } = require('./transaction')

class Alltransaction {
  //приватний список всіх транзакцій для всіх зареєстврованих користувачів
  static #list = []

  ///не ставити в конструкторі коми!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  constructor(email) {
    this.email = email
    this.transactions = Transaction.getList(email)
  }

  static create = (email) => {
    const all_transaction = new Alltransaction(email)

    this.#list.push(all_transaction)

    return all_transaction
  }

  static get = (email) => {
    return (
      this.#list.find(
        (transactionList) =>
          transactionList.email === email,
      ) || null
    )
  }

  static getList = () => {
    return this.#list
  }
}

module.exports = {
  Alltransaction,
}

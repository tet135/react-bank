const { Transaction } = require('./transaction')

class Alltransaction {
  //приватний список всіх транзакцій для всіх зареєстврованих користувачів
  static #list = []

  ///не ставити в конструкторі коми!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  constructor(email, transactions) {
    this.email = email
    this.transactions = transactions
  }

  static create = (email, transactions) => {
    const user_transactions = new Alltransaction(
      email,
      transactions,
    )

    this.#list.push(user_transactions)

    console.log('list of all transactions', this.#list)

    return user_transactions
  }

  static get = (email) => {
    return (
      this.#list.find(
        (transactionsList) =>
          transactionsList.email === email,
      ) || null
    )
  }
}

module.exports = {
  Alltransaction,
}

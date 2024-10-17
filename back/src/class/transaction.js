class Transaction {
  //приватний список of tokens
  static #list = []

  // static #transactions = []

  ///не ставити в конструкторі коми!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  constructor(
    payer_email,
    payment_system = null,
    recipient_email = null,
    type,
    amount,
  ) {
    this.id = Math.round(Math.random() * 10000)
    this.payer_email = payer_email
    this.payment_system = payment_system
    this.recipient_email = recipient_email
    this.type = type
    this.date = new Date() // in Milliseconds
    this.amount = Number(amount)
  }

  static findUser = (email) => {
    return (
      this.#list.find((user) => user.email === email) ||
      null
    )
  }

  //transactionData = author, type, amount...
  static create = (
    payer_email,
    payment_system = null,
    recipient_email = null,
    type,
    amount,
  ) => {
    const transaction = new Transaction(
      //payer = user that loged in
      payer_email,
      payment_system,
      recipient_email,
      type,
      amount,
    )

    const user = this.findUser(payer_email)

    // console.log('user', user)

    if (user) {
      user.transactions.push(transaction)

      if (transaction.type === 'Sending') {
        user.sum = user.sum - transaction.amount
      } else {
        user.sum += transaction.amount
      }
    } else {
      let userTrans = []
      userTrans.push(transaction)

      this.#list.push({
        email: payer_email,
        sum: transaction.amount,
        transactions: userTrans,
      })
    }

    return transaction
  }

  //need to check!
  static get = (email, id) => {
    const user = this.findUser(email)

    return (
      user.transactions.find(
        (transaction) => transaction.id === Number(id),
      ) || null
    )
  }

  //ok
  static getUserTransactions = (email) => {
    const user = this.#list.find(
      (item) => item.email === email,
    )
    //повертаємо перелік транзакцій
    return user === undefined
      ? []
      : user.transactions.reverse()
  }

  static getSum = (email) => {
    const user = this.findUser(email)
    //повертаємо перелік транзакцій
    return user === undefined ? 0 : user.sum
  }

  static changeEmail = (oldEmail, newEmail) => {
    console.log('old list', this.#list)
    const user = this.findUser(oldEmail)
    user.email = newEmail //ok

    this.#list.forEach(({ transactions, ...rest }) => {
      transactions.forEach((transaction) => {
        if (transaction.recipient_email === oldEmail) {
          transaction.recipient_email = newEmail
        }
        if (transaction.payer_email === oldEmail) {
          transaction.payer_email = newEmail
        }
      })

      console.log('new transactions', transactions)
    })

    console.log('new list', this.#list)
  }
}

module.exports = {
  Transaction,
}

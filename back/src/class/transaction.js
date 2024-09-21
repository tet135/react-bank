class Transaction {
  //приватний список of tokens
  static #list = []

  ///не ставити в конструкторі коми!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  constructor(author, type, amount, email = null) {
    this.id = Math.round(Math.random() * 10000)
    this.author = author
    this.email = email
    this.type = type
    this.date = new Date() // in Milliseconds
    this.amount = Number(amount)
  }

  //transactionData = author, type, amount
  static create = (author, type, amount, email) => {
    const transaction = new Transaction(
      author,
      type,
      amount,
      email,
    )

    this.#list.push(transaction)

    return transaction
  }

  static get = (id) => {
    return (
      this.#list.find(
        (transaction) => transaction.id === Number(id),
      ) || null
    )
  }

  static getList = () => {
    return this.#list
  }
}

module.exports = {
  Transaction,
}

import "./index.css";
import "../../style/click.css";
import "../../style/skeleton.css";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../App";

export default function Component() {
  const context = useContext(AuthContext);
  console.log("context.state.token", context.state.token);

  const STATE = {
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
  };

  const SRC = {
    STRIPE: "/../../../img/stripe.png",
    COINBASE: "/../../../img/coinbase.png",
    SENDER: "/../../../svg/sender.svg",
  };

  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  // console.log("data", data);

  //перемальовуэ зовнійній вигляд в залежності від status
  //враховує status, змінює вигляд element через зміну innerHTML
  const updateView = (status, data) => {
    const element = document.querySelector(".transaction__list");
    // console.log("element", element); //ok
    if (!element) throw new Error("Element is null");

    element.innerHTML = "";
    // console.log("status", status);
    // console.log("data", data);

    switch (status) {
      case STATE.LOADING:
        element.innerHTML = `
        <div class="transaction__container">
          <div class="img_bg skeleton"></div>
          <div class="transaction__info">
            <p class="transaction__sender skeleton"></p>
            <div class="transaction__details skeleton"></div>
          </div>
          <div class="transaction__sum skeleton"></div>
        </div>

        <div class="transaction__container">
          <div class="img_bg skeleton"></div>
          <div class="transaction__info">
            <p class="transaction__sender skeleton"></p>
            <div class="transaction__details skeleton"></div>
          </div>
          <div class="transaction__sum skeleton"></div>
        </div>
            `;
        break;
      case STATE.SUCCESS:
        data.list.forEach((item) => {
          element.innerHTML += `
          <a href="/transaction/${
            item.id
          }" class="transaction__container click">
            <div class="img_bg">
              <img
                class="transaction__img"
                src="${
                  item.type === "Sending"
                    ? SRC.SENDER
                    : item.author === "Coinbase"
                    ? SRC.COINBASE
                    : SRC.STRIPE
                }"
                alt="transaction_method"
                width={18}
                height={18}
              />
            </div>
            <div class="transaction__info">
              <p class="transaction__sender">${item.author}</p>

              <div class="transaction__details">
                <span class="transaction__data">
                  ${item.date.hours}:${item.date.minutes}
                </span>
                <span class="transaction__data">${item.type}</span>
              </div>
            </div>
            <div class="transaction__sum">
              <span class="transaction__dollar ${
                item.type === "Sending" ? "" : "transaction__dollar--received"
              }">${item.type === "Sending" ? "-" : "+"}$</span>
              <span class="transaction__dollar ${
                item.type === "Sending" ? "" : "transaction__dollar--received"
              }">
                ${item.amount.dollars}.
              </span>
              <span class=${
                item.type === "Sending"
                  ? "transaction__coins"
                  : "transaction__coins--received"
              }>
                ${item.amount.coins}
              </span>
            </div>
          </a>
          `;
        });
        break;
      case STATE.ERROR:
        element.innerHTML = `
          <div class="transaction__sender">${data.message}</div>
          `;
        break;
      default:
        return (element.innerHTML = ``);
    }
  };

  //конвертуэ дні, що надходять з бекенду в фронтенд-вигляд
  const convertData = (data) => {
    return {
      ...data,
      list: data.list.map((item) => ({
        ...item,
        date: {
          hours: new Date(item.date).getHours().toString().padEnd(2, "0"),
          minutes: new Date(item.date).getMinutes().toString().padEnd(2, "0"),
        },
        amount: {
          dollars: Math.trunc(Number(item.amount)),
          coins: Math.trunc(
            (Number(item.amount).toFixed(2) - Math.trunc(Number(item.amount))) *
              100
          ),
        },
      })),
    };
  };

  const loadTransactionsList = async () => {
    setStatus(STATE.LOADING);
    console.log("status", status);
    updateView(STATE.LOADING, data);
    // return null;

    //формуємо запит на сервер about getting List of transactions
    try {
      const res = await fetch(
        `http://localhost:4000/balance-data?token=${context.state.token}`,
        {
          method: "GET",
        }
      );

      const data = await res.json();

      //в data = створений Object transaction
      // console.log("data.list == id, author, type, date, amount", data.list); //ok

      if (res.ok) {
        setStatus(STATE.SUCCESS);
        const convertedData = convertData(data);
        // console.log("converted data", convertedData); //ok
        setData(convertedData);
        updateView(STATE.SUCCESS, convertedData);
      } else {
        setStatus(STATE.ERROR);
        setData(data);
        updateView(STATE.ERROR, data);
      }
    } catch (err) {
      setStatus(STATE.ERROR);
      //тут не конвертуэмо
      setData({ message: err.message });
    }
  };

  useEffect(() => {
    loadTransactionsList();
  }, []);

  return <div className="transaction__list"></div>;
}

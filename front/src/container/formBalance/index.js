import "./index.css";
import "../../style/click.css";
import "../../style/skeleton.css";

import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";

import { SRC, STATE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";

export default function Component() {
  console.log("render of formBalance");
  const token = getTokenSession();
  // console.log("token in balance", token); //ok

  const context = useContext(AuthContext);
  console.log("context in balance", context); //ok

  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);

  //перемальовуэ зовнійній вигляд в залежності від status
  //враховує status, змінює вигляд element через зміну innerHTML
  const updateView = (status, data) => {
    const elSum = document.querySelector(".total__container");
    // console.log("total__container", elSum); //ok
    if (!elSum) throw new Error("elSum is null");

    // <TotalBalance sum=${data.sum.dollars} sumCoins=${data.sum.coins} />

    elSum.innerHTML = ``;

    const element = document.querySelector(".transaction__list");
    // console.log("element", element); //ok
    if (!element) throw new Error("Element is null");

    element.innerHTML = "";

    switch (status) {
      case STATE.LOADING:
        elSum.innerHTML = `
        <div class="total skeleton"></div>
        `;

        element.innerHTML = `
        <div class="card__container">
          <div class="card__img_bg skeleton"></div>
          <div class="card_info">
            <p class="card__name skeleton"></p>
            <div class="card__details skeleton"></div>
          </div>
          <div class="transaction__sum skeleton"></div>
        </div>

        <div class="card__container">
          <div class="card__img_bg skeleton"></div>
          <div class="card__info">
            <p class="card__name skeleton"></p>
            <div class="card__details skeleton"></div>
          </div>
          <div class="transaction__sum skeleton"></div>
        </div>
            `;
        break;
      case STATE.SUCCESS:
        elSum.innerHTML = `
        <div class="total">${data.sum.sign}$${data.sum.dollars}</div>
        <div class="total__coins">.${data.sum.coins}</div>
        `;

        data.list &&
          data.list.map((item) => {
            return (element.innerHTML += `
          <a key=${item.id} href='/transaction/${
              item.id
            }' class="card__container click">
            <div class="card__img_bg">
              <img
                src="${
                  item.payment_system === null
                    ? SRC.SENDER
                    : item.payment_system === "Coinbase"
                    ? SRC.COINBASE
                    : SRC.STRIPE
                }"
                alt="transaction_method"
                width={18}
                height={18}
              />
            </div>
            <div class="card__info">
              <p class="card__name">${
                item.payment_system || item.recipient_email
              }</p>

              <div class="card__details">
                <span class="card__data">
                  ${item.date.hours}:${item.date.minutes}
                </span>
                <span class="card__data">${item.type}</span>
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
          `);
          });
        break;
      case STATE.ERROR:
        elSum.innerHTML = `<div class="total"></div>`;

        if (data.message === "You have no transactions yet") {
          elSum.innerHTML = `<div class="total">$0</div>
        `;
        }

        element.innerHTML = `
          <div class="card__name">${data.message}</div>
          `;
        break;
      default:
        return (element.innerHTML = ``);
    }
  };

  //конвертуэ дні, що надходять з бекенду в фронтенд-вигляд
  const convertData = (data) => {
    let total = Number(data.sum).toFixed(2);

    const isMinus = total.toString().slice(0, 1);

    if (isMinus === "-") {
      total = total.toString().slice(1);
    }

    return {
      ...data,
      sum: {
        sign: isMinus === "-" ? "-" : "",
        dollars: Math.trunc(total),
        coins: total.split(".")[1],
      },
      list: data.list.reverse().map((item) => ({
        ...item,
        recipient_email: item.recipient_email.split("@")[0],
        date: {
          hours: new Date(item.date).getHours().toString().padStart(2, "0"),
          minutes: new Date(item.date).getMinutes().toString().padStart(2, "0"),
        },
        amount: {
          dollars: Math.trunc(Number(item.amount)),
          coins: Number(item.amount).toFixed(2).toString().split(".")[1],
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
        `http://localhost:4000/balance-data?token=${token}`,
        {
          method: "GET",
          // headers: {
          //   Authorization: context.state.token,// not working!
          // },
        }
      );

      const data = await res.json();

      //в data = створений Object transaction
      console.log("data = data.sum, data.list", data); //ok

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

  return (
    <div className="transaction__list card__list">
      {/* {data.list &&
        data.list.map((item) => {
          return (
            <Link
              key={item.id}
              to={"/transaction/item.id"}
              className="card__container click"
            >
              <div className="card__img_bg">
                <img
                  src={
                    item.payment_system === null
                      ? SRC.SENDER
                      : item.payment_system === "Coinbase"
                      ? SRC.COINBASE
                      : SRC.STRIPE
                  }
                  alt="transaction_method"
                  width={18}
                  height={18}
                />
              </div>
              <div className="card__info">
                <p className="card__name">
                  {item.payment_system || item.recipient_email}
                </p>

                <div className="card__details">
                  <span className="card__data">
                    {item.date.hours} : {item.date.minutes}
                  </span>
                  <span className="card__data">item.type</span>
                </div>
              </div>
              <div className="transaction__sum">
                <span
                  className={
                    item.type === "Sending"
                      ? "transaction__dollar"
                      : "transaction__dollar transaction__dollar--received"
                  }
                >
                  {item.type === "Sending" ? "-" : "+"}$
                </span>

                <span
                  className={
                    item.type === "Sending"
                      ? "transaction__dollar"
                      : "transaction__dollar transaction__dollar--received"
                  }
                >
                  {item.amount.dollars}.
                </span>
                <span
                  className={
                    item.type === "Sending"
                      ? "transaction__coins"
                      : "transaction__coins--received"
                  }
                >
                  {item.amount.coins}
                </span>
              </div>
            </Link>
          );
        })} */}
    </div>
  );
}

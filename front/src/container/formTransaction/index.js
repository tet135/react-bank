import "./index.css";
import "../../style/click.css";
import "../../style/skeleton.css";

import Divider from "../../component/divider";
import TotalBalance from "../../component/totalBalance";

import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";

export default function Component() {
  const STATE = {
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
  };

  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  // console.log("data", data);
  const navigate = useNavigate();

  const { transactionId } = useParams();
  console.log("transactionId", transactionId);
  if (!transactionId) navigate("/balance");

  //перемальовуэ зовнійній вигляд в залежності від status
  //враховує status, змінює вигляд element через зміну innerHTML
  const updateView = (status, data = null) => {
    const element = document.querySelector(".item__container");
    const amount = document.querySelector(".item__amount");
    // console.log("element", element); //ok
    if (!element) throw new Error("Element is null");

    element.innerHTML = "";
    console.log("status", status);
    console.log("data", data);

    switch (status) {
      case STATE.LOADING:
        amount.innerHTML = `
          <span class="item__dollars skeleton">$...</span>
        `;

        element.innerHTML = `
          <div class="item">
            <div class="item__data">Date</div>
            <div class="item__data skeleton"></div>
          </div>
          <div class="divider"></div>
          <div class="item">
            <div class="item__data">Address/Payment system</div>
            <div class="item__data skeleton"></div>
          </div>
          <div class="divider"></div>
          <div class="item">
            <div class="item__data">Type</div>
            <div class="item__data skeleton"></div>
          </div>
          `;
        break;
      case STATE.SUCCESS:
        const trans = data.transaction;

        amount.innerHTML = `
            <span class="item__dollars ${
              trans.type === "Send" ? "" : "item__dollars--receipt"
            }">${trans.type === "Send" ? "-" : "+"}$${trans.amount.dollars}
            </span>
            <span class="item__coins ${
              trans.type === "Send" ? "" : "item__coins--receipt"
            }">
              .${trans.amount.coins}
            </span
        `;

        element.innerHTML = `
          <div class="item">
            <div class="item__data">Date</div>
            <div class="item__data">
              ${trans.date.day} ${trans.date.mounth}, ${trans.date.hours}:${trans.date.minutes}
            </div>
          </div>
          <div class="divider"></div>
          <div class="item">
            <div class="item__data">${trans.address}</div>
            <div class="item__data">
              ${trans.author}
            </div>
          </div>
          <div class="divider"></div>
          <div class="item">
            <div class="item__data">Type</div>
            <div class="item__data">
              ${trans.type}
            </div>
          </div>
          `;
        break;
      case STATE.ERROR:
        element.innerHTML = `
          <div class="transaction-item">${data.message}</div>
          `;
        break;
      default:
        return (element.innerHTML = ``);
    }
  };

  //конвертуэ дні, що надходять з бекенду в фронтенд-вигляд
  const convertData = (data) => {
    const trans = data.transaction;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return {
      ...data,
      transaction: {
        ...data.transaction,
        date: {
          day: new Date(trans.date).getDate(),

          mounth: monthNames[new Date(trans.date).getMonth()],
          hours: new Date(trans.date).getHours().toString().padEnd(2, "0"),
          minutes: new Date(trans.date).getMinutes().toString().padEnd(2, "0"),
        },
        amount: {
          dollars: Math.trunc(Number(trans.amount)),
          coins: Math.trunc(
            (Number(trans.amount).toFixed(2) -
              Math.trunc(Number(trans.amount))) *
              100
          ),
        },
        type: trans.type === "Receipt" ? "Recive" : "Send",
        address: trans.email ? "Address" : "Payment system",
        author: trans.email
          ? trans.email
          : trans.author === "Coinbase"
          ? "Coinbase"
          : "Stripe",
      },
    };
  };

  const loadTransaction = async () => {
    setStatus(STATE.LOADING);
    console.log("status", status); //ok

    // console.log("transactionId", transactionId); //ok

    updateView(STATE.LOADING);
    // return null;

    //формуємо запит на сервер about getting List of transactions
    try {
      const res = await fetch(
        `http://localhost:4000/transaction-item?id=${transactionId}`,
        {
          method: "GET",
        }
      );
      //в data = конкретна transaction or message(with error)
      const data = await res.json();

      // console.log("data", data); //

      if (res.ok) {
        setStatus(STATE.SUCCESS);
        const convertedData = convertData(data);
        // console.log("converted data", convertedData); //ok
        setData(convertData(data));
        updateView(STATE.SUCCESS, convertedData);
      } else {
        setStatus(STATE.ERROR);
        setData(data);
        updateView(STATE.ERROR, data);
        setTimeout(() => navigate("/balance"), 3000);
        // showAlert("error", data.message);
      }
    } catch (err) {
      setStatus(STATE.ERROR);
      //тут не конвертуэмо
      setData({ message: err.message });
      setTimeout(() => navigate("/balance"), 3000);
    }
  };

  useEffect(() => {
    loadTransaction();
  }, [transactionId]);

  return (
    <Fragment>
      {/* <TotalBalance
        type="{data.transaction.type}"
        sum="{data.transaction.amount.dollars}"
        sumCoins="{data.transaction.amount.dollars}"
      /> */}

      <h1 className="item__amount">Transaction amount loading...</h1>
      <div className="item__container"></div>
    </Fragment>
  );
}

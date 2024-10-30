import "./index.css";
import "../../style/skeleton.css";

import Divider from "../../component/divider";
import TotalBalance from "../../component/totalBalance";

import { AuthContext } from "../../App";

import { STATE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";

import { Fragment, useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Container() {
  const context = useContext(AuthContext);
  console.log("context in form", context);
  console.log("context.state.token in transaction page", context.state.token);

  const { transactionId } = useParams();
  // console.log("transactionId", transactionId);
  const navigate = useNavigate();
  if (!transactionId) navigate("/balance");

  //помилка при валідації інпута
  const [status, setStatus] = useState({});

  //value -  це об'єкn з назвами інпутів та їх актуальними значеннями
  const [value, setValue] = useState({});
  console.log("value", value);

  const token = getTokenSession();
  console.log("token from session", token);
  //++++++++++++++++++++
  const updateView = (status, data) => {
    const element = document.querySelector(".item__container");
    const amount = document.querySelector(".item__amount");
    // console.log("element", element); //ok
    if (!element || !amount) throw new Error("Element or amount is null");

    element.innerHTML = "";
    amount.innerHTML = "";

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
  //+++++++

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
        ...trans,
        date: {
          day: new Date(trans.date).getDate(),

          mounth: monthNames[new Date(trans.date).getMonth()],
          hours: new Date(trans.date).getHours().toString().padEnd(2, "0"),
          minutes: new Date(trans.date).getMinutes().toString().padEnd(2, "0"),
        },
        amount: {
          dollars: Math.trunc(Number(trans.amount)),
          coins: Math.round(
            (Number(trans.amount) - Math.trunc(Number(trans.amount))) * 100
          )
            .toString()
            .padStart(2, "0"),
        },
        type: trans.type === "Receipt" ? "Recive" : "Send",
        address: trans.payment_system ? "Payment system" : "Address",
        author: trans.payment_system
          ? trans.payment_system
          : trans.recipient_email,
      },
    };
  };

  //++++++++++++++

  const loadTransaction = async () => {
    setStatus(STATE.LOADING);
    console.log("status", status); //ok

    // console.log("transactionId", transactionId); //ok

    updateView(STATE.LOADING, value); //чи треба тут value?
    // return null;

    //формуємо запит на сервер about getting List of transactions
    try {
      const res = await fetch(
        `http://localhost:4000/transaction-item?id=${transactionId}&token=${token}`,
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
        setValue(convertedData);
        updateView(STATE.SUCCESS, convertedData);
      } else {
        setStatus(STATE.ERROR);
        setValue(data);
        updateView(STATE.ERROR, data);
        // setTimeout(() => navigate("/balance"), 3000);
        // showAlert("error", data.message);
      }
    } catch (err) {
      setStatus(STATE.ERROR);
      //тут не конвертуэмо
      setValue({ message: err.message });
      // setTimeout(() => navigate("/balance"), 3000);
    }
  };

  useEffect(() => {
    loadTransaction();
  }, []);

  return (
    <Fragment>
      <h1 className="item__amount">Transaction amount loading...</h1>
      <div className="item__container"></div>
    </Fragment>
  );
}

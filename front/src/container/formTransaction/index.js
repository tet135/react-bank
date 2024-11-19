import "./index.css";
import "../../style/skeleton.css";

import { AuthContext } from "../../App";

import { STATE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";

import {
  Fragment,
  useContext,
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from "react";

import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "../../component/skeletonTransaction";
import TotalBalance from "../../component/totalBalance";
const TransactionItem = lazy(() => import("../../component/transactionItem"));

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
  // console.log("token from session", token);

  const convertData = useCallback((data) => {
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
          sign: trans.type === "Sending" ? "-" : "+",
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
  }, []);

  //++++++++++++++

  const loadTransaction = useCallback(async () => {
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
        // updateView(STATE.SUCCESS, convertedData);
      } else {
        setStatus(STATE.ERROR);
        setValue(data);
        // updateView(STATE.ERROR, data);
        // setTimeout(() => navigate("/balance"), 3000);
        // showAlert("error", data.message);
      }
    } catch (err) {
      setStatus(STATE.ERROR);
      //тут не конвертуэмо
      setValue({ message: err.message });
      // setTimeout(() => navigate("/balance"), 3000);
    }
  }, [convertData, transactionId, token]);

  useEffect(() => {
    loadTransaction();
  }, []);

  return (
    <Fragment>
      {status === STATE.SUCCESS && (
        <Suspense fallback={<span class="total skeleton">$...</span>}>
          <TotalBalance sum={value.transaction.amount} />
        </Suspense>
      )}

      <div className="item__container">
        {status === STATE.SUCCESS && (
          <Suspense fallback={<Skeleton />}>
            <TransactionItem trans={value.transaction} />
          </Suspense>
        )}
        {status === STATE.ERROR && (
          <div style={{ color: "red" }}>{value.message}</div>
        )}
      </div>
    </Fragment>
  );
}

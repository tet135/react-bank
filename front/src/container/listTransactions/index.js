import "./index.css";
import "../../style/skeleton.css";

import { STATE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";
import { reducer, initState, ACTION_TYPE } from "../../util/reduser";

import {
  Fragment,
  useReducer,
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
  const { transactionId } = useParams();
  // console.log("transactionId", transactionId);
  const navigate = useNavigate();
  if (!transactionId) navigate("/balance");

  const [state, dispatch] = useReducer(reducer, initState);

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
    //request: getting List of transactions
    try {
      const res = await fetch(
        `http://localhost:4000/transaction-item?id=${transactionId}&token=${token}`,
        {
          method: "GET",
        }
      );
      //в data = конкретна transaction or message(with error)
      const data = await res.json();

      if (res.ok) {
        dispatch({ type: ACTION_TYPE.SUCCESS, payload: convertData(data) });
      } else {
        dispatch({ type: ACTION_TYPE.ERROR, payload: data });
      }
    } catch (err) {
      dispatch({ type: ACTION_TYPE.ERROR, payload: err.message });
    }
  }, [transactionId, token, convertData]);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  return (
    <Fragment>
      {state.status === STATE.SUCCESS && (
        <Suspense fallback={<span class="total skeleton">$...</span>}>
          <TotalBalance sum={state.data.transaction.amount} />
        </Suspense>
      )}

      <div className="item__container">
        {state.status === STATE.SUCCESS && (
          <Suspense fallback={<Skeleton />}>
            <TransactionItem trans={state.data.transaction} />
          </Suspense>
        )}
        {state.status === STATE.ERROR && (
          <div style={{ color: "red" }}>{state.message}</div>
        )}
      </div>
    </Fragment>
  );
}

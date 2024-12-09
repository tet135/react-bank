import "./index.css";
import "../../style/click.css";
import "../../style/skeleton.css";

import {
  useEffect,
  useReducer,
  Suspense,
  lazy,
  Fragment,
  useCallback,
} from "react";

import { STATE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";
import { reducer, initState, ACTION_TYPE } from "../../util/reduser";

import Skeleton from "../../component/skeletonTransList";
import HeadingBalance from "../../component/heading_balance";
const LazyTransactionsList = lazy(() => import("../../component/transList"));

export default function Component() {
  const token = getTokenSession();

  const [state, dispatch] = useReducer(reducer, initState);

  const convertData = useCallback((data) => {
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
  }, []);

  const loadTransactionsList = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/balance-data?token=${token}`,
        {
          method: "GET",
          // headers: {
          //   Authorization: context.state.token,
          // },
        }
      );

      const data = await res.json();

      if (res.ok) {
        dispatch({ type: ACTION_TYPE.SUCCESS, payload: convertData(data) });
      } else {
        dispatch({ type: ACTION_TYPE.ERROR, payload: data });
      }
    } catch (err) {
      dispatch({ type: ACTION_TYPE.ERROR, payload: err.message });
    }
  }, [token, convertData]);

  useEffect(() => {
    loadTransactionsList();
  }, []);

  return (
    <Fragment>
      {state.status === STATE.ERROR && <HeadingBalance sum={null} />}

      {state.status === STATE.SUCCESS && (
        <HeadingBalance sum={state.data.sum} />
      )}

      <div className="transaction__list card__list">
        {state.status === STATE.ERROR && (
          <Fragment>
            <div style={{ font: "16px", fontWeight: "bold" }}>
              {state.data.message}
            </div>
          </Fragment>
        )}

        {state.status === STATE.SUCCESS && (
          <Fragment>
            {state.data.list &&
              state.data.list.map((item) => {
                return (
                  <Fragment key={item.id}>
                    <Suspense fallback={<Skeleton />}>
                      <LazyTransactionsList transaction={item} />
                    </Suspense>
                  </Fragment>
                );
              })}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

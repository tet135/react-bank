import "./index.css";
import "../../style/click.css";
import "../../style/skeleton.css";

import {
  useEffect,
  useState,
  Suspense,
  lazy,
  Fragment,
  useCallback,
} from "react";

import { STATE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";

import Skeleton from "../../component/skeletonTransList";
import HeadingBalance from "../../component/heading_balance";
const LazyTransactionsList = lazy(() => import("../../component/transList"));

export default function Component() {
  const token = getTokenSession();
  // console.log("token in balance", token); //ok

  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);

  //конвертуэ дні, що надходять з бекенду в фронтенд-вигляд
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

      //в data = створений Object transaction
      // console.log("data = data.sum, data.list", data); //ok

      if (res.ok) {
        setStatus(STATE.SUCCESS);
        const convertedData = convertData(data);
        // console.log("converted data", convertedData); //ok
        setData(convertedData);
        // console.log("data", data); //ok
      } else {
        setStatus(STATE.ERROR);
        setData(data);
      }
    } catch (err) {
      setStatus(STATE.ERROR);
      //тут не конвертуэмо
      setData({ message: err.message });
    }
  }, [convertData, token]);

  useEffect(() => {
    loadTransactionsList();
  }, []);

  return (
    <Fragment>
      {status === STATE.ERROR && <HeadingBalance sum={null} />}

      {status === STATE.SUCCESS && <HeadingBalance sum={data.sum} />}

      <div className="transaction__list card__list">
        {status === STATE.ERROR && (
          <Fragment>
            <div style={{ font: "16px", fontWeight: "bold" }}>
              {data.message}
            </div>
          </Fragment>
        )}

        {status === STATE.SUCCESS && (
          <Fragment>
            {data.list &&
              data.list.map((item) => {
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

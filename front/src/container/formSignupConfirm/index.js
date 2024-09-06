import "./index.css";

import Button from "../../component/button";
import Input from "../../component/input";
import Alert from "../../component/alert";

import { AuthContext } from "../../App";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ALERT, FIELD_NANE } from "../../util/configConsts";

import { validate } from "../../util/validate";
import { checkDisabled } from "../../util/checkDisabled";
import { showAlert } from "../../util/showAlert";
import { validateAll } from "../../util/validateAll";
import { changeInputOnError } from "../../util/changeInputOnError";
import { saveSession, getTokenSession } from "../../util/session";
import { updateGlobalState } from "../../util/updateGlobalState";

import { REQUEST_ACTION_TYPE } from "../../util/glogalReducer";

export default function Container({ buttonPath }) {
  const context = useContext(AuthContext);

  const [error, setError] = useState({});
  const [value, setValue] = useState({});
  const [disabled, setDisabled] = useState(true);

  const navigate = useNavigate();

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;
    const inputName = event.target.name;
    // console.log("inputValue", "inputName", inputName, inputValue);//ok
    setValue({ ...value, [inputName]: inputValue });
    // console.log("value", value); //ok, але відображає дані - один символ((((((((((()))))))))))

    // validation();
    const inputError = validate(inputName, inputValue); //текст помилки або underfined(=немаэ помилки
    // console.log("inputError", inputError);

    if (Boolean(inputError)) {
      //змінює інтерфейс при помилці
      changeInputOnError(inputName, error[inputName]);
      //в функцію setError передаємо нове значення стану(=помилку)
      setError({ ...error, [inputName]: inputError });
      // console.log("error", error); //ok
    } else {
      //змінює інтерфейс, коли поле пройшло валідацію успішно
      changeInputOnError(inputName, error[inputName]);

      //в функцію setError передаємо нове значення помилки null
      setError({ ...error, [inputName]: null });
      // console.log("error", error);

      //видаляэмо
      delete error[inputName]; //ввидаляэ з першого інпута, коли з'являється другий, то знов з'являється перший
      //   console.log("error after delete error[inputName]", error);
    }

    checkDisabled(value, error, disabled, setDisabled);
  };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const submit = async () => {
    // console.log("disabled in submit", disabled); //false
    if (disabled === true) {
      // console.log("works disabled === true");
      validateAll(value, setDisabled);
    } else {
      // console.log(value); //ok returns code

      showAlert("progress", ALERT.PROGRESS); //ok

      //відправити дані реєстрації на бекенд - формуємо запит на сервер на реєстрацію користувача
      try {
        const res = await fetch(`http://localhost:4000/signup-confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [FIELD_NANE.CODE]: Number(value[FIELD_NANE.CODE]),
            token: getTokenSession(),

            // token: context.token,
          }),
        });

        const data = await res.json();
        // console.log("data in sighup-confirm", data); // {message, session}

        if (res.ok) {
          // console.log("res.ok");
          showAlert("success", ALERT.SUCCESS_CONFIRM);

          //зберегли сесію
          saveSession(data.session);

          //перейти на сторінку '/balance'
          setTimeout(() => navigate("/balance"), 3000);

          //записали user в AuthContext//data={token, user: {email, isConfirm}}
          updateGlobalState(REQUEST_ACTION_TYPE.CONFIRM, data.session, context);
        } else {
          showAlert("error", data.message);
        }
      } catch (err) {
        showAlert("error", err.message);
      }
    }
  };

  const handleSubmit = (e) => {
    submit();
  };

  // document.addEventListener("DOMContentLoaded", () => {
  //   try {
  //     if (window.session.user.isConfirm) navigate("/balance");
  //   } catch (err) {}
  // });

  return (
    <form className="form">
      <Input
        handleChangeInput={handleChangeInput}
        label="Code"
        placeholder="you code"
        name={FIELD_NANE.CODE}
      />
      <Button
        handleClick={handleSubmit}
        path={buttonPath}
        classModificator="primary"
      >
        Confirm
      </Button>
      <Alert />
    </form>
  );
}

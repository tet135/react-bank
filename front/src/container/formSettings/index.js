import "./index.css";
import "../../style/click.css";
import "../../style/form.css";

import Button from "../../component/button";
import Input from "../../component/input";
import Alert from "../../component/alert";
import Title from "../../component/title";
import Divider from "../../component/divider";

import { useContext, useState } from "react";

import { AuthContext } from "../../App";

import { checkDisabled } from "../../util/checkDisabled";
import { validate } from "../../util/validate";
import { showAlert } from "../../util/showAlert";
import { validateAll } from "../../util/validateAll";
import { changeInputOnError } from "../../util/changeInputOnError";
import { REQUEST_ACTION_TYPE } from "../../util/globalReducer";
import { ALERT, FIELD_NANE } from "../../util/configConsts";
import { saveSession } from "../../util/session";
import { updateGlobalState } from "../../util/updateGlobalState";
import { getTokenSession } from "../../util/session";

export default function Container({ text, toggle }) {
  const newInput = `${text}_new`;
  const context = useContext(AuthContext);
  console.log("context in settings", context);

  const token = getTokenSession();

  const [error, setError] = useState({});

  const [value, setValue] = useState({});

  const [disabled, setDisabled] = useState(true);

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

    // console.log("error", error);

    checkDisabled(value, error, disabled, setDisabled, `Save ${text}`);
  };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const submit = async () => {
    // console.log("disabled in submit", disabled); //false
    if (disabled === true) {
      // console.log("works disabled === true");
      validateAll(value, setDisabled);
      //ще показати поле, яке треба заповнити?!
    } else {
      // console.log(value); //ok returns   {email: 'test@mail.com', password: 'Dfgdf12d34'}

      showAlert("progress", ALERT.PROGRESS, text);
      const inputs = document.querySelectorAll("input");
      // console.log(inputs); //returns 4 inputs
      //відправити дані реєстрації на бекенд - формуємо запит на сервер на відновлення пошти
      try {
        const res = await fetch(`http://localhost:4000/settings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,

            oldPassword: value.password_old,
            changedInput: newInput,
            changedData: value[newInput],
          }),
        });

        const data = await res.json();
        // console.log("data.session", data.session);

        if (res.ok) {
          // console.log("res.ok");
          if (newInput === FIELD_NANE.EMAIL_NEW) {
            console.log("change email");
            showAlert("success", ALERT.SUCCESS_EMAIL_CHANGED, text);
            //записали user в AuthContext//data={token, user: {email, isConfirm}}
            updateGlobalState(
              REQUEST_ACTION_TYPE.UPDATE,
              data.session,
              context
            );
            //зберегли сесію
            saveSession(data.session);
            // //очистити поля! після відправки форми
            inputs[0].value = "";
            inputs[1].value = "";
            //прибрали алерт
            setTimeout(() => showAlert("", null, text), 3000);
          }

          if (newInput === FIELD_NANE.PASSWORD_NEW) {
            console.log("change password");
            showAlert("success", ALERT.SUCCESS_PASSWORD_CHANGED, text);

            updateGlobalState(
              REQUEST_ACTION_TYPE.UPDATE,
              data.session,
              context
            );

            saveSession(data.session);

            // //очистити поля! після відправки форми
            inputs[2].value = "";
            inputs[3].value = "";
            //прибрали алерт
            setTimeout(() => showAlert("", null, text), 3000);
          }

          // }
        } else {
          showAlert("error", data.message, text);
          setTimeout(() => showAlert("", null, text), 5000);
          if (text === "email") inputs[1].value = "";
          if (text === "password") inputs[3].value = "";
        }
      } catch (err) {
        showAlert("error", err.message, text);
        setTimeout(() => showAlert("", null, text), 5000);
        if (text === "email") inputs[1].value = "";
        if (text === "password") inputs[3].value = "";
      }
    }
  };

  return (
    <form className="form" name={text}>
      <Title>Change {text}</Title>
      <Input
        handleChangeInput={handleChangeInput}
        label="Old password"
        placeholder="password"
        name={FIELD_NANE.PASSWORD_OLD}
        toggle={true}
      />
      <Input
        handleChangeInput={handleChangeInput}
        label={`New ${text}`}
        placeholder="example@gmail.com"
        name={newInput}
        toggle={toggle}
      />

      <Button
        handleClick={submit}
        // path={buttonPath}
        classModificator="secondary"
        id={`Save ${text}`}
        disabled={disabled}
      >
        {`Save ${text}`}
      </Button>

      <Alert />
      <Divider />
    </form>
  );
}

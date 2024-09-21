import "./index.css";
import "../../style/click.css";

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
import { REQUEST_ACTION_TYPE } from "../../util/glogalReducer";
import { ALERT, FIELD_NANE } from "../../util/configConsts";
import { saveSession } from "../../util/session";
import { updateGlobalState } from "../../util/updateGlobalState";

export default function Container({
  newInput,
  inputLabel,
  toggle,
  buttonText,
  buttonPath,
}) {
  const context = useContext(AuthContext);

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

    checkDisabled(value, error, disabled, setDisabled, buttonText);
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

      showAlert("progress", ALERT.PROGRESS, buttonText); //ok

      console.log("value", value);
      console.log("newInput", newInput);
      console.log("value[newInput]", value[newInput]);

      //відправити дані реєстрації на бекенд - формуємо запит на сервер на відновлення пошти
      try {
        const res = await fetch(`http://localhost:4000/settings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // token: context.state.token,
            // email: value.email,
            // password: value.password,

            token: context.state.token,

            oldPassword: value.password_old,
            changedInput: newInput,
            changedData: value[newInput],
          }),
        });

        const data = await res.json();
        console.log("data.session", data.session); //undefined(((((((((((((())))))))))))))

        if (res.ok) {
          // console.log("res.ok");
          if (newInput === FIELD_NANE.EMAIL_NEW) {
            showAlert("success", ALERT.SUCCESS_EMAIL_CHANGED);

            // showAlert(
            //   "success",
            //   ALERT.SUCCESS_EMAIL_CHANGED,
            //   `alert-${buttonText}`
            // );

            //записали user в AuthContext//data={token, user: {email, isConfirm}}
            updateGlobalState(
              REQUEST_ACTION_TYPE.UPDATE,
              data.session,
              context
            );
            //зберегли сесію
            saveSession(data.session);
            //прибрали алерт
            // setTimeout(showAlert(), 3000);
          }

          if (newInput === FIELD_NANE.PASSWORD_NEW) {
            showAlert("success", ALERT.SUCCESS_PASSWORD_CHANGED);

            // showAlert(
            //   "success",
            //   ALERT.SUCCESS_PASSWORD_CHANGED,
            //   `alert-${buttonText}`
            // );
            //прибрали алерт
            // setTimeout(showAlert(), 3000);
          }

          // //очистити поля! після відправки форми
          // if (isSubmitted) {
          // const inputs = document.querySelectorAll("input");
          // console.log(inputs); //returns 4 inputs
          // inputs.values("");

          // }
        } else {
          showAlert("error", data.message, `alert-${buttonText}`);
          showAlert("error", data.message);
        }
      } catch (err) {
        showAlert("error", err.message);
        // showAlert("error", err.message, `alert-${buttonText}`);
      }
    }
  };

  const handleSubmit = (e) => {
    submit();
  };

  return (
    <form className="form">
      <Title>Change email</Title>
      <Input
        handleChangeInput={handleChangeInput}
        label="Old password"
        placeholder="password"
        name={FIELD_NANE.PASSWORD_OLD}
        toggle={true}
      />
      <Input
        handleChangeInput={handleChangeInput}
        label={inputLabel}
        placeholder="example@gmail.com"
        name={newInput}
        toggle={toggle}
      />

      <Button
        handleClick={handleSubmit}
        path={buttonPath}
        classModificator="secondary"
        id={buttonText}
        disabled={disabled}
      >
        {buttonText}
      </Button>
      <Alert />
      {/* <Alert id={`alert-${buttonText}`} /> */}
      <Divider />
    </form>
  );
}

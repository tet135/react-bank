import { validate } from "./validate";
import { changeInputOnError } from "./changeInputOnError";

export const setFieldError = (value, error, setError) => {
  const name = value.name;
  const inputError = validate(name, value[name]); //текст помилки або underfined(=немаэ помилки
  // console.log("inputError", inputError);

  if (Boolean(inputError)) {
    //змінює інтерфейс при помилці
    changeInputOnError(name, error[name]);
    //в функцію setError передаємо нове значення стану(=помилку)
    setError({ ...error, [name]: inputError });
    // console.log("error", error); //ok
  } else {
    //змінює інтерфейс, коли поле пройшло валідацію успішно
    changeInputOnError(name, error[name]);

    //в функцію setError передаємо нове значення помилки null
    setError({ ...error, [name]: null });
    // console.log("error", error);

    //видаляэмо
    delete error[name]; //ввидаляэ з першого інпута, коли з'являється другий, то знов з'являється перший
    //   console.log("error after delete error[inputName]", error);
  }
};

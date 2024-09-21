// перевіряє всі інпути і перемальовує кнопку
export const checkDisabled = (
  value,
  error,
  disabled = true,
  setDisabled,
  id
) => {
  Object.keys(value).forEach((name) => {
    setDisabled(false);
    //value[name] === "undefined" - коли значення не введене
    // console.log("error[name]", error.name);
    // console.log("value[name] === undefined", value[name] === undefined);
    if (error[name] || value[name] === undefined) {
      setDisabled(true);
    }
  });
  // console.log("disabled after checkDisabled", disabled);

  //знаходимо кнопку
  let button = null;
  if (id) {
    button = document.querySelector(`#${id}`);
  } else {
    button = document.querySelector(".button");
  }
  //робимо кнопку активною
  if (button) {
    button.classList.toggle("disabled", Boolean(disabled));
    button.disabled = Boolean(disabled);
  }
};

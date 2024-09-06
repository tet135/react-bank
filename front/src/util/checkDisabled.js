// перевіряє всі інпути і перемальовує кнопку
export const checkDisabled = (value, error, disabled, setDisabled) => {
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

  //робимо кнопку активною
  const button = document.querySelector(".button");
  if (button) {
    button.classList.toggle("disabled", Boolean(disabled));
  }
};

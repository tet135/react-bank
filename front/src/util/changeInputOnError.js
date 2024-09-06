//змінює інтерфейс при помилці на червоне
//name = input`s name
export const changeInputOnError = (name, error) => {
  const input = document.querySelector(`.input[name="${name}"]`);
  // console.log("input", input);
  if (input) {
    input.classList.toggle("validation", Boolean(error));
  }

  // const label = event.target.parentElement.previousElementSibling;
  const label = document.querySelector(`.input__label[name="${name}"]`);
  // console.log("label", label);
  if (label) {
    label.classList.toggle("input__label--error", Boolean(error));
  }

  // const span = event.target.parentElement.nextElementSibling;
  const span = document.querySelector(`.input__error[name="${name}"]`);
  // console.log("span", span);
  if (span) {
    span.classList.toggle("show", Boolean(error));
    span.innerText = error || "";
  }
};

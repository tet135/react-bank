import { ALERT } from "./configConsts";
import { showAlert } from "./showAlert";
import { validate } from "./validate";

// //видає алерт про помилку в заповненні форми
export const validateAll = (value, setDisabled) => {
  Object.keys(value).forEach((name) => {
    const error = validate(name, value[name]);
    // console.log("name in validateAll, value[name]", name, value[name]);
    // console.log("error in validatetAll", error);

    if (error) {
      showAlert("novalid", ALERT.FIELD_NOT_VALID);
      setDisabled(name, true);
    }
    setDisabled(name, false);
  });
};
//+++++++++++++++++++++++

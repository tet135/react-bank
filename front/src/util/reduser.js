//стандартне використання редьюсера  - відправка даних на сервер

//всі перевірки, валідації даних краще робити в хуці (функції handle), тобто до виклику dispatch.
//а reducer тримати чистим, бо нечистий редюсер викликаэ додаткові рендери компонента

export const ACTION_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
};

export const initState = {
  status: null,
  data: null,
  message: null,
};

//Функция reducer принимает два аргумента: state (=предыдущее состояние) и action(=действие) и обязательно возвращает новое состояние(return!!!).
//in action есть обязательное поле type и необязательное payload - це значення нашого action(= data aбо value)

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.SUCCESS:
      return {
        ...state,
        status: action.type,
        data: action.payload,
      };
    case ACTION_TYPE.ERROR:
      return {
        ...state,
        message: action.payload,
      };
    default: {
      return { ...state };
    }
  }
};

//стандартне використання редьюсера  - відправка даних на сервер

//всі перевірки, валідації даних краще робити в хуці (функції handle), тобто до виклику dispatch.
//а reducer тримати чистим, бо нечистий редюсер викликаэ додаткові рендери компонента

// const [state, dispatch] = useReducer(glogalReducer, initGlobalState);

//csll for dispatch:
// export const updateGlobalState = (user) => {
//   // виклик
//   //dispatch знаходиться в контексті!
//   dispatch({
//     type: REQUEST_ACTION_TYPE.LOGIN,
//     payload: {
//       email: user.email,
//       password: user.password,
//       token: "передать сгенерированный токен",
//     },
//   });

//   const id = user.id;
//   //   виклик
//   dispatch({ type: REQUEST_ACTION_TYPE.LOGOUT, payload: id });
// };

export const REQUEST_ACTION_TYPE = {
  LOGIN: "logіn",
  LOGOUT: "logout",
  UPDATE: "update",
  CONFIRM: "confirm",
};

export const initGlobalState = {
  user: {},
  token: null,
};

//Функция reducer принимает два аргумента: state (=предыдущее состояние) и action(=действие) и обязательно возвращает новое состояние(return!!!).
//in action есть обязательное поле type и необязательное payload - це значення нашого action(= data aбо value)

export const globalReducer = (globalState, action) => {
  switch (action.type) {
    case REQUEST_ACTION_TYPE.LOGIN:
      // console.log("action.payload", action.payload); //ok, returns:    user: {email: 'test@mail.com', isConfirm: false}
      return {
        ...globalState,
        user: {
          email: action.payload.user.email, //action.payload містить дані з session
          isConfirm: action.payload.user.isConfirm,
        },
        token: action.payload.token, //ok
      };
    case REQUEST_ACTION_TYPE.LOGOUT:
      return {
        ...globalState,
        user: null,
        token: null,
      };
    //де використовуэться???
    // case REQUEST_ACTION_TYPE.UPDATE:
    //   return {
    //     ...globalState,
    //     user: {
    //       ...globalState.user,
    //       ...action.payload,
    //     },
    //   };
    case REQUEST_ACTION_TYPE.CONFIRM:
      return {
        ...globalState,
        user: globalState.user
          ? { ...globalState.user, isConfirm: action.payload.user.isConfirm }
          : null,
      };
    default: {
      return { ...globalState };
    }
  }
};

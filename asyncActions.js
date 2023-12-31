const redux = require("redux");
const thunkMiddleware = require("redux-thunk").default;
const axios = require("axios");

const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;

// Initial State
const initialState = {
  loading: false,
  users: [],
  error: "",
};

// Actions
const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

// Action creators
const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

// Reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

/**
 * Async action creator
 * --------------------
 * An action creator returns an action but thunk middleware provides the ability
 * to an action creator to return a `function` instead of an action object.
 *
 * What special about this `function` is, it does not have to be pure function.
 * So it is allowed to have side effects such as async API calls.
 *
 * This function can also `dispatch` actions. It receives the `dispatch` method as it's argument.
 */
const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUsersRequest()); // this will basically set loading to true

    const users = axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        // response.data is the array of users
        const users = response.data.map((user) => user.name);
        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {
        // error.message is the error description
        dispatch(fetchUsersFailure(error.message));
      });
  };
};

// Store
const store = createStore(reducer, applyMiddleware(thunkMiddleware));

// Subscribe to the store
store.subscribe(() => {
  console.log(store.getState());
});

// dispatch the async action creator
store.dispatch(fetchUsers());

import { requestTeas, postTea, requestTea} from "../utils/tea_api_utils";

const RECEIVE_TEA = 'RECEIVE_TEA';
const RECEIVE_TEAS = 'RECEIVE_TEAS';
const REMOVE_TEA = 'REMOVE_TEA';
export const RECEIVE_TEA_DETAIL = 'RECEIVE_TEA_DETAIL';

/* ------ prebuild selectors ------*/
export const selectTea = (teaId) => state => state.teas[teaId];


/* ----ACTION CREATORS---- */

export const receiveTea = tea => {
  return {
    type: RECEIVE_TEA,
    tea
  }
};

export const receiveTeas = teas => {
  return {
    type: RECEIVE_TEAS,
    teas
  }
};

export const removeTea = teaId => ({
  type: REMOVE_TEA,
  teaId
});

// we pass in payload as the argument because we aren't receiving only one type of data (there are transactions also)
export const receiveTeaDetail = payload => {
  return {
    type: RECEIVE_TEA_DETAIL,
    payload
  }
}

/* ----THUNK ACTION CREATORS---- */
export const fetchAllTeas = () => (dispatch) => {
  return requestTeas()
    .then(res => res.json())
    .then(data => dispatch(receiveTeas(data)));
}
// do async version
// export const fetchAsync

export const createTea = (tea) => (dispatch) => {
  return postTea(tea)
    .then(res => res.json())
    .then(data => dispatch(receiveTea(data)))
}

export const fetchTea = (teaId) => async (dispatch) => {
  const res = await requestTea(teaId);
  const data = await res.json();
  dispatch(receiveTeaDetail(data)); 
}

/* ----REDUCER---- */

//state in line 49 is just a tea slice of state
//how do we know if a state is a slice of state/global state?
//if we're not using combine reducers, we're going to interact with teaReducer
const teaReducer = (state = {}, action) => {
  Object.freeze(state);
  const nextState = { ...state };

  switch (action.type) {
    case RECEIVE_TEA:
      nextState[action.tea.id] = action.tea;
      return nextState;
    case RECEIVE_TEAS:
      return { ...nextState, ...action.teas };
    case RECEIVE_TEA_DETAIL:
      nextState[action.payload.tea.id] = action.payload.tea;
      return nextState;
    case REMOVE_TEA:
      delete nextState[action.teaId];
      return nextState;
    default:
      return nextState;
  };
};

export default teaReducer;

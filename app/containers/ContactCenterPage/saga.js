import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_CONTACT_CENTER, DELETE_CONTACT_CENTER } from './constants';
import { CONTACT_CENTER } from '../../config/urlConfig';
import request from '../../utils/request';
import {
  getContactCenterSuccessAction,
  getContactCenterErrorAction,
  deleteContactCenterAction,
  deleteContactCenterSuccessAction,
  deleteContactCenterErrorAction,
} from './actions';
export function* fetchGetContacts(action) {
  try {
    const { query } = action;
    let URL = '';
    if (query) {
      URL = `${CONTACT_CENTER}?${query}`;
    } else {
      URL = CONTACT_CENTER;
    }
    const data = yield call(request, URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getContactCenterSuccessAction(data.data));
  } catch (err) {
    yield put(getContactCenterErrorAction(err));
  }
}

export function* fetchDeleteContacts(action) {
  console.log('actiondelete', action);
  try {
    let URL = `${CONTACT_CENTER}/${action.deleteIds}`;

    const data = yield call(request, URL, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(deleteContactCenterSuccessAction(data.data));
  } catch (err) {
    yield put(deleteContactCenterErrorAction(err));
  }
}
// Individual exports for testing
export default function* contactCenterPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_CONTACT_CENTER, fetchGetContacts);
  yield takeLatest(DELETE_CONTACT_CENTER, fetchDeleteContacts);
}

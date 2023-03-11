// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_CRM_CAMPAIGN } from 'config/urlConfig';
import { getCampaignFailed, getCampaignSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';

function* getCampaignSaga() {
  try {
    const data = yield call(request, API_CRM_CAMPAIGN, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(getCampaignSuccess(data.data));
    } else {
      yield put(getCampaignFailed());
    }
  } catch (error) {
    yield put(getCampaignFailed());
  }
}

// Individual exports for testing
export default function* campaignPageSaga() {
  yield takeLatest('GET_CAMPAIGN', getCampaignSaga);
}

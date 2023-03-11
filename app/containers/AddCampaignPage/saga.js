import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_CUSTOMERS, UPLOAD_IMG_SINGLE, GET_PROP_SET, API_USERS, API_SOURCE_CRMCONFIG, API_CRM_CAMPAIGN } from 'config/urlConfig';
import { getInfoSuccess, getInfoFailed, postCampaignFailed, postCampaignSuccess, putCampaignFailed, getAttributeSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
// Individual exports for testing
function* getCampaign(action) {
  try {
    const data = yield call(request, `${API_CRM_CAMPAIGN}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const attributesData = yield call(request, GET_PROP_SET, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const resource = yield call(request, API_SOURCE_CRMCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const users = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // const voucher = yield call(request, `${API_CUSTOMERS}/voucher`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // });
    const attributes = attributesData.data.filter(item => item.objects.customer === true);
    const listAtt = {};
    // attributes.forEach(att =>
    //   att.attributeGroups.forEach(item =>
    //     item.attributes.forEach(element => {
    //       if (data.detailInfo.typeCustomer.setAttribute && data.detailInfo.typeCustomer.setAttribute[element.attributeId])
    //         listAtt[element.attributeId] = data.detailInfo.typeCustomer.setAttribute[element.attributeId];
    //       else listAtt[element.attributeId] = [];
    //     }),
    //   ),
    // );
    if (data) {
      yield put(getInfoSuccess(data, attributes, listAtt, users, resource));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Không thể lấy dữ liệu khách hàng hoặc bộ thuộc tính', variant: 'error' }));
      yield put(getInfoFailed());
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Không thể lấy dữ liệu khách hàng hoặc bộ thuộc tính', variant: 'error' }));
    yield put(getInfoFailed());
  }
}

function* getAttribute() {
  try {
    const attributesData = yield call(request, GET_PROP_SET, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const users = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const resource = yield call(request, API_SOURCE_CRMCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const attributes = attributesData.data.filter(item => item.objects.customer === true);
    const listAtt = {};
    attributes.forEach(att =>
      att.attributeGroups.forEach(item =>
        item.attributes.forEach(element => {
          listAtt[element.attributeId] = [];
        }),
      ),
    );
    yield put(getAttributeSuccess(attributes, listAtt, users.data, resource));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Không thể lấy dữ liệu CRMConfig hoặc bộ thuộc tính', variant: 'error' }));
  }
}

// Thêm mới khách hàng

function* postCampaign(action) {
  console.log('action', action);
  try {
    let logo;
    if (action.data.avatar === null || !action.data.avatar) {
      if (action.data.image) {
        logo = action.data.image;
      } else {
        logo = null;
      }
    } else {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const upload = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {},
        body: formData,
      });
      logo = upload.url;
    }
    action.data.image = logo;
    const data = yield call(request, API_CRM_CAMPAIGN, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(changeSnackbar({ status: true, message: 'Thêm mới chiến dịch thành công', variant: 'success' }));

    if (action.data.callback) {
      action.data.callback(data);
    } else {
      yield put(postCampaignSuccess());
      yield put(push('/crm/crmCampaign'));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: error.message, variant: 'error' }));
    yield put(postCampaignFailed());
  }
}

function* putCampaign(action) {
  console.log('vao edit');
  let logo;
  if (action.data.avatar === null || !action.data.avatar) {
    if (action.data.image) {
      logo = action.data.image;
    } else {
      logo = null;
    }
  } else {
    const formData = new FormData();
    formData.append('file', action.data.avatar);
    const upload = yield call(request, UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {},
      body: formData,
    });
    logo = upload.url;
  }
  action.data.image = logo;
  try {
    const data = yield call(request, `${API_CRM_CAMPAIGN}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data.callback) {
      data.callback();
    }
    yield put(changeSnackbar({ status: true, message: 'Cập nhật chiến dịch thành công ', variant: 'success' }));
    yield put(push('/crm/crmCampaign'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: error.message, variant: 'error' }));
    yield put(putCampaignFailed());
  }
}
export default function* addCustomerPageSaga() {
  yield takeLatest('GET_INFO', getCampaign);
  yield takeLatest('POST_CAMPAIGN', postCampaign);
  yield takeLatest('PUT_CAMPAIGN', putCampaign);
  yield takeLatest('GET_ATTRIBUTE', getAttribute);
}

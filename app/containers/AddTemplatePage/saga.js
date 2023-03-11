import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_TEMPLATE } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import {
  getTemplateSuccess,
  putTemplateFailed,
  postTemplateFailed,
  getAllTemplateSuccess,
  getAllTemplateFailure,
  getAllModuleCodeSuccess,
  getAllModuleCodeFailure,
} from './actions';
import { GET_ALL_MODULE_CODE, GET_ALL_TEMPLATE } from './constants';
import { clientId } from '../../variable';
import { postTemplateSuccess, putTemplateSuccess } from './actions';
import { delSpace } from 'utils/common';
import { API_COMMON_MODULE } from '../../config/urlConfig';
export function* getAllTemplateSaga() {
  try {
    const res = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (res) {
      yield put(getAllTemplateSuccess(res));
    } else {
      yield put(getAllTemplateFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* getTemplateSaga(action) {
  try {
    const dataTemplateType = yield call(request, `${API_TEMPLATE}/category`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const d = dataTemplateType && dataTemplateType.data;
    d.forEach((item, index) => {
      if (item.alwaysUsed == false) {
        dataTemplateType.data.splice(index, 1);
      }
    });
    let data = { templateTypes: dataTemplateType.data };
    if (action.id !== 'add') {
      const dataTemplate = yield call(request, `${API_TEMPLATE}/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let newDataTemplate = {
        ...dataTemplate,
        categoryDynamicForm: dataTemplate && dataTemplate.categoryDynamicForm ? dataTemplate.categoryDynamicForm._id : '',
      };
      if (dataTemplate.content.charAt(0) != '<') {
        newDataTemplate = {
          ...newDataTemplate,
          textEditor: dataTemplate.content,
        };
      } else {
        newDataTemplate = {
          ...newDataTemplate,
          textEditor: '',
        };
      }

      data = { ...data, ...newDataTemplate };
    }

    yield put(getTemplateSuccess(data, action.id));
    action.getTem();
  } catch (error) {
    console.log('vao chua2');
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* postTemplateSaga(action) {
  try {
    const data = yield call(request, API_TEMPLATE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(postTemplateSuccess(data));
      yield put(changeSnackbar({ message: `Thêm mới thành công ${data.data.title}`, status: true, variant: 'success' }));
      yield put(push('/setting/DynamicForm'));
    }
  } catch (error) {
    yield put(changeSnackbar({ message: 'Thêm mới thất bại', status: true, variant: 'error' }));
    yield put(postTemplateFailed());
  }
}

function* putTemplateSaga(action) {
  try {
    const data = yield call(request, `${API_TEMPLATE}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(delSpace(action.data)),
    });
    yield put(putTemplateSuccess(data));
    yield put(changeSnackbar({ message: `Cập nhật thành công ${data.data.title}`, status: true, variant: 'success' }));
    yield put(push('/setting/DynamicForm'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));

    yield put(putTemplateFailed());
  }
}

function* getAllModuleCodeSaga(action) {
  try {
    const res = yield call(request, `${API_COMMON_MODULE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (res) {
      yield put(getAllModuleCodeSuccess(res));
    } else {
      yield put(getAllModuleCodeFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

export default function* addTemplatePageSaga() {
  yield takeLatest('GET_TEMPLATE', getTemplateSaga);
  yield takeLatest('POST_TEMPLATE', postTemplateSaga);
  yield takeLatest('PUT_TEMPLATE', putTemplateSaga);
  yield takeLatest(GET_ALL_TEMPLATE, getAllTemplateSaga);
  yield takeLatest(GET_ALL_MODULE_CODE, getAllModuleCodeSaga);
}

/* eslint-disable array-callback-return */
import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import {
  GET_CONTRACT,
  API_STATUS_CRMCONFIG,
  // API_SALE_FOR_CONTRACT,
  API_STOCK,
  UPLOAD_IMG_SINGLE,
  API_SUPPLIERS,
  API_ORDER_PO,
  // API_SALE,
} from '../../config/urlConfig';
import {
  getAllContractSuccess,
  getAllContractFailed,
  getCrmStatusSuccess,
  getCrmStatusFailed,
  getOrderFailed,
  getOrderSuccess,
  getProductSuccess,
  getProductFailed,
  createContractFailed,
  createContractSuccess,
  getContractByIdSuccess,
  getContractByIdFailed,
  getAllContractAct,
  updateContractSuccessAct,
  updateContractFailedAct,
  getSaleQuoByIdFailedAct,
  getSaleQuoByIdSuccessAct,
  getProductAct,
  getSaleQuoByIdAct,
  getCustomerSuccess,
  getCustomerFailed,
  getCustomerAct,
} from './actions';
import {
  GET_ALL_CONTRACT_BY_TYPE,
  GET_ORDER,
  GET_PRODUCT,
  CREATE_CONTRACT,
  GET_CONTRACT_BY_ID,
  UPDATE_CONTRACT,
  GET_SALE_QUO_BYID,
  GET_CUSTOMER,
} from './constants';
import { changeSnackbar } from '../Dashboard/actions';
// import { makeSelectBody } from './selectors';

export function* getAllContract(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${GET_CONTRACT}?typeContract=${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllContractSuccess(data.data));
    } else {
      yield put(getAllContractFailed({}));
    }
  } catch (err) {
    yield put(getAllContractFailed(err));
  }
}
export function* getContractById(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${GET_CONTRACT}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllContractAct(data.typeContract));
      if (data.order) {
        yield put(getSaleQuoByIdAct(data.order.orderId));
      }
      yield put(getContractByIdSuccess(data));
    } else {
      yield put(getContractByIdFailed({}));
    }
  } catch (err) {
    yield put(getContractByIdFailed(err));
  }
}

export function* getCrmStatus() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_STATUS_CRMCONFIG}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      // eslint-disable-next-line consistent-return
      /* eslint-disable */
      const status = data.find(item => {
        if (item.code === 'ST05') return true;
      });
      /* eslint-enable */
      yield put(getCrmStatusSuccess(status));
    } else {
      yield put(getCrmStatusFailed({}));
    }
  } catch (err) {
    yield put(getCrmStatusFailed(err));
  }
}

export function* getOrder(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ORDER_PO}?${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getOrderSuccess(data.data));
    } else {
      yield put(getOrderFailed({}));
    }
  } catch (err) {
    yield put(getOrderFailed(err));
  }
}

export function* getProduct(action) {
  const token = localStorage.getItem('token');
  // const list = yield select(makeSelectBody('listProduct'));
  const list = [];
  try {
    if (action.body.products) {
      for (let i = 0; i < action.body.products.length; i += 1) {
        try {
          const data = yield call(request, `${API_STOCK}/${action.body.products[i].productId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data) {
            list.push(data);
          } else {
            yield put(changeSnackbar({ status: true, message: `Sản phẩm ${action.body.products[i].name} đã bị xóa trong kho!`, variant: 'error' }));
          }
        } catch (errInven) {
          yield put(changeSnackbar({ status: true, message: `Sản phẩm ${action.body.products[i].name} đã bị xóa trong kho!`, variant: 'error' }));
        }
      }
      yield put(getProductSuccess(list));
    } else {
      yield put(getProductFailed({}));
    }
  } catch (err) {
    yield put(getProductFailed(err));
  }
}

export function* getCustomer(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_SUPPLIERS}/${action.body.supplierId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getCustomerSuccess(data));
    } else {
      yield put(getCustomerFailed({}));
    }
  } catch (err) {
    yield put(getCustomerFailed(err));
  }
}

export function* getSaleQuoById(action) {
  const token = localStorage.getItem('token');
  // const list = yield select(makeSelectBody('listProduct'));

  try {
    if (action.id) {
      const data = yield call(request, `${API_ORDER_PO}/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      yield put(getSaleQuoByIdSuccessAct(data));
      yield put(getProductAct(data));
      yield put(getCustomerAct(data.supplier));
    } else {
      yield put(getSaleQuoByIdFailedAct({}));
    }
  } catch (err) {
    yield put(getSaleQuoByIdFailedAct(err));
  }
}

export function* createContract(action) {
  const token = localStorage.getItem('token');
  const { body } = action;
  try {
    if (action.body.newFile.urlFile !== null) {
      const formData = new FormData();
      formData.append('file', action.body.newFile.urlFile);
      const upload = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {},
        body: formData,
      });
      body.otherRequest.push({
        urlFile: upload.url,
        nameFile: body.newFile.nameFile,
        note: body.newFile.note,
        createdAt: body.newFile.createdAt,
      });
      body.newFile = undefined;
      const data = yield call(request, GET_CONTRACT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (data) {
        yield put(createContractSuccess(data));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới hợp đồng thành công', variant: 'success' }));
      } else {
        yield put(createContractFailed());
        yield put(changeSnackbar({ status: true, message: 'Thêm mới hợp đồng thất bại', variant: 'error' }));
      }
    } else {
      const data = yield call(request, GET_CONTRACT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (data) {
        yield put(createContractSuccess(data));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới hợp đồng thành công', variant: 'success' }));
      } else {
        yield put(changeSnackbar({ status: true, message: 'Thêm mới hợp đồng thất bại', variant: 'error' }));
        yield put(createContractFailed());
      }
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới hợp đồng thất bại', variant: 'error' }));

    yield put(createContractFailed(err));
  }
}
export function* updateContract(action) {
  const token = localStorage.getItem('token');
  const { body } = action;
  const id = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
  try {
    if (action.body.newFile.urlFile !== null) {
      const formData = new FormData();
      formData.append('file', action.body.newFile.urlFile);
      const upload = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {},
        body: formData,
      });
      body.otherRequest.push({
        urlFile: upload.url,
        nameFile: body.newFile.nameFile,
        note: body.newFile.note,
        createdAt: body.newFile.createdAt,
      });
      body.newFile = undefined;
      const data = yield call(request, `${GET_CONTRACT}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (data) {
        yield put(updateContractSuccessAct(data));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật hợp đồng thành công', variant: 'success' }));
      } else {
        yield put(updateContractFailedAct());
        yield put(changeSnackbar({ status: true, message: 'Cập nhật hợp đồng thất bại', variant: 'error' }));
      }
    } else {
      const data = yield call(request, `${GET_CONTRACT}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (data) {
        yield put(updateContractSuccessAct(data));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật hợp đồng thành công', variant: 'success' }));
      } else {
        yield put(changeSnackbar({ status: true, message: 'Cập nhật hợp đồng thất bại', variant: 'error' }));
        yield put(updateContractFailedAct());
      }
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật hợp đồng thất bại', variant: 'error' }));

    yield put(updateContractFailedAct(err));
  }
}

// Individual exports for testing
export default function* addSupplierContractSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ALL_CONTRACT_BY_TYPE, getAllContract);
  yield takeEvery(GET_CONTRACT_BY_ID, getContractById);
  // yield takeEvery(GET_ALL_CONTRACT_BY_TYPE, getCrmStatus);
  // yield takeEvery(GET_CONTRACT_BY_ID, getCrmStatus);
  yield takeEvery(GET_ORDER, getOrder);
  yield takeEvery(GET_PRODUCT, getProduct);
  yield takeEvery(GET_CUSTOMER, getCustomer);
  yield takeEvery(CREATE_CONTRACT, createContract);
  yield takeEvery(UPDATE_CONTRACT, updateContract);
  yield takeEvery(GET_SALE_QUO_BYID, getSaleQuoById);
}

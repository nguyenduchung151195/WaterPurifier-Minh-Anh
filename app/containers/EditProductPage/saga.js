/* eslint-disable consistent-return */
import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import {
  getTagsSuccess,
  getTagsFailed,
  getPropertiesSetSuccess,
  getPropertiesSetFailed,
  getSuppliersSuccess,
  getSuppliersFailed,
  getCalculateUnitSuccess,
  getCalculateUnitFailed,
  getCategorySuccess,
  getCategoryFailed,
  getDepartmentSuccess,
  getDepartmentFailed,
  getAgencyLevelSuccess,
  getAgencyLevelFailed,
  getOriginSuccess,
  getOriginFailed,
  getProductSuccess,
  getProductFailed,
  editProductSuccess,
  editProductFailed,
  getGroupProduct,
} from './actions';
import { GET_TAGS, GET_PRODUCT, EDIT_PRODUCT } from './constants';
import {
  API_TAG_STOCK,
  SUPPLIER,
  GET_PROP_SET,
  API_UNIT_STOCK,
  API_CATEGORY_STOCK_TREE,
  CRM_SOURCE,
  API_ORIGIN,
  API_ORIGANIZATION,
  API_ADD_NEW_PRODUCT,
  UPLOAD_IMG_SINGLE,
  API_GROUP_PRODUCT,
} from '../../config/urlConfig';

export function* getTags() {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, API_TAG_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getTagsSuccess(data));
    } else {
      yield put(getTagsFailed({}));
    }
  } catch (err) {
    yield put(getTagsFailed(err));
  }
}

export function* getSupplier() {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, SUPPLIER, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getSuppliersSuccess(data.data));
    } else {
      yield put(getSuppliersFailed({}));
    }
  } catch (err) {
    yield put(getSuppliersFailed(err));
  }
}

export function* getPropertiesSet() {
  try {
    const data = yield call(request, GET_PROP_SET, {
      method: 'GET',
      headers: {},
    });
    if (data.status === 'success') {
      yield put(getPropertiesSetSuccess(data.data));
    } else {
      yield put(getPropertiesSetFailed({}));
    }
  } catch (err) {
    yield put(getPropertiesSetFailed(err));
  }
}

export function* getCalculateUnit() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_UNIT_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getCalculateUnitSuccess(data));
    } else {
      yield put(getCalculateUnitFailed({}));
    }
  } catch (err) {
    yield put(getCalculateUnitFailed(err));
  }
}

export function* getCategory() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_CATEGORY_STOCK_TREE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.success === true) {
      yield put(getCategorySuccess(data.data));
    } else {
      yield put(getCategoryFailed({}));
    }
  } catch (err) {
    yield put(getCategoryFailed(err));
  }
}

export function* getDepartment() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getDepartmentSuccess(data));
    } else {
      yield put(getDepartmentFailed({}));
    }
  } catch (err) {
    yield put(getDepartmentFailed(err));
  }
}

export function* getAgencyLevel() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${CRM_SOURCE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      // eslint-disable-next-line array-callback-return
      const agency = data.find(item => {
        if (item.code === 'pckh') return true;
      });
      yield put(getAgencyLevelSuccess(agency));
    } else {
      yield put(getAgencyLevelFailed({}));
    }
  } catch (err) {
    yield put(getAgencyLevelFailed(err));
  }
}

export function* getOrigin() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ORIGIN, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getOriginSuccess(data));
    } else {
      yield put(getOriginFailed({}));
    }
  } catch (err) {
    yield put(getOriginFailed(err));
  }
}

export function* getProduct(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getProductSuccess(data));
    } else {
      yield put(getProductFailed({}));
    }
  } catch (err) {
    yield put(getProductFailed(err));
  }
}

export function* addNewProduct(action) {
  const token = localStorage.getItem('token');
  let logo;
  if (action.body.avatar === null) {
    if (action.body.avatarURL.indexOf('g.lifetek.vn:203') > -1) {
      logo = action.body.avatarURL;
    }
  } else {
    const formData = new FormData();
    formData.append('file', action.body.avatar);
    const upload = yield call(request, UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {},
      body: formData,
    });
    logo = upload.url;
  }
  const bodySend = {
    logo,
    name: action.body.name,
    code: action.body.code,
    barcode: action.body.barcode,
    isService: action.body.isService,
    isDescription: action.body.isDescription,
    isDisplaySourcePrice: action.body.isDisplaySourcePrice,
    isSerial: action.body.isSerial,
    tags: action.body.tags,
    origin: action.body.origin,
    size: action.body.size,
    unit: action.body.unit,
    catalog: action.body.catalog,
    group: action.body.group,
    serials: action.body.serials,
    description: action.body.description,
    supplier: action.body.supplier,
    attributeSet: action.body.attributeSet,
    pricePolicy: action.body.pricePolicy,
    sellingPoint: action.body.sellingPoint,
    otherInfo: action.body.otherInfo,
    others: action.body.others,
    warrantyPeriod: action.body.warrantyPeriod,
    allowedSellingOrganization: action.body.allowedSellingOrganization,
    allowedUsers: action.body.allowedUsers,
  };
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodySend),
    });
    console.log('log1', data, action);
    if (data) {
      yield put(editProductSuccess(data));
    } else {
      yield put(editProductFailed({}));
    }
  } catch (err) {
    yield put(editProductFailed(err));
  }
}

// Individual exports for testing
export default function* editProductPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_TAGS, getTags);
  yield takeEvery(GET_TAGS, getSupplier);
  yield takeEvery(GET_TAGS, getPropertiesSet);
  yield takeEvery(GET_TAGS, getCalculateUnit);
  yield takeEvery(GET_TAGS, getCategory);
  yield takeEvery(GET_TAGS, getAgencyLevel);
  yield takeEvery(GET_TAGS, getDepartment);
  yield takeEvery(GET_TAGS, getOrigin);
  yield takeEvery(EDIT_PRODUCT, addNewProduct);
  yield takeEvery(GET_PRODUCT, getProduct);
}

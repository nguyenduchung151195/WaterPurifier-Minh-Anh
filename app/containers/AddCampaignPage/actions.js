/*
 *
 * AddCustomerPage actions
 *
 */

import { DEFAULT_ACTION } from './constants';
import { MERGE_DATA } from './constants';
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getInfo(id) {
  return {
    type: 'GET_INFO',
    id,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function getInfoSuccess(data, attributes, listAtt, users, resource) {
  return {
    type: 'GET_INFO_SUCCESS',
    data,
    attributes,
    listAtt,
    users,
    resource,
  };
}

export function getInfoFailed() {
  return {
    type: 'GET_INFO_FAILED',
  };
}

export function postCampaign(data) {
  return {
    type: 'POST_CAMPAIGN',
    data,
  };
}

export function postCampaignSuccess() {
  return {
    type: 'POST_CAMPAIGN_SUCCESS',
  };
}

export function postCampaignFailed() {
  return { type: 'POST_CAMPAIGN_FAILED' };
}

export const putCampaign = (id, data) => ({
  type: 'PUT_CAMPAIGN',
  id,
  data,
});

export const handleChangeName = data => ({
  type: 'CHANGE_NAME',
  data,
});

export const handleChangeLastName = data => ({
  type: 'CHANGE_NAME',
  data,
});

export const handleChangeNickName = data => ({
  type: 'CHANGE_NAME',
  data,
});

export const snackbar = data => ({ type: 'SNACKBAR', data });
export const putCampignSuccess = data => ({ type: 'PUT_CAMPAIGN_SUCCESS', data });
export const putCampaignFailed = () => ({ type: 'PUT_CAMPAIGN_FAILED' });
export const uploadFailed = () => ({ type: 'UPLOAD_FAILED' });
export const changeSelect = value => ({ type: 'CHANGE_SELECT', value });
export const getAttribute = () => ({ type: 'GET_ATTRIBUTE' });
export const changeExpanded = id => ({ type: 'CHANGE_EXPANDED', id });
export const getAttributeSuccess = (attributes, listAtt, users, resource) => ({
  type: 'GET_ATTRIBUTE_SUCCESS',
  attributes,
  listAtt,
  users,
  resource,
});
export const handleChangeAtt = data => ({ type: 'CHANGE_ATT', data });

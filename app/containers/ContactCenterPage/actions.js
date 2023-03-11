/*
 *
 * ContactCenterPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CONTACT_CENTER_ERROR,
  GET_CONTACT_CENTER_SUCCESS,
  GET_CONTACT_CENTER,
  DELETE_CONTACT_CENTER,
  DELETE_CONTACT_CENTER_SUCCESS,
  DELETE_CONTACT_CENTER_ERROR,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getContactCenterAction() {
  return {
    type: GET_CONTACT_CENTER,
  };
}

export function getContactCenterSuccessAction(data) {
  return {
    type: GET_CONTACT_CENTER_SUCCESS,
    data,
  };
}
export function getContactCenterErrorAction() {
  return {
    type: GET_CONTACT_CENTER_ERROR,
  };
}

// xóa biểu mẫu

export function deleteContactCenterAction(deleteIds) {
  return {
    type: DELETE_CONTACT_CENTER,
    deleteIds,
  };
}
export function deleteContactCenterSuccessAction(data, message) {
  return {
    type: DELETE_CONTACT_CENTER_SUCCESS,
    data,
    message,
  };
}
export function deleteContactCenterErrorAction(err, message) {
  return {
    type: DELETE_CONTACT_CENTER_ERROR,
    err,
    message,
  };
}

/*
 *
 * ApprovePage actions
 *
 */

import {
  DEFAULT_ACTION,
  UPDATE_APPROVE,
  UPDATE_APPROVE_FAIL,
  UPDATE_APPROVE_SUCCESS,
  // ADD_APPROVE,
  // ADD_APPROVE_FAIL,
  // ADD_APPROVE_SUCCESS,
  GET_APPROVE,
  GET_APPROVE_FAILED,
  GET_APPROVE_SUCCESS,
  OPEN_TEMPLATE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function updateApproveAction(approve, result, currentUser) {
  return {
    type: UPDATE_APPROVE,
    approve,
    result,
    currentUser,
  };
}
export function updateApproveSuccessAction(data) {
  return {
    type: UPDATE_APPROVE_SUCCESS,
    data,
  };
}
export function updateApproveFailAction(err, message) {
  return {
    type: UPDATE_APPROVE_FAIL,
    err,
    message,
  };
}
export function getApproveAction() {
  return {
    type: GET_APPROVE,
  };
}
export function getApproveSuccessAction(data, currentUser) {
  return {
    type: GET_APPROVE_SUCCESS,
    data,
    currentUser,
  };
}
export function getApproveFailAction(err, message) {
  return {
    type: GET_APPROVE_FAILED,
    err,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function showTemplate(data) {
  return {
    type: OPEN_TEMPLATE,
    data,
  };
}

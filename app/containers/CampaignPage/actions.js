/*
 *
 * SuppliersPage actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, UPDATE_CAMPAIGN_SUCCESS, UPDATE_CAMPAIGN_FAILURE, GET_CAMPAIGN, CHANGE_TAB_CAMPAIN } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function changeTabCampainAction(tab) {
  return {
    type: CHANGE_TAB_CAMPAIN,
    tab,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function getCampaign(data) {
  return {
    type: GET_CAMPAIGN,
    data,
  };
}
export function getCampaignSuccess(data) {
  return {
    type: UPDATE_CAMPAIGN_SUCCESS,
    data,
  };
}
export function getCampaignFailed(data) {
  return {
    type: UPDATE_CAMPAIGN_FAILURE,
    data,
  };
}

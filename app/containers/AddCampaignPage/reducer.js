/*
 *
 * AddCustomerPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION } from './constants';
import { MERGE_DATA } from './constants';

export const initialState = fromJS({ resource: [], users: [], attributes: [], attributeSelect: '', expanded: '', listAtt: {}, voucher: {} });

function addCampaignPageReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      console.log(action.data);
      return state.merge(action.data);
    case 'GET_INFO':
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case 'GET_INFO_SUCCESS':
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('data', action.data)
        .set('attributes', action.attributes)
        .set('listAtt', action.listAtt)
        .set('users', action.users)
        .set('voucher', action.voucher)
        .set('resource', action.resource)
        .merge(action.listAtt);
    case 'POST_CAMPAIGN':
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case 'POST_CAMPAIGN_SUCCESS':
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case 'POST_CAMPAIGN_FAILED':
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case 'PUT_CAMPAIGN':
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case 'PUT_CAMPAIGN_SUCCESS':
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('data', action.data);
    case 'UPLOAD_FAILED':
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case 'CHANGE_ATT':
      return state.set(action.data.name, action.data.value);
    case 'PUT_CAMPAIGN_FAILED':
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case 'SNACKBAR':
      return state.set('snackbar', { ...action.data, status: false });
    case 'CHANGE_SELECT':
      return state.set('attributeSelect', action.value);
    case 'GET_ATTRIBUTE_SUCCESS':
      return state
        .set('attributes', action.attributes)
        .set('listAtt', action.listAtt)
        .set('users', action.users)
        .set('resource', action.resource)
        .merge(action.listAtt);
    case 'CHANGE_EXPANDED':
      return state.set('expanded', action.id);
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default addCampaignPageReducer;

/*
 *
 * SuppliersPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, UPDATE_CAMPAIGN, UPDATE_CAMPAIGN_SUCCESS, UPDATE_CAMPAIGN_FAILURE, CHANGE_TAB_CAMPAIN } from './constants';

export const initialState = fromJS({ 
  rows: [], 
  openDrawer: false, 
  id: 'add', 
  suppliers: {},
  reload: false,
  tab: 0, 
});

function campaignPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_TAB_CAMPAIN:
      return state.set('tab', action.tab);
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
    case UPDATE_CAMPAIGN:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('reload', false);
    case UPDATE_CAMPAIGN_SUCCESS:
      return state.set('loading', false).set('success', true);
    case UPDATE_CAMPAIGN_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)

        .set('reload', true);
  }
}

export default campaignPageReducer;

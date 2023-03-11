import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addCustomerPage state domain
 */

const selectAddCampaignPageDomain = state => state.get('addCampaignPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddCustomerPage
 */

// const selectExpand =
const makeSelectAddCampaignPage = () => createSelector(selectAddCampaignPageDomain, substate => substate.toJS());
const makeSelectlistAtt = () => createSelector(selectAddCampaignPageDomain, substate => substate.get('listAtt'));

export default makeSelectAddCampaignPage;
export { selectAddCampaignPageDomain, makeSelectlistAtt };

import React, { useState, memo } from 'react';
import { AsyncAutocomplete } from 'components/LifetekUi';
import CustomInputBase from '../Input/CustomInputBase';
import { API_CITY, API_DISTRICT } from '../../config/urlConfig';
import { Grid } from '@material-ui/core';
function CustomerProvinceAddress(props) {
  const { localMessages, checkRequired, checkShowForm, handleChange, provinceAddress, addItem, names, disabledRegion, disabledRank, md } = props;
  return (
    <>
      {disabledRegion ? (
        ''
      ) : (
        <CustomInputBase
          label={'MIỀN'}
          value={provinceAddress.region}
          displayEmpty
          name="region"
          select
          onChange={e => handleChange(e, 'region')}
          error={localMessages && localMessages.region}
          helperText={localMessages && localMessages.region}
          required={checkRequired.region}
          checkedShowForm={checkShowForm.region}
        >
          {addItem('S45')}
        </CustomInputBase>
      )}
      <Grid item md={md}>
        <AsyncAutocomplete
          label={'TỈNH'}
          required={checkRequired.province}
          checkedShowForm={checkShowForm.province}
          error={localMessages && localMessages.province}
          helperText={localMessages && localMessages.province}
          onChange={e => handleChange(e, 'province')}
          url={API_CITY}
          value={provinceAddress.province}
        />
      </Grid>

      {provinceAddress.province ? (
        <Grid item md={md}>
          <AsyncAutocomplete
            label={'HUYỆN'}
            required={checkRequired.district}
            checkedShowForm={checkShowForm.district}
            error={localMessages && localMessages.district}
            helperText={localMessages && localMessages.district}
            onChange={e => handleChange(e, 'district')}
            filter={{ cityCode: provinceAddress.province ? provinceAddress.province.code : '' }}
            url={API_DISTRICT}
            value={provinceAddress.district}
          />
        </Grid>
      ) : (
        <Grid item md={md}>
          <AsyncAutocomplete label={'HUYỆN'} isDisabled />
        </Grid>
      )}
      {disabledRank ? (
        ''
      ) : (
        <CustomInputBase
          value={provinceAddress.district && provinceAddress.district.rank ? provinceAddress.district.rank : ''}
          name="rank"
          // onChange={this.handleChange('rank')}
          // onChange={e => this.handleChangeCustomer(e, 'rank')}
          label={names.rank || 'HẠNG'}
          error={localMessages && localMessages.rank}
          helperText={localMessages && localMessages.rank}
          required={checkRequired.rank}
          checkedShowForm={checkShowForm.rank}
          disabled
        />
      )}
    </>
  );
}
export default memo(CustomerProvinceAddress);

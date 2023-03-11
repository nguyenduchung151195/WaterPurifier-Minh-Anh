import React, { memo, useState, useEffect, useCallback } from 'react';

import { Grid as GridMaterialUI } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import toVietNamDate from '../../helper';
import moment from 'moment';
import axios from 'axios';
import { API_APPROVE, API_COMMON, API_PERSONNEL, API_USERS, API_CUSTOMERS, API_TASK_PROJECT } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
import { CustomTreeData } from '@devexpress/dx-react-grid';
const arrayGender = ['Nam', 'Nữ', 'Không Xác Định'];
const TypographyDetail = ({ children, data, dataInfo }) => {
  if (children === 'Ảnh ĐẠI DIỆN') {
    children = '';
    data = '';
  }
  if (children === 'GIỚI TÍNH' && data === 'female') {
    data = 'Nữ';
  }
  if (children === 'GIỚI TÍNH' && data === 'male') {
    data = 'Nam';
  }
  if (children === 'LOẠI KHÁCH HÀNG') {
    data = dataInfo && dataInfo.detailInfo && dataInfo.detailInfo.typeCustomer && dataInfo.detailInfo.typeCustomer.typeOfCustomer;
  }
  if (children === 'NGƯỜI GIỚI THIỆU') {
    data =
      dataInfo &&
      dataInfo.detailInfo &&
      dataInfo.detailInfo.typeCustomer &&
      dataInfo.detailInfo.typeCustomer.introPerson &&
      dataInfo.detailInfo.typeCustomer.introPerson.name;
  }
  if (children === 'THÔNG TIN NGƯỜI GIỚI THIỆU') {
    let data2 = '';
    let data1 =
      dataInfo &&
      dataInfo.detailInfo &&
      dataInfo.detailInfo.represent &&
      dataInfo.detailInfo.represent.localPersonInfo &&
      dataInfo.detailInfo.represent.localPersonInfo.forEach(it => {
        if (it.name) {
          data2 = data2 + it.name + ';';
        }
      });

    data = data2;
  }
  return (
    <div className="task-info-detail">
      <p>{children}:</p>
      <p>{data}</p>
    </div>
  );
};
function ViewContentCustomer(props) {
  const { id } = props;
  const [dataInfor, setDataInfor] = useState(null);
  const dataInfo = dataInfor ? (dataInfor.length > 2 ? dataInfor.find(e => e._id === props.id) : dataInfor) : null;
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const list = viewConfig.find(item => item.code === 'Customer');
  let data = [];
  if (list) {
    data = list.listDisplay.type.fields.type.columns.filter(i => i.checked);
  }

  useEffect(
    () => {
      fetch(`${API_CUSTOMERS}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          // let data1 = data && data.map(item => ({ ...item, name: item.name.replace(/\./g, '_') }));
          console.log('state', data);
          setDataInfor(data);
        });
    },
    [props],
  );

  const customData = data => {
    const employee = personal ? personal.find(item => item._id === data) : null;

    return employee ? employee.name : '';
  };
  // const dataCustomer = dataInfo && dataInfo.customer;
  return (
    <div>
      <GridMaterialUI container>
        {dataInfo
          ? data.map(item => (
              <GridMaterialUI item xs={6}>
                <TypographyDetail
                  data={
                    Array.isArray(dataInfo[item.name]) === true
                      ? dataInfo[item.name].length > 0
                        ? dataInfo[item.name]
                            .map(i => {
                              return typeof i === Object ? (i ? i.name : []) : i ? customData(i) : [];
                            })
                            .join(', ')
                        : []
                      : dataInfo[item.name]
                        ? dataInfo[item.name] && dataInfo[item.name].name
                          ? `${dataInfo[item.name].name}`
                          : dataInfo[item.name] && typeof dataInfo[item.name].search === 'function' && dataInfo[item.name].search('000Z') === -1
                            ? `${dataInfo[item.name]}`
                            : `${dataInfo[item.name]}`
                        : dataInfo[item.name]
                  }
                  dataInfo={dataInfo}
                >
                  {item.title}
                </TypographyDetail>
              </GridMaterialUI>
            ))
          : null}
      </GridMaterialUI>
    </div>
  );
}

export default memo(ViewContentCustomer);

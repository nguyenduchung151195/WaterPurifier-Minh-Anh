import React, { memo, useState, useEffect } from 'react';
import CustomerVerticalTabList from 'components/CustomVerticalTabList';
import AddSalaryCategory from './components/AddSalaryCategory/Loadable';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { Paper } from 'components/LifetekUi';
import {
  getAllSalaryCategory,
  addSalaryCategory,
  updateSalaryCategory,
  deleteSalaryCategory,
  resetSalaryCategory
} from './actions';
import makeSelectConfigHrmSalaryCategoryPage from './selectors';
import SubSalaryCategory from './components/subCategories/Loadable';
import { Grid } from '@material-ui/core';
import ConfirmDialog from '../../../../components/CustomDialog/ConfirmDialog';
import { changeSnackbar } from '../../../Dashboard/actions';

function ConfigHrmSalaryCategory(props) {
  const { getAllSalaryCategory, addSalaryCategory, updateSalaryCategory, deleteSalaryCategory, salaryCategoryPage, onChangeSnackbar, resetSalaryCategory } = props;
  const { salaryCategory, addSalaryCategorySuccess, updateSalaryCategorySuccess, deleteSalaryCategorySuccess } = salaryCategoryPage;
  const [openCategory, setOpenCategory] = useState(false);
  const [openCategoryDelete, setOpenCategoryDelete] = useState(false);
  const [openCategoryReset, setOpenCategoryReset] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [localSalaryCategory, setLocalSalaryCategory] = useState([]);
  const [localData, setLocalData] = useState({});
  const [errors, setErrors] = useState({});
  const [column, setColumn] = useState({
    title: 'Tiêu đề',
    code: 'Mã'
  });

  useEffect(() => {
    const data = getAllSalaryCategory();
    return () => {
      data;
    }
  }, [])

  useEffect(() => {
    setLocalSalaryCategory(salaryCategory);
  }, [salaryCategory])

  useEffect(
    () => {
      if (addSalaryCategorySuccess === true) {
        handleCloseCategory();
      }
      if (!addSalaryCategorySuccess) {
      }
    },
    [addSalaryCategorySuccess],
  );

  useEffect(
    () => {
      if (updateSalaryCategorySuccess === true) {
        // setReload(true);
        handleCloseCategory();
      }
      if (!updateSalaryCategorySuccess) {
        // setReload(false);
      }
    },
    [updateSalaryCategorySuccess],
  );

  const handleCloseDelete = () => {
    setOpenCategoryDelete(false);
  }

  const handleOpenCategory = () => {
    setOpenCategory(true);
  }
  const handleCloseCategory = () => {
    setOpenCategory(false);
    setErrors({});
  }

  const handleAddEdit = (item, isEdit) => {
    setOpenCategory(true)
    if (item && item._id) {
      setLocalData(item);
      // sua
    } else {
      // them
      setLocalData({})
    }
  }

  const onDelete = () => {
    if (localData && localData._id) {
      //xoa 
      deleteSalaryCategory(localData);
      setOpenCategoryDelete(false);
    } else {

    }
  }

  // cap nhat them moi
  const handleSave = () => {
    if (Object.keys(errors).length === 0) {
      if (localData._id) {
        updateSalaryCategory(localData, 'update');
      } else {
        addSalaryCategory({ title: localData.title, code: localData.code, data: [] });
      }
    } else {
      onChangeSnackbar({ variant: 'error', message: `${localData && localData._id ? 'Cập nhật thất bại' : 'Thêm mới thất bại'}`, status: true });
    }
  }

  // cap nhat, them, xoa danh muc con
  const onSave = (id, newData, type) => {
    if (id && newData) {
      const foundSalaryCategory = localSalaryCategory && localSalaryCategory.find(item => item._id === id);
      if (foundSalaryCategory) {
        const newSalaryCategory = { ...foundSalaryCategory, data: newData };
        updateSalaryCategory(newSalaryCategory, type);
      }
    }
  }

  const handleChangeInput = (e) => {
    const { target: { value, name } } = e;
    setLocalData({ ...localData, [name]: value });

    let foundData = false;
    if (!localData._id) {
      foundData = Array.isArray(localSalaryCategory) && localSalaryCategory.find(item => item[name].trim() === value.trim()) ? true : false;
    } else {
      let newLocalSalaryCategory = [];
      newLocalSalaryCategory.push(...localSalaryCategory);
      const index = newLocalSalaryCategory.findIndex(item => item._id === localData._id);
      if (index !== -1) {
        newLocalSalaryCategory.splice(index, 1);
        foundData = Array.isArray(newLocalSalaryCategory) && newLocalSalaryCategory.find(item => item[name].trim() === value.trim()) ? true : false;
      }
    }
    if (value.length > 0) {
      if (foundData) {
        setErrors({ ...errors, [name]: `Không được trùng ${column[name]}` });
      } else {
        let newErrors = errors;
        delete newErrors[name];
        setErrors(newErrors);
      }
    } else {
      setErrors({ ...errors, [name]: `Không được để trống ${column[name]}` })
    }

  }

  const handleReset = () => {
    resetSalaryCategory();
    setOpenCategoryReset(false);
  }
  return (
    <Paper>
      <Grid container spacing={16}>
        <Grid item style={{ width: '300px' }}>
          <CustomerVerticalTabList
            value={tabIndex}
            data={localSalaryCategory}
            onChange={(_, tabIndex) => setTabIndex(tabIndex)}
            onChangeAdd={handleAddEdit}
            onChangeEdit={handleAddEdit}
            onChangeDelete={(item) => { setOpenCategoryDelete(true); setLocalData(item) }}
            onChangeUndo={(e) => setOpenCategoryReset(true)}
          />
        </Grid>
        <Grid item style={{ width: 'calc(100% - 300px)' }}>
          {
            localSalaryCategory && localSalaryCategory.map((item, index) => {
              let renderTabChild = null;
              if (tabIndex === index && localSalaryCategory[index]) {
                renderTabChild = <SubSalaryCategory salaryCategoryId={item._id} data={item.data} item={item} onSave={onSave} onChangeSnackbar={onChangeSnackbar} updateSalaryCategorySuccess={updateSalaryCategorySuccess} />
              }
              return renderTabChild;
            })
          }
        </Grid>
      </Grid>

      {/* Them, sua */}
      <AddSalaryCategory
        openModal={openCategory}
        handleClose={handleCloseCategory}
        title="Danh mục lương"
        label={column}
        name={{ title: "title", code: "code" }}
        localData={localData}
        onChange={handleChangeInput}
        onSave={handleSave}
        error={errors}
      />

      {/* xóa */}
      <ConfirmDialog
        open={openCategoryDelete}
        handleClose={handleCloseDelete}
        description={'Bạn có chắc chắn xóa danh mục này không?'}
        handleSave={onDelete}
      />

      {/* hoan tac */}
      <ConfirmDialog
        open={openCategoryReset}
        handleClose={() => setOpenCategoryReset(false)}
        description={'Bạn có chắc hoàn tác không?'}
        handleSave={handleReset}
      />

    </Paper>
  )
}

const mapStateToProps = createStructuredSelector({
  salaryCategoryPage: makeSelectConfigHrmSalaryCategoryPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAllSalaryCategory: () => dispatch(getAllSalaryCategory()),
    addSalaryCategory: (data) => dispatch(addSalaryCategory(data)),
    updateSalaryCategory: (data, type) => dispatch(updateSalaryCategory(data, type)),
    deleteSalaryCategory: (data) => dispatch(deleteSalaryCategory(data)),
    resetSalaryCategory: () => dispatch(resetSalaryCategory()),
    onChangeSnackbar: (obj) => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'configHrmSalaryCategory', reducer });
const withSaga = injectSaga({ key: 'configHrmSalaryCategory', saga });

export default compose(
  memo,
  withReducer,
  withSaga,
  withConnect,
)(ConfigHrmSalaryCategory);
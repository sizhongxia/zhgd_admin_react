import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  message,
  Menu,
  Modal,
  Divider,
  Upload
} from 'antd';
import Link from 'umi/link';
import { joinHost } from "@/services/server.config";

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './FogGun.less';

const FormItem = Form.Item;


class DeviceReceiptContent extends React.Component {

  render() {
      const {
          handleFileChange, resetReceiptByUuid, current
      } = this.props;
      return (
          <Row gutter={{ md: 12, lg: 24, xl: 24 }}>
              <Col lg={24} md={24} sm={24}>
                  {current.receipt !== "" && (
                      <div style={{minHeight:240}}>
                          <img style={{width:'100%',maxHeight:240,marginBottom:10}} src={current.receipt} />
                      </div>
                  )}
                  <Upload name="avatar" accept="image/*" showUploadList={false}
                      action={joinHost("upload/change/devicereceipt?uuid=" + current.key)}
                      onChange={handleFileChange}>
                      <Button style={{marginBottom:40,marginTop:10}}><Icon type="upload" /> 上传/更改回执单</Button>
                  </Upload>
                  <Button onClick={()=>{resetReceiptByUuid(current.key)}}>移除</Button>
              </Col>
          </Row>
      );
  }
}
const DeviceReceiptContentModel = Form.create()(DeviceReceiptContent);


class SearchFormContent extends React.Component {

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  getItemsValue = () => {
    return this.props.form.getFieldsValue();
  }

  render() {
    const {
      form: { getFieldDecorator }, handleSearch, loading
    } = this.props;
    return (
      <Form onSubmit={handleSearch} layout="inline">
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('name')(<Input placeholder="请输入设备名称" />)}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备编码">
              {getFieldDecorator('equipmentNo')(<Input placeholder="请输入设备编码" />)}
            </FormItem>
          </Col>
          <Col lg={2} md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" className={styles.searchSubmitBtn} htmlType="submit" loading={loading}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}
const SearchForm = Form.create()(SearchFormContent);

@connect(({ dustNoise, loading }) => ({
  dustNoise,
  loading: loading.effects['dustNoise/fetch']
}))
@Form.create()
class FogGun extends PureComponent {

  state = {
    selectedRows: [],
    formValues: {},
    scurrent: {},
    type: 4,
    page: 1,
    size: 20
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "dustNoise/fetch",
      payload: {
        type: 4,
        page: 1,
        size: 20
      }
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { size, type } = this.state;
    const formValues = this.formRef.getItemsValue();
    this.setState({
      formValues: formValues,
      page: 1
    });
    const params = {
      page: 1,
      type: type,
      size: size,
      ...formValues
    };
    dispatch({
      type: 'dustNoise/fetch',
      payload: params,
    });
  };

  handleDelete = (key) => {
    const { dispatch } = this.props;
    const { page, size, type, formValues } = this.state;
    Modal.confirm({
      title: '确认要删除选择的设备信息吗?',
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        new Promise((resolve) => {
          dispatch({
            type: 'dustNoise/remove',
            payload: {
              resolve,
              id: key,
            }
          });
        }).then((res) => {
          if (res.code === 200) {
            const params = {
              page: page,
              type: type,
              size: size,
              ...formValues
            };
            dispatch({
              type: 'dustNoise/fetch',
              payload: params,
            });
          }
        });
      }
    });
  };

  handleTableMenuClick = e => {
    const { selectedRows } = this.state;
    if (!selectedRows) {
      message.error("请至少选择一条记录");
      return;
    };
    //console.info(e.key)
    // export
    message.warn("功能开发中...")

  };

  handleTableSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  showReceiptPicModel = (current) => {
    const { dispatch } = this.props;
    new Promise((resolve) => {
      dispatch({
        type: 'dustNoise/getReceiptByUuid',
        payload: {
          resolve,
          uuid: current.key,
        }
      });
    }).then((res) => {
      if (res.code === 200) {
        current.receipt = res.data;
        this.setState({
          scurrent: current
        });
      } else {
        message.error(res.message);
      }
    });
  };
  
  resetReceiptByUuid = (key) => {
    const { dispatch } = this.props;
    const that = this;
    Modal.confirm({
      title: '确认要移除该回执单吗?',
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        new Promise((resolve) => {
          dispatch({
            type: 'dustNoise/resetReceiptByUuid',
            payload: {
              resolve,
              uuid: key,
            }
          });
        }).then((res) => {
          if (res.code === 200) {
            message.success("移除成功");
            that.hideReceiptPicModel();
          }
        });
      }
    })
  };
  
  hideReceiptPicModel = () => {
      this.setState({
          scurrent: {}
      });
  };

  handleFileChange = info => {
    const { scurrent } = this.state;
    if(!scurrent.uploading) {
        const uploadLoadingModels = message.loading("正在上传...", 0);
        scurrent.uploading = true;
        scurrent.uploadLoadingModels = uploadLoadingModels;
        this.setState({
            scurrent: scurrent
        });
    }
    if (info.file.status === "done") {
      var res = info.file.response.data;
      if(res.type === "devicereceipt") {
        !!scurrent.uploadLoadingModels && scurrent.uploadLoadingModels();
        this.hideReceiptPicModel();
        message.destroy();
        setTimeout(()=>{
          message.success("上传成功");
        }, 100)
      }
    }
  };


  handleTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      size: pagination.pageSize,
      ...formValues
    };

    this.setState({
      page: pagination.current,
      size: pagination.pageSize
    });

    dispatch({
      type: 'dustNoise/fetch',
      payload: params,
    });
  };

  render() {

    const {
      dustNoise: { data },
      loading
    } = this.props;

    const { selectedRows, scurrent } = this.state;

    const menu = (
      <Menu onClick={this.handleTableMenuClick} selectedKeys={["remove"]}>
        <Menu.Item key="export">导出</Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '设备编码',
        dataIndex: 'equipmentno',
      },
      {
        title: '所在工地',
        dataIndex: 'proname',
      },
      {
        title: '产品供应商',
        dataIndex: 'suppliercompany',
      },
      {
        title: '产品代理商',
        dataIndex: 'agentcompany',
      },
      {
        title: '在线状态',
        dataIndex: 'lastonlinetime',
      },
      {
        title: '添加时间',
        dataIndex: 'addtime',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <Link to={`/deviceMonitor/fogGunEdit/${record.key}`}>编辑</Link>
            <Divider type="vertical" />
            <a onClick={() => this.showReceiptPicModel(record)}>回执单</a>
            <Divider type="vertical" />
            <a style={{ color: "#f5222d" }} onClick={() => this.handleDelete(record.key)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}><SearchForm handleSearch={this.handleSearch} loading={loading} wrappedComponentRef={(form) => this.formRef = form} /></div>
            <div className={styles.tableListOperator}>
              <Link to="/deviceMonitor/fogGunCreate">
                <Button type="dashed" icon="plus">新增</Button>
              </Link>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button> 批量操作 <Icon type="down" /> </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleTableSelectRows}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
        <Modal
            title={`回执单`}
            width={640}
            bodyStyle={{padding:"25px 52px", textAlign:"center"}}
            destroyOnClose={true}
            onCancel={this.hideReceiptPicModel}
            visible={!!scurrent.key}
            footer={null}
            >
            <DeviceReceiptContentModel current={scurrent} resetReceiptByUuid={this.resetReceiptByUuid} handleFileChange={this.handleFileChange}/>
        </Modal>
        
      </PageHeaderWrapper>
    );

  }
}

export default FogGun;

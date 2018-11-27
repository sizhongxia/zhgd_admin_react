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

import styles from './Video.less';

const FormItem = Form.Item;

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

@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/fetch']
}))
@Form.create()
class Video extends PureComponent {

  state = {
    selectedRows: [],
    formValues: {},
    scurrent: {},
    type: 6,
    page: 1,
    size: 20
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "video/fetch",
      payload: {
        type: 6,
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
      type: 'video/fetch',
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
            type: 'video/remove',
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
              type: 'video/fetch',
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
      type: 'video/fetch',
      payload: params,
    });
  };

  render() {

    const {
      video: { data },
      loading
    } = this.props;

    const { selectedRows } = this.state;

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
        title: '所在工地',
        dataIndex: 'proname',
      },
      {
        title: '设备编码',
        dataIndex: 'equipmentno',
      },
      {
        title: '添加时间',
        dataIndex: 'addtime',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <Link to={`/deviceMonitor/videoEdit/${record.key}`}>编辑</Link>
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
              <Link to="/deviceMonitor/videoCreate">
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
        
      </PageHeaderWrapper>
    );

  }
}

export default Video;

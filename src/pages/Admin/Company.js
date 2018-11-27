import React, { PureComponent } from "react";
import Link from "umi/link";
import { connect } from "dva";
import {
  Form,
  Input,
  Select,
  Card,
  Upload,
  Tooltip,
  Icon,
  Avatar,
  Pagination,
  List,
  Button,
  Modal,
  message
} from "antd";

import Ellipsis from "@/components/Ellipsis";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import { joinHost } from "@/services/server.config";

import styles from "./Company.less";

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ fiveEnter, loading }) => ({
  fiveEnter,
  loading: loading.effects["fiveEnter/fetch"],
  loading2: loading.effects["fiveEnter/saveOrUpdate"]
}))
@Form.create()
class Company extends PureComponent {
  state = {
    visible: false,
    currentPage: 1,
    pageSize: 12,
    keyword: ""
  };

  loadData = (currentPage, pageSize, keyword) => {
    const { dispatch } = this.props;
    dispatch({
      type: "fiveEnter/fetch",
      payload: {
        page: currentPage,
        size: pageSize,
        keyword: keyword
      }
    });
  };

  componentDidMount() {
    const { currentPage, pageSize, keyword } = this.state;
    this.loadData(currentPage, pageSize, keyword);
  }

  searchCompany = value => {
    const { pageSize } = this.state;
    this.setState({
      currentPage: 1,
      keyword: value
    });
    this.loadData(1, pageSize, value);
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  showEditModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "fiveEnter/getById",
      payload: {
        uuid: id
      }
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "fiveEnter/hideModel"
    });
    this.setState({
      visible: false
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { currentPage, pageSize, keyword } = this.state;
    var that = this;
    Modal.confirm({
      content: "确认要删除当前公司吗？",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        new Promise((resolve) => {
          dispatch({
            type: "fiveEnter/deleteById",
            payload: {
              resolve,
              uuid: id
            }
          });
        }).then((res) => {
          if (res.code === 200) {
            that.loadData(currentPage, pageSize, keyword);
          }
        });
      },
      onCancel() { }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      fiveEnter: { current = {} },
      form
    } = this.props;
    const { currentPage, pageSize, keyword } = this.state;
    const id = current ? current.id : "";

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      var that = this;
      new Promise((resolve) => {
        dispatch({
          type: "fiveEnter/saveOrUpdate",
          payload: { id, resolve, ...fieldsValue }
        });
      }).then((res) => {
        if (res.code === 200) {
          that.setState({
            visible: false
          });
          that.loadData(currentPage, pageSize, keyword);
        }
      });
    });
  };

  handleFileChange = info => {
    const { currentPage, pageSize, keyword } = this.state;
    if (info.file.status === "done") {
      message.success(info.file.name + " 上传成功。");
      this.loadData(currentPage, pageSize, keyword);
    }
  };

  handleChangePage = page => {
    const { pageSize, keyword } = this.state;
    this.setState({
      currentPage: page
    });
    this.loadData(page, pageSize, keyword);
  };

  // skipUrl = url => {
  //     if(url !== "") {
  //         window.open(url, "_blank");
  //     } else {
  //         message.error("暂无公司链接");
  //     }
  // };

  render() {
    const {
      form: { getFieldDecorator },
      fiveEnter: { data, current = {}, visible2 },
      loading,
      loading2
    } = this.props;

    const { visible } = this.state;

    const modalFooter = {
      okText: "保存",
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="企业名称"
          >
            {getFieldDecorator("companyname", {
              rules: [
                {
                  required: true,
                  message: "请输入企业名称,长度在4-80个字符",
                  min: 4,
                  max: 80
                }
              ],
              initialValue: current.name
            })(<Input placeholder="请输入企业名称" />)}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="企业简称"
          >
            {getFieldDecorator("shortname", {
              rules: [
                {
                  required: true,
                  message: "请输入企业简称,长度在2-8个字符",
                  min: 2,
                  max: 8
                }
              ],
              initialValue: current.shortName
            })(<Input placeholder="请输入企业简称" />)}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="企业类型"
          >
            {getFieldDecorator("type", {
              rules: [{ required: true, message: "请至少选择一个类型" }],
              initialValue: current.type
            })(
              <Select
                multiple={false}
                style={{ width: "100%" }}
                placeholder="请选择企业类型"
              >
                <Option key="1">建设单位</Option>
                <Option key="2">施工单位</Option>
                <Option key="3">设计单位</Option>
                <Option key="4">监理单位</Option>
                <Option key="5">勘察单位</Option>
                <Option key="6">劳务分包商</Option>
                <Option key="7">集团公司</Option>
                <Option key="8">设备供应商</Option>
                <Option key="9">设备代理商</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="企业网址"
          >
            {getFieldDecorator("officialwebsite", {
              initialValue: current.officialwebsite
            })(<Input placeholder="请输入企业网址" />)}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="企业备注"
          >
            {getFieldDecorator("description", {
              initialValue: current.description
            })(<Input.TextArea rows={3} placeholder="请输入企业备注" />)}
          </FormItem>
        </Form>
      );
    };

    const mainSearch = (
      <div style={{ textAlign: "center" }}>
        <Input.Search
          placeholder="请输入单位名称查询"
          onSearch={this.searchCompany}
          style={{ width: 320 }}
        />
        <Button
          onClick={this.showModal}
          style={{ marginLeft: "4px" }}
          type="dashed"
          icon="plus"
        >
          新增
        </Button>
      </div>
    );

    return (
      <PageHeaderWrapper title={`单位列表`} content={mainSearch}>
        <div className={styles.filterCardList}>
          <List
            rowKey="id"
            style={{ marginTop: 24 }}
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            loading={loading}
            dataSource={data.list}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  bodyStyle={{ paddingBottom: 20 }}
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item.id);
                      }}
                    >
                      <Tooltip title="修改">
                        <Icon type="edit" />
                      </Tooltip>
                    </a>,
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.handleDelete(item.id);
                      }}
                    >
                      <Tooltip title="删除">
                        <Icon type="delete" />
                      </Tooltip>
                    </a>,
                    <Link to={`/company/department/${item.id}`}>
                      <Tooltip title="部门信息">
                        <Icon type="cluster" />
                      </Tooltip>
                    </Link>
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <Upload
                        name="avatar"
                        accept="image/*"
                        showUploadList={false}
                        action={joinHost(
                          "upload/change/companylogo?uuid=" + item.id
                        )}
                        onChange={this.handleFileChange}
                      >
                        <Tooltip title="上传企业Logo">
                          <Avatar size="small" src={item.logo} />
                        </Tooltip>
                      </Upload>
                    }
                    title={item.name}
                  />
                  <div className={styles.cardItemContent}>
                    <div className={styles.cardInfo}>
                      <Ellipsis lines={1}>
                        {item.shortName}、{item.typeName}
                      </Ellipsis>
                      <Ellipsis lines={1}>{item.description}</Ellipsis>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>

        <div className={styles.pagination}>
          <Pagination {...data.pagination} onChange={this.handleChangePage} />
        </div>

        <Modal
          title={`${current ? "编辑" : "添加"}单位`}
          width={640}
          bodyStyle={{ padding: "28px 0 0" }}
          destroyOnClose
          confirmLoading={loading2}
          visible={visible || visible2}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Company;

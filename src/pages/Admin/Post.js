import React, { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import { connect } from "dva";
import {
  List,
  Card,
  Input,
  Button,
  Modal,
  Form,
  Pagination
} from "antd";

import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Post.less";

const FormItem = Form.Item;

@connect(({ post, loading }) => ({
  post,
  loading: loading.effects["post/fetch"]
}))
@Form.create()
class post extends PureComponent {
  state = {
    visible: false,
    currentPage: 1,
    pageSize: 20,
    keyword: "",
    deptUuid: ""
  };

  componentDidMount() {
    const { match } = this.props;
    const { currentPage, pageSize, keyword } = this.state;

    const deptUuid = match.params.deptUuid;
    if (!!!deptUuid) {
      return;
    }
    this.setState({
      deptUuid: deptUuid
    });
    this.loadData(currentPage, pageSize, deptUuid, keyword);
  }

  loadData = (currentPage, pageSize, deptUuid, keyword) => {
    const { dispatch } = this.props;
    dispatch({
      type: "post/fetch",
      payload: {
        page: currentPage,
        size: pageSize,
        keyword: keyword,
        deptUuid: deptUuid
      }
    });
  };

  reloadData = () => {
    const { currentPage, pageSize, deptUuid, keyword } = this.state;
    this.loadData(currentPage, pageSize, deptUuid, keyword);
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  showEditModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "post/getById",
      payload: {
        uuid: id
      }
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "post/hideModel"
    });
    this.setState({
      visible: false
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { currentPage, pageSize, deptUuid, keyword } = this.state;
    var that = this;
    Modal.confirm({
      content: "确认要删除当前岗位吗？",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        new Promise((resolve) => {
          dispatch({
            type: "post/deleteById",
            payload: {
              resolve,
              uuid: id
            }
          });
        }).then((res) => {
          if (res.code === 200) {
            that.loadData(currentPage, pageSize, deptUuid, keyword);
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
      post: { current = {} },
      form
    } = this.props;
    const { currentPage, pageSize, deptUuid, keyword } = this.state;
    const id = current ? current.id : "";

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      var that = this;
      new Promise((resolve) => {
        dispatch({
          type: "post/saveOrUpdate",
          payload: { resolve, id, deptUuid, ...fieldsValue }
        });
      }).then((res) => {
        if (res.code === 200) {
          that.setState({
            visible: false
          });
          that.loadData(currentPage, pageSize, deptUuid, keyword);
        }
      });
    });
  };

  handleChangePage = page => {
    const { pageSize, deptUuid, keyword } = this.state;
    this.setState({
      currentPage: page
    });
    that.loadData(page, pageSize, deptUuid, keyword);
  };

  render() {
    const {
      form: { getFieldDecorator },
      post: { data, current = {}, visible2 },
      loading
    } = this.props;
    const { visible } = this.state;

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="岗位名称"
          >
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "请输入岗位名称,长度在2-36个字符",
                  min: 2,
                  max: 36
                }
              ],
              initialValue: current.name
            })(<Input placeholder="请输入岗位名称" />)}
          </FormItem>
        </Form>
      );
    };

    const modalFooter = {
      okText: "保存",
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title={data.deptName}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: "0 32px 40px 32px" }}
          >
            <Button
              type="dashed"
              style={{ marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                this.addBtn = findDOMNode(component);
              }}
            >添加</Button>

            <Button
              type="dashed"
              style={{ marginBottom: 8 }}
              icon="reload"
              loading={loading}
              onClick={this.reloadData}
            >刷新数据</Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              dataSource={data.list || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item.id);
                      }}
                    >
                      编辑
                    </a>,
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.handleDelete(item.id);
                      }}
                    >
                      删除
                    </a>
                  ]}
                >
                  <List.Item.Meta title={item.name} />
                </List.Item>
              )}
            />
          </Card>
        </div>

        <div className={styles.pagination}>
          <Pagination {...data.pagination} onChange={this.handleChangePage} />
        </div>

        <Modal
          title={`${(!!current && !!current.id) ? "编辑" : "添加"}岗位`}
          width={640}
          bodyStyle={{ padding: "28px 0 0" }}
          destroyOnClose
          visible={visible || visible2}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default post;

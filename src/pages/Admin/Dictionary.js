import React, { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import { connect } from "dva";
import {
  List,
  Card,
  Select,
  Input,
  Button,
  Modal,
  Form,
  Pagination
} from "antd";

import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Dictionary.less";

const FormItem = Form.Item;

@connect(({ dictionary, loading }) => ({
  dictionary,
  loading: loading.effects["dictionary/fetch"],
  loading2: loading.effects["dictionary/saveOrUpdate"],
  loading3: loading.effects["dictionary/getAllTypes"],
  loading4: loading.effects["dictionary/getById"]
}))
@Form.create()
class dictionary extends PureComponent {
  state = {
    visible: false,
    currentPage: 1,
    pageSize: 20,
    keyword: "",
    type: ""
  };

  componentDidMount() {
    const { currentPage, pageSize, type, keyword } = this.state;
    const { dispatch } = this.props;
    this.loadData(currentPage, pageSize, type, keyword);
    dispatch({
        type: "dictionary/getAllTypes",
        payload: {}
    });
  }

  loadData = (currentPage, pageSize, type, keyword) => {
    const { dispatch } = this.props;
    dispatch({
      type: "dictionary/fetch",
      payload: {
        page: currentPage,
        size: pageSize,
        keyword: keyword,
        type: type
      }
    });
  };

  reloadData = () => {
    const { currentPage, pageSize, type, keyword } = this.state;
    this.loadData(currentPage, pageSize, type, keyword);
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  showEditModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "dictionary/getById",
      payload: {
        uuid: id
      }
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "dictionary/hideModel"
    });
    this.setState({
      visible: false
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { currentPage, pageSize, type, keyword } = this.state;
    var that = this;
    Modal.confirm({
      content: "确认要删除当前字典吗？",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        new Promise((resolve) => {
          dispatch({
            type: "dictionary/deleteById",
            payload: {
              resolve,
              uuid: id
            }
          });
        }).then((res) => {
            if(res.code === 200) {
              that.loadData(currentPage, pageSize, type, keyword);
              dispatch({
                  type: "dictionary/getAllTypes",
                  payload: {}
              });
            }
        })
      },
      onCancel() {}
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      dictionary: { current = {} },
      form
    } = this.props;
    const { currentPage, pageSize, type, keyword } = this.state;
    const id = current ? current.id : "";
    var that = this;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      new Promise((resolve) => {
        dispatch({
          type: "dictionary/saveOrUpdate",
          payload: { resolve, id, ...fieldsValue }
        });
      }).then((res) => {
        if(res.code === 200) {
          that.setState({
            visible: false
          });
          that.loadData(currentPage, pageSize, type, keyword);
          dispatch({
              type: "dictionary/getAllTypes",
              payload: {}
          });
        }
      });
    });
  };

  handleChangePage = page => {
    const { pageSize, type, keyword } = this.state;
    this.setState({
      currentPage: page
    });
    that.loadData(page, pageSize, type, keyword);
  };

  searchDictionary = value => {
    const { pageSize, type } = this.state;
    this.setState({
      currentPage: 1,
      keyword: value
    });
    this.loadData(1, pageSize, type, value);
  };

  handleChangeType = value => {
    const { pageSize, keyword } = this.state;
    this.setState({
      currentPage: 1,
      type: value
    });
    this.loadData(1, pageSize, value, keyword);
  }

  render() {
    const {
      form: { getFieldDecorator },
      dictionary: { data, types, current = {}, visible2 },
      loading, loading2, loading3, loading4
    } = this.props;

    const { visible } = this.state;

    const ListContent = ({ data: { type, value } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
            <span>字典值</span>
            <p>{value}</p>
        </div>
        <div className={styles.listContentItem}>
            <span>类别</span>
            <p>{type}</p>
        </div>
      </div>
    );

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="类型(业务编码)"
          >
            {getFieldDecorator("type", {
              rules: [
                {
                  required: true,
                  message: "请输入有效的字典类型编码,长度在2-60个字符",
                  min: 2,
                  max: 60
                }
              ],
              initialValue: current.type
            })(<Input placeholder="请输入字典类型编码" />)}
          </FormItem>
          
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="字典项名称"
          >
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "请输入有效的字典名称,长度在2-36个字符",
                  min: 2,
                  max: 36
                }
              ],
              initialValue: current.name
            })(<Input placeholder="请输入字典名称" />)}
          </FormItem>
          
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="字典项值"
          >
            {getFieldDecorator("value", {
              rules: [
                {
                  required: true,
                  message: "请输入有效的字典值,只能为数字",
                  min: 1,
                  max: 5
                }
              ],
              initialValue: current.value
            })(<Input placeholder="请输入字典值" />)}
          </FormItem>
          
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="字典描述"
          >
            {getFieldDecorator("remarks", {
              rules: [
                {
                  required: true,
                  message: "请输入字典类型描述",
                  min: 2,
                  max: 20
                }
              ],
              initialValue: current.remarks
            })(<Input placeholder="请输入字典描述" />)}
          </FormItem>

        </Form>
      );
    };
    const options = types.map(d => <Select.Option key={d.key}>{d.name}</Select.Option>);
    const mainSearch = (
        <div style={{ textAlign: "center" }}>
          <Select placeholder="请选择一个类型" defaultValue="all" style={{ width: 140 }} onChange={this.handleChangeType}>
            {options}
          </Select>
          <Input.Search
            onSearch={this.searchDictionary}
            placeholder="请输入字典名称查询"
            style={{ width: 300 }}
          />
        </div>
    );

    const modalFooter = {
          okText: "保存",
          onOk: this.handleSubmit,
          onCancel: this.handleCancel
    };

    return (
      <PageHeaderWrapper title="字典列表" content={mainSearch}>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            style={{ paddingTop: 24 }}
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
            >
              添加
            </Button>
            <Button
              type="dashed"
              style={{ marginBottom: 8 }}
              icon="reload"
              loading={loading || loading3}
              onClick={this.reloadData}
            >刷新数据</Button>

            <List
              size="large"
              rowKey="id"
              loading={loading || loading3}
              dataSource={data.list || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button
                        size="small"
                        loading={ loading4 }
                        icon="edit"
                        onClick={e => {
                            e.preventDefault();
                            this.showEditModal(item.id);
                        }}
                    >编辑</Button>,
                    <Button
                        size="small"
                        icon="delete"
                        type="danger"
                        onClick={e => {
                            e.preventDefault();
                            this.handleDelete(item.id);
                        }}
                    >
                      删除
                    </Button>
                  ]}
                >
                  <List.Item.Meta 
                  title={item.name}
                  description={item.remarks} />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>

        <div className={styles.pagination}>
          <Pagination {...data.pagination} onChange={this.handleChangePage} />
        </div>

        <Modal
          title={`${(!!current && !!current.id) ? "编辑" : "添加"}字典`}
          width={640}
          bodyStyle={{ padding: "28px 0 0" }}
          destroyOnClose={true}
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

export default dictionary;

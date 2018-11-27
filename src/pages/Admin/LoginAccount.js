import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    Modal,
    Tooltip,
    Tag
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './LoginAccount.less';

const FormItem = Form.Item;



class ChangeStateFormContent extends React.Component {

    getItemsValue = () => {
        return this.props.form.getFieldsValue();
    }

    render() {
        const {
            form: { getFieldDecorator }, handleSubmit, stateDefaultValue, loading
        } = this.props;
        return (
            <Form onSubmit={handleSubmit} layout="inline">
                <FormItem>
                    {getFieldDecorator('state', {
                        initialValue: stateDefaultValue
                    })(<Select style={{width:120}}>
                        <Select.Option value="0">正常</Select.Option>
                        <Select.Option value="1">删除</Select.Option>
                        <Select.Option value="2">禁用</Select.Option>
                    </Select>)}
                </FormItem>
                <FormItem>
                    <span className={styles.submitButtons}>
                        <Button type="primary" htmlType="submit" loading={loading}>更改</Button>
                    </span>
                </FormItem>
            </Form>
        );
    }
}
const ChangeStateForm = Form.create()(ChangeStateFormContent);


class SearchFormContent extends React.Component {

    getItemsValue = () => {
        return this.props.form.getFieldsValue();
    }

    render() {
        const {
            form: { getFieldDecorator }, handleSearch, loading
        } = this.props;
        return (
            <Form onSubmit={handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="用户登录名">
                            {getFieldDecorator('username')(<Input placeholder="请输入用户登录名" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="手机号">
                            {getFieldDecorator('phone')(<Input placeholder="请输入用户手机号" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="用户名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入用户名称" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="用户状态">
                            {getFieldDecorator('state', {
                                initialValue: ""
                            })(<Select>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="0">正常</Select.Option>
                                <Select.Option value="1">删除</Select.Option>
                                <Select.Option value="2">禁用</Select.Option>
                            </Select>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit" loading={loading}>查询</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }
}
const SearchForm = Form.create()(SearchFormContent);


@connect(({ loginaccount, loading }) => ({
    loginaccount,
    loading: loading.effects['loginaccount/fetch'],
    loading2: loading.effects['loginaccount/saveOrUpdate'],
    loading3: loading.effects['loginaccount/changeState']
}))
@Form.create()
class LoginAccount extends PureComponent {

    state = {
        selectedRows: [],
        formValues: {},
        page: 1,
        size: 20,
        defaultStateValue: "",
        visibleStateModel: false,
        defaultKey: ""
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: "loginaccount/fetch",
            payload: {}
        });
    }

    showModal = (current) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'loginaccount/showModel',
            payload: current,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            dispatch,
            loginaccount: { current = {} },
            form
        } = this.props;
        const { page, size, formValues } = this.state;
        const id = current ? current.key : "";

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            new Promise((resolve) => {
                dispatch({
                    type: "loginaccount/saveOrUpdate",
                    payload: { resolve, id, ...fieldsValue }
                });
            }).then((res) => {
                if (res.code === 200) {
                    const params = {
                        page: page,
                        size: size,
                        ...formValues
                    };
                    dispatch({
                        type: 'loginaccount/fetch',
                        payload: params,
                    });
                }
            });
        });
    };

    handleSearch = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        const { size } = this.state;
        const formValues = this.formRef.getItemsValue();
        this.setState({
            formValues: formValues,
            page: 1
        });
        const params = {
            page: 1,
            size: size,
            ...formValues
        };
        dispatch({
            type: 'loginaccount/fetch',
            payload: params,
        });
    };

    handleCancel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'loginaccount/hideModel'
        });
    };

    resetPwd = (key) => {
        const { dispatch } = this.props;
        Modal.confirm({
            title: '重置用户密码确认提醒?',
            okText: "确认",
            okType: "primary",
            cancelText: "取消",
            onOk() {
                dispatch({
                    type: 'loginaccount/resetpwd',
                    payload: {
                        id: key,
                    }
                });
            }
        });
    }

    changeState = (key) => {
        const { dispatch } = this.props;
        const { page, size, formValues } = this.state;
        Modal.confirm({
            title: '确认要删除选择的用户账号信息吗?',
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
                new Promise((resolve) => {
                    dispatch({
                        type: 'loginaccount/remove',
                        payload: {
                            resolve,
                            id: key,
                        }
                    });
                }).then((res) => {
                    if (res.code === 200) {
                        const params = {
                            page: page,
                            size: size,
                            ...formValues
                        };
                        dispatch({
                            type: 'loginaccount/fetch',
                            payload: params,
                        });
                    }
                });
            }
        });
    };

    handleMenuClickFun = (key, record) => {
        if ("changeStats" === key ) {
            this.showStateModel(record)
        } else if ("showModal" === key) {
            this.showModal(record)
        } else if ("resetPwd" === key) {
            this.resetPwd(record.key)
        }
    };

    handleChangeState = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        const { page, size, formValues, defaultKey } = this.state;
        const formValuesObj = this.formRef.getItemsValue();

        const that = this;

        Modal.confirm({
            title: '确认要将更改当前用户账号状态吗?',
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
                new Promise((resolve) => {
                    dispatch({
                        type: 'loginaccount/changeState',
                        payload: {
                            resolve,
                            id: defaultKey,
                            ...formValuesObj
                        }
                    });
                }).then((res) => {
                    if (res.code === 200) {
                        that.hideStateModel();
                        const params = {
                            page: page,
                            size: size,
                            ...formValues
                        };
                        dispatch({
                            type: 'loginaccount/fetch',
                            payload: params,
                        });
                    }
                });
            }
        });
    }

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
            type: 'loginaccount/fetch',
            payload: params,
        });
    };

    showStateModel = (record) => {
        this.setState({
            visibleStateModel: true,
            defaultKey: record.key,
            defaultStateValue: record.state
        });
    }

    hideStateModel = () => {
        this.setState({
            visibleStateModel: false,
            defaultKey: "",
            defaultStateValue: ""
        })
    }

    render() {

        const {
            form: { getFieldDecorator },
            loginaccount: { data, current, visible },
            loading, loading2, loading3
        } = this.props;

        const { selectedRows, visibleStateModel, defaultStateValue } = this.state;

        const handleMenuClick = (key, record) => {
            this.handleMenuClickFun(key, record)
        };

        const columns = [
            {
                title: '用户登录账号',
                dataIndex: 'username',
            },
            {
                title: '手机号',
                dataIndex: 'phone',
            },
            {
                title: '用户名称',
                dataIndex: 'name',
            },
            {
                title: '身份证号',
                dataIndex: 'idnumber',
                render: ( text ) => {
                    return text || "-"
                }
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render: ( text ) => {
                    return text === "1" ? (<Tooltip title="男"><Icon type="man" /></Tooltip>) : (<Tooltip title="女"><Icon type="woman" /></Tooltip>)
                }
            },
            {
                title: '状态',
                dataIndex: 'state',
                render: ( text ) => {
                    return text === "0" ? (<Tag color="green">正常</Tag>) : text === "1" ? (<Tag color="orange">已删除</Tag>) : (<Tag color="red">已停用</Tag>)
                }
            },
            {
                title: '添加时间',
                dataIndex: 'addtime',
            },
            {
                title: '操作',
                render: (record) => (
                    <Fragment>
                        <Dropdown overlay={
                            <Menu onClick={({ key }) => handleMenuClick(key, record)}>
                                <Menu.Item key="showModal">修改信息</Menu.Item>
                                <Menu.Item key="resetPwd">重置密码</Menu.Item>
                                <Menu.Item key="changeStats">更改用状态</Menu.Item>
                            </Menu>
                        }>
                            <a size="small"> 操作 </a>
                        </Dropdown>
                    </Fragment>
                ),
            },
        ];

        const modalFooter = {
            okText: "保存",
            onOk: this.handleSubmit,
            onCancel: this.handleCancel
        };

        const getModalContent = () => {
            return (
                <Form onSubmit={this.handleSubmit}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账号名">
                        {getFieldDecorator("username", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入用户账号名",
                                }
                            ],
                            initialValue: current.username
                        })(<Input disabled={(!!current && !!current.key)} placeholder="请输入用户账号名" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
                        {getFieldDecorator("phone", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入有效的手机号",
                                    min: 11,
                                    max: 11
                                }
                            ],
                            initialValue: current.phone
                        })(<Input placeholder="请输入用户手机号" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名称">
                        {getFieldDecorator("name", {
                            initialValue: current.name
                        })(<Input placeholder="请输入用户名称" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="身份证号">
                        {getFieldDecorator("idnumber", {
                            initialValue: current.idnumber
                        })(<Input placeholder="请输入用户账号编码" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户性别">
                        {getFieldDecorator('sex', {
                            initialValue: current.sex || "1"
                        })(<Select>
                            <Select.Option value="1">男</Select.Option>
                            <Select.Option value="0">女</Select.Option>
                        </Select>)}
                    </FormItem>
                </Form>
            );
        };

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}><SearchForm handleSearch={this.handleSearch} loading={loading} wrappedComponentRef={(form) => this.formRef = form} /></div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.showModal({})}>新建</Button>
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
                    title={`${(!!current && !!current.key) ? "编辑" : "添加"}用户账号`}
                    width={640}
                    bodyStyle={{ padding: "28px 0 0" }}
                    destroyOnClose={true}
                    confirmLoading={loading2}
                    visible={visible}
                    {...modalFooter}
                >
                    {getModalContent()}
                </Modal>

                <Modal
                    title="切换用户状态为"
                    width={420}
                    bodyStyle={{ padding: "28px", textAlign: "center" }}
                    destroyOnClose={true}
                    onCancel={this.hideStateModel}
                    visible={visibleStateModel}
                    footer={null}>
                    <ChangeStateForm  handleSubmit={this.handleChangeState} stateDefaultValue={defaultStateValue} loading={loading3}  wrappedComponentRef={(form) => this.formRef = form} />
                </Modal>

            </PageHeaderWrapper>
        );

    }
}

export default LoginAccount;

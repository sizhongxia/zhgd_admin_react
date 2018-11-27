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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Area.less';

const FormItem = Form.Item;


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
                        <FormItem label="上级编码">
                            {getFieldDecorator('pcode')(<Input placeholder="请输入区域父级编码" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="区域编码">
                            {getFieldDecorator('code')(<Input placeholder="请输入区域编码" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="区域名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入区域名称" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="区域拼音">
                            {getFieldDecorator('pinyin')(<Input placeholder="请输入区域拼音" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="区域简拼">
                            {getFieldDecorator('jianpin')(<Input placeholder="请输入区域简拼" />)}
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


@connect(({ area, loading }) => ({
    area,
    loading: loading.effects['area/fetch'],
    loading2: loading.effects['area/saveOrUpdate']
}))
@Form.create()
class Area extends PureComponent {

    state = {
        selectedRows: [],
        formValues: {},
        page: 1,
        size: 20
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: "area/fetch",
            payload: {}
        });
    }

    showModal = (current) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'area/showModel',
            payload: current,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            dispatch,
            area: { current = {} },
            form
        } = this.props;
        const { page, size, formValues } = this.state;
        const id = current ? current.key : "";

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            new Promise((resolve) => {
                dispatch({
                    type: "area/saveOrUpdate",
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
                        type: 'area/fetch',
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
            type: 'area/fetch',
            payload: params,
        });
    };

    handleCancel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'area/hideModel'
        });
    };

    handleDelete = (key) => {
        const { dispatch } = this.props;
        const { page, size, formValues } = this.state;
        Modal.confirm({
            title: '确认要删除选择的区域信息吗?',
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
                new Promise((resolve) => {
                    dispatch({
                        type: 'area/remove',
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
                            type: 'area/fetch',
                            payload: params,
                        });
                    }
                });
            }
        });
    };

    handleTableMenuClick = e => {
        const { dispatch } = this.props;
        const { selectedRows, page, size, formValues } = this.state;

        if (!selectedRows) {
            message.error("请至少选择一条记录");
            return;
        };

        const that = this;

        if (e.key === "remove") {
            Modal.confirm({
                title: '确认要删除选择的区域信息吗?',
                okText: "确认",
                okType: "danger",
                cancelText: "取消",
                onOk() {
                    new Promise((resolve) => {
                        dispatch({
                            type: 'area/remove',
                            payload: {
                                resolve,
                                ids: selectedRows.map(row => row.key),
                            }
                        });
                    }).then((res) => {
                        if (res.code === 200) {
                            that.setState({
                                selectedRows: [],
                            });
                            const params = {
                                page: page,
                                size: size,
                                ...formValues
                            };
                            dispatch({
                                type: 'area/fetch',
                                payload: params,
                            });
                        }
                    });
                }
            });
        }
    };

    importXml = () => {
        message.warn("TODO: 导入功能暂未开发")
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
            type: 'area/fetch',
            payload: params,
        });
    };

    render() {

        const {
            form: { getFieldDecorator },
            area: { data, current, visible },
            loading, loading2
        } = this.props;

        const { selectedRows } = this.state;

        const menu = (
            <Menu onClick={this.handleTableMenuClick} selectedKeys={["remove"]}>
                <Menu.Item key="remove">删除</Menu.Item>
            </Menu>
        );

        const columns = [
            {
                title: '上级编码',
                dataIndex: 'pcode',
            },
            {
                title: '区域编码',
                dataIndex: 'code',
            },
            {
                title: '区域名称',
                dataIndex: 'name',
            },
            {
                title: '区域拼音',
                dataIndex: 'pinyin',
            },
            {
                title: '区域简拼',
                dataIndex: 'jianpin',
            },
            {
                title: '操作',
                render: (record) => (
                    <Fragment>
                        <a onClick={() => this.showModal(record)}>编辑</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.handleDelete(record.key)}>删除</a>
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
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级编码">
                        {getFieldDecorator("pcode", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入区域上级编码",
                                }
                            ],
                            initialValue: current.pcode
                        })(<Input placeholder="请输入区域上级编码" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="区域名称">
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入区域名称,长度在2-36个字符",
                                    min: 2,
                                    max: 36
                                }
                            ],
                            initialValue: current.name
                        })(<Input placeholder="请输入区域名称" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="区域编码">
                        {getFieldDecorator("code", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入区域编码",
                                }
                            ],
                            initialValue: current.code
                        })(<Input placeholder="请输入区域编码" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称拼音">
                        {getFieldDecorator("pinyin", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入区域名称拼音",
                                }
                            ],
                            initialValue: current.pinyin
                        })(<Input placeholder="请输入区域名称拼音" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称简拼">
                        {getFieldDecorator("jianpin", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入区域名称简拼",
                                }
                            ],
                            initialValue: current.jianpin
                        })(<Input placeholder="请输入区域名称简拼" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="区域经度">
                        {getFieldDecorator("lng", {
                            initialValue: current.lng
                        })(<Input placeholder="请输入区域经度" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="区域纬度">
                        {getFieldDecorator("lat", {
                            initialValue: current.lat
                        })(<Input placeholder="请输入区域纬度" />)}
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
                            <Button icon="cloud-upload" type="dashed" onClick={() => this.importXml({})}>导入</Button>
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
                    title={`${(!!current && !!current.key) ? "编辑" : "添加"}区域`}
                    width={640}
                    bodyStyle={{ padding: "28px 0 0" }}
                    destroyOnClose
                    confirmLoading={loading2}
                    visible={visible}
                    {...modalFooter}
                >
                    {getModalContent()}
                </Modal>

            </PageHeaderWrapper>
        );

    }
}

export default Area;

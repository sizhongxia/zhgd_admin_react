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
    DatePicker,
    Upload
} from 'antd';
import Link from 'umi/link';
const { RangePicker } = DatePicker;

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { joinHost } from "@/services/server.config";

import styles from './Construction.less';

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
                        <FormItem label="工地简称">
                            {getFieldDecorator('name')(<Input placeholder="请输入工地简称" />)}
                        </FormItem>
                    </Col>
                    <Col lg={8} md={12} sm={24}>
                        <FormItem label="工地全称">
                            {getFieldDecorator('proName')(<Input placeholder="请输入工地全称" />)}
                        </FormItem>
                    </Col>
                    <Col lg={8} md={12} sm={24}>
                        <FormItem label="工地编码">
                            {getFieldDecorator('proCode')(<Input placeholder="请输入工地编码" />)}
                        </FormItem>
                    </Col>
                    <Col lg={12} md={24} sm={24}>
                        <FormItem label="添加时间">
                            {getFieldDecorator('addTime')(<RangePicker showTime={true} format="YYYY-MM-DD HH:mm:ss"/>)}
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


class ConstructionPicManageContent extends React.Component {

    render() {
        const {
            handleFileChange, current
        } = this.props;

        return (
            <Row gutter={{ md: 12, lg: 24, xl: 24 }}>
                <Col lg={24} md={24} sm={24}>
                    {current.logo !== "" && (
                        <div style={{minHeight:240}}>
                            <img style={{width:'100%',maxHeight:240,marginBottom:10}} src={current.logo} />
                        </div>
                    )}
                    <Upload disabled={current.uploading} name="avatar" accept="image/*" showUploadList={false}
                        action={joinHost("upload/change/projectlogo?uuid=" + current.key)}
                        onChange={handleFileChange}>
                        <Button style={{marginBottom:40,marginTop:10}}><Icon type="upload" /> 上传/更改概况LOGO</Button>
                    </Upload>
                </Col>
                <Col lg={24} md={24} sm={24}>
                    {current.locationmap !== "" && (
                        <div style={{minHeight:240}}>
                            <img style={{width:'100%',maxHeight:240,marginBottom:10}} src={current.locationmap} />
                        </div>
                    )}
                    <Upload disabled={current.uploading} name="avatar" accept="image/*" showUploadList={false}
                        action={joinHost("upload/change/projectlocationmap?uuid=" + current.key)}
                        onChange={handleFileChange}>
                        <Button style={{marginTop:10}}><Icon type="upload" /> 上传/更改区位图</Button>
                    </Upload>
                </Col>
            </Row>
        );
    }
}
const ConstructionPicManageContentModel = Form.create()(ConstructionPicManageContent);


@connect(({ project, loading }) => ({
    project,
    loading: loading.effects['project/fetch']
}))
@Form.create()
class Construction extends PureComponent {

    state = {
        selectedRows: [],
        formValues: {},
        scurrent: {},
        page: 1,
        size: 20
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: "project/fetch",
            payload: {}
        });
    }

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
            type: 'project/fetch',
            payload: params,
        });
    };

    showConstructionPicModel = (current) => {
        this.setState({
            scurrent: current
        });
    };

    hideConstructionPicModel = () => {
        this.setState({
            scurrent: {}
        });
    };

    authorization = (key) => {
        console.info("Todo " + key)
    };
    
    handleDelete = (key) => {
        const { dispatch } = this.props;
        const { page, size, formValues } = this.state;
        Modal.confirm({
            title: '确认要删除选择的工地信息吗?',
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
                new Promise((resolve) => {
                    dispatch({
                        type: 'project/remove',
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
                            type: 'project/fetch',
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
            type: 'project/fetch',
            payload: params,
        });
    };

    handleFileChange = info => {
        const { dispatch } = this.props;
        const { scurrent, page, size, formValues } = this.state;
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
            if(res.type === "projectlocationmap") {
                scurrent.locationmap = res.url
            } else if (res.type === "projectlogo") {
                scurrent.logo = res.url
            } else {
                return;
            }
            const params = {
                page: page,
                size: size,
                ...formValues
            };
            dispatch({
                type: 'project/fetch',
                payload: params,
            });
            scurrent.uploading = false;
            this.setState({
                scurrent: scurrent
            });
            !!scurrent.uploadLoadingModels && scurrent.uploadLoadingModels();
        }
      };

    render() {

        const {
            project: { data },
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
                title: '工地简称',
                dataIndex: 'name',
            },
            {
                title: '工地编码',
                dataIndex: 'procode',
            },
            {
                title: '工地全称',
                dataIndex: 'proname',
            },
            {
                title: '添加时间',
                dataIndex: 'addtime',
            },
            {
                title: '操作',
                render: (record) => (
                    <Fragment>
                        <Link to={`/construction/edit/${record.key}`}>编辑</Link>
                        <Divider type="vertical" />
                        <a onClick={() => this.showConstructionPicModel(record)}>图片</a>
                        <Divider type="vertical" />
                        {/**
                        <a onClick={() => this.authorization(record.key)}>授权</a>
                        <Divider type="vertical" />
                         */}
                        <a style={{color:"#f5222d"}} onClick={() => this.handleDelete(record.key)}>删除</a>
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
                            <Link to="/construction/create">
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
                    title={`工地图片`}
                    width={640}
                    bodyStyle={{padding:"25px 52px", textAlign:"center"}}
                    destroyOnClose={true}
                    onCancel={this.hideConstructionPicModel}
                    visible={!!scurrent.key}
                    footer={null}
                    >
                    <ConstructionPicManageContentModel current={scurrent} handleFileChange={this.handleFileChange}/>
                </Modal>
            </PageHeaderWrapper>
        );

    }
}

export default Construction;

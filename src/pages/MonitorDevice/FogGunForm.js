import React, { PureComponent } from 'react';

import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Divider,
  Cascader,
  InputNumber,
  Modal,
  message,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Option } = Select;

@connect(({ fogGun, loading }) => ({
  fogGun,
  loading: loading.effects['fogGun/initDevice', 'fogGun/initCompanyList', 'fogGun/initProjectList'],
  creating: loading.effects['fogGun/saveOrUpdate']
}))
@Form.create()
class FogGunForm extends PureComponent {

  state = {
    uuid: ''
  };
  
  componentDidMount() {
    const { dispatch, match } = this.props;

    const deviceUuid = match.params.deviceUuid;
    if(!!deviceUuid) {
      this.setState({
        uuid: deviceUuid
      });
      new Promise((resolve) => {
        dispatch({
          type: "fogGun/initDevice",
          payload: {
            resolve,
            uuid: deviceUuid
          }
        });
      }).then((res) => {
        if (res.code !== 200) {
          Modal.confirm({
            content: "无效的参数",
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              router.push('/deviceMonitor/fogGun')
            },
            onCancel() {
              router.push('/deviceMonitor/fogGun')
            }
          });
        }
      });
    } else {
      dispatch({
        type: "fogGun/cleanCurrent",
        payload: {}
      });
    }
    
    // 初始加载公司信息
    dispatch({
        type: "fogGun/initCompanyList",
        payload: {}
    });

    // 初始加载类型
    dispatch({
      type: "fogGun/initDeviceFogGunTypes",
      payload: {}
    });

    // 初始加载信息
    dispatch({
        type: "fogGun/initProjectList",
        payload: {}
    });
    
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { uuid } = this.state;
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      new Promise((resolve) => {
        dispatch({
          type: "fogGun/saveOrUpdate",
          payload: {
            resolve,
            uuid,
            ...values
          }
        });
      }).then((res) => {
        if (res.code === 200) {
          Modal.confirm({
            content: "保存成功, 是否跳转至设备列表页？",
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              router.push('/deviceMonitor/fogGun')
            },
            onCancel() {
              if(!!uuid) {
                dispatch({
                  type: "fogGun/initDevice",
                  payload: {
                    uuid: uuid
                  }
                });
              } else {
                form.resetFields();
              }
            }
          });
        } else {
          message.error(res.message)
        }
      });
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      fogGun: { projects, supplierCompanys, agentCompanys, fogGunTypes, current },
      loading, creating
    } = this.props;
    const { uuid } = this.state;

    return (
      <PageHeaderWrapper>
        <Card title={`${uuid === '' ? '新增' : '修改'}设备`} bordered={false} loading={loading}>
          <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark={false}>
            <Divider orientation="left"><Icon type="info-circle" /> 基本信息</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="设备名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入设备名称' }],
                    initialValue: current.name
                  })(<Input placeholder="请输入设备名称" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="设备编码">
                  {getFieldDecorator('equipmentno', {
                    rules: [{ required: true, message: '请输入设备编码' }],
                    initialValue: current.equipmentno
                  })(<Input placeholder="请输入设备编码" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="所属工地">
                  {getFieldDecorator('prouuid', {
                    rules: [{ required: true, message: '请选择所属工地' }],
                    initialValue: current.prouuid
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择所属工地"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { projects.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="类型">
                  {getFieldDecorator('spraytype', {
                    rules: [{ required: true, message: '请选择一个类型' }],
                    initialValue: current.spraytype
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择一个类型">
                      { fogGunTypes.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="安装时间">
                  {getFieldDecorator('installtime', {
                    rules: [{ required: true, message: '请选择安装时间' }],
                    initialValue: current.installtime && moment(current.installtime, "YYYY-MM-DD")
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择安装时间" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="产品供应商">
                  {getFieldDecorator('suppliercompanyuuid', {
                    rules: [{ required: true, message: '请选择一个产品供应商' }],
                    initialValue: current.suppliercompanyuuid
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择产品供应商"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { supplierCompanys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="产品代理商">
                  {getFieldDecorator('agentcompanyuuid', {
                    initialValue: current.agentcompanyuuid
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择产品代理商"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      <Option value="">无代理</Option>
                      { agentCompanys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="位置经度">
                  {getFieldDecorator('lng', {
                    initialValue: current.lng
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入位置经度" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="位置纬度">
                  {getFieldDecorator('lat', {
                    initialValue: current.lat
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入位置纬度" />)}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left"><Icon type="deployment-unit" /> 监控配置</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="设备IP地址和端口">
                  {getFieldDecorator('ipaddressport', {
                    initialValue: current.ipaddressport
                  })(<Input placeholder="请输入IP地址和端口" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="主机地址">
                  {getFieldDecorator('host', {
                    initialValue: current.host
                  })(<Input placeholder="请输入主机地址" />)}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left"><Icon type="share-alt" /> 联系方式</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="负责人">
                  {getFieldDecorator('personincharge',{
                    initialValue: current.personincharge
                  })(<Input placeholder="请输入设备负责人" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="负责人联系方式">
                  {getFieldDecorator('personinchargephone',{
                    initialValue: current.personinchargephone
                  })(<Input placeholder="请输入设备负责人联系方式" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="安装人员姓名">
                  {getFieldDecorator('installperson',{
                    initialValue: current.installperson
                  })(<Input placeholder="请输入安装人员姓名" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="安装人员联系电话">
                  {getFieldDecorator('installpersonphone',{
                    initialValue: current.installpersonphone
                  })(<Input placeholder="请输入安装人员联系电话" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24} md={24} sm={24} style={{textAlign:'center'}}>
                <Button type="primary" htmlType="submit" loading={creating}>{`${uuid === '' ? '新增' : '修改'}设备信息`}</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );

  }
}

export default FogGunForm;

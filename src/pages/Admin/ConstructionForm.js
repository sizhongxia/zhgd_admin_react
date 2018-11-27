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

@connect(({ projectcreate, loading }) => ({
  projectcreate,
  loading: loading.effects['projectcreate/initProject', 'projectcreate/companyList', 'projectcreate/initArea', 'projectcreate/dictionaryList'],
  creating: loading.effects['projectcreate/saveOrUpdate']
}))
@Form.create()
class ConstructionForm extends PureComponent {

  state = {
    uuid: ''
  };
  
  componentDidMount() {
    const { dispatch, match } = this.props;

    const proUuid = match.params.proUuid;
    if(!!proUuid) {
      this.setState({
        uuid: proUuid
      });
      new Promise((resolve) => {
        dispatch({
          type: "projectcreate/initProject",
          payload: {
            resolve,
            uuid: proUuid
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
              router.push('/construction/data')
            },
            onCancel() {
              router.push('/construction/data')
            }
          });
        }
      });
    } else {
      dispatch({
        type: "projectcreate/cleanCurrent",
        payload: {}
      });
    }
    

    // 初始加载所有公司信息
    dispatch({
        type: "projectcreate/companyList",
        payload: {}
    });
    // 初始加载区域
    dispatch({
        type: "projectcreate/initArea"
    });
    // 初始加载字典表
    var dicts = ["proType","proConstructionNature","proMainStructureType","proFunction"];
    for (const item of dicts) {
      dispatch({
        type: "projectcreate/dictionaryList",
        payload: {
          type: item
        }
      });
    }
    
  };


  // 区域信息
  // loadAreaChildData = (selectedOptions) => {
  //   const { dispatch } = this.props;
  //   const size = selectedOptions.length;
  //   const targetOption = selectedOptions[selectedOptions.length - 1];
  //   dispatch({
  //     type: "projectcreate/showAreaNodeLoading",
  //     payload: {
  //       code: targetOption.value
  //     }
  //   });
  //   new Promise((resolve) => {
  //     dispatch({
  //       type: "projectcreate/areaLevel" + (size + 1),
  //       payload: {
  //         resolve,
  //         pcode: targetOption.value
  //       }
  //     });
  //   }).then((res) => {
  //     dispatch({
  //       type: "projectcreate/hideAreaNodeLoading"
  //     });
  //   });
  // };

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
          type: "projectcreate/saveOrUpdate",
          payload: {
            resolve,
            uuid,
            ...values
          }
        });
      }).then((res) => {
        if (res.code === 200) {
          Modal.confirm({
            content: "保存成功, 是否跳转至工地项目列表页？",
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              router.push('/construction/data')
            },
            onCancel() {
              if(!!uuid) {
                dispatch({
                  type: "projectcreate/initProject",
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
      projectcreate: { companys, areas, types, constructionnatures, mainstructuretypes, functions, current },
      loading, creating
    } = this.props;
    const { uuid } = this.state;

    // 1建设
    const buildingCompanys = [];
    // 2施工
    const constructionCompanys = [];
    // 3设计
    const designCompanys = [];
    // 4监理
    const supervisionCompanys = [];
    // 5勘察
    const surveyCompanys = [];
    // 6劳务分包商
    const subcontractorCompanys = [];

    // 细化公司分类
    companys.map(item => {
      switch(item.type) {
        case 1: buildingCompanys.push(item);break;
        case 2: constructionCompanys.push(item);break;
        case 3: designCompanys.push(item);break;
        case 4: supervisionCompanys.push(item);break;
        case 5: surveyCompanys.push(item);break;
        case 6: subcontractorCompanys.push(item);break;
      }
    });

    if(!current.subcontractorcompany) {
      current.subcontractorcompany = [];
    }
    if(!current.mainstructuretype) {
      current.mainstructuretype = [];
    }
    if(!current.function) {
      current.function = [];
    }

    return (
      <PageHeaderWrapper>
        <Card title={`${uuid === '' ? '新增' : '修改'}工地项目`} bordered={false} loading={loading}>
          <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark={false}>
            <Divider orientation="left"><Icon type="info-circle" /> 基本信息</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="项目全称">
                  {getFieldDecorator('proname', {
                    rules: [{ required: true, message: '请输入项目全称' }],
                    initialValue: current.proname
                  })(<Input placeholder="请输入项目全称" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="项目简称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入项目简称' }],
                    initialValue: current.name
                  })(<Input placeholder="请输入项目简称" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="人员数据统计来源">
                  {getFieldDecorator('personnelpositioning', {
                    rules: [{ required: true, message: '请选择一个人员数据统计来源' }],
                    initialValue: current.personnelpositioning
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择人员数据统计来源"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      <Option value="0">闸机</Option>
                      <Option value="1">人员定位</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="所属单位">
                  {getFieldDecorator('companyuuid', {
                    rules: [{ required: true, message: '请选择所属单位' }],
                    initialValue: current.companyuuid
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择所属单位"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { companys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="工地所属区域">
                  {getFieldDecorator('areainfo', {
                    rules: [{ required: true, message: '请选择工地所属区域' }],
                    initialValue: current.areainfo
                  })(
                    <Cascader placeholder="请选择工地所属区域"
                      options={areas}
                      changeOnSelect
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="总投资额(万元)">
                  {getFieldDecorator('investment', {
                    initialValue: current.investment
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入总投资额(万元)" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="建筑面积(㎡)">
                  {getFieldDecorator('measure', {
                    initialValue: current.measure
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入建筑面积(㎡)" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="建筑层数">
                  {getFieldDecorator('numberoflayers', {
                    initialValue: current.numberoflayers
                  })(<Input placeholder="请输入建筑层数" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="工地宽度">
                  {getFieldDecorator('width', {
                    initialValue: current.width
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入工地宽度" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="工地长度">
                  {getFieldDecorator('length', {
                    initialValue: current.length
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入工地长度" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="计划开工日期">
                  {getFieldDecorator('planstarttime', {
                    initialValue: current.planstarttime && moment(current.planstarttime, "YYYY-MM-DD")
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择计划开工日期" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="计划竣工日期">
                  {getFieldDecorator('planendtime', {
                    initialValue: current.planstarttime && moment(current.planendtime, "YYYY-MM-DD")
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择计划竣工日期" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="位置经度">
                  {getFieldDecorator('longitude', {
                    initialValue: current.longitude
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入工地位置经度" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="位置纬度">
                  {getFieldDecorator('latitude', {
                    initialValue: current.latitude
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入工地位置纬度" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="工程类型">
                  {getFieldDecorator('type', {
                    initialValue: current.type
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择工程类型"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { types.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="建设性质">
                  {getFieldDecorator('constructionnature', {
                    initialValue: current.constructionnature
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择一个建设性质"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { constructionnatures.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="主体结构类型">
                  {getFieldDecorator('mainstructuretype', {
                    initialValue: current.mainstructuretype
                  })(
                    <Select mode="multiple" style={{ width: '100%' }} showSearch placeholder="请选择主体结构类型(可多选)"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { mainstructuretypes.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="项目功能">
                  {getFieldDecorator('function',{
                    initialValue: current.function
                  })(
                    <Select mode="multiple" style={{ width: '100%' }} showSearch placeholder="请选择项目功能(可多选)"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { functions.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="分包单位">
                  {getFieldDecorator('subcontractorcompany',{
                    initialValue: current.subcontractorcompany
                  })(
                    <Select mode="multiple" style={{ width: '100%' }} showSearch placeholder="请选择工地分包单位(可多选)"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { subcontractorCompanys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left"><Icon type="deployment-unit" /> 五方单位</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="施工单位">
                  {getFieldDecorator('construction',{
                    initialValue: current.construction
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择工地施工单位"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { constructionCompanys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="建设单位">
                  {getFieldDecorator('building',{
                    initialValue: current.building
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择工地建设单位"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { buildingCompanys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="设计单位">
                  {getFieldDecorator('design',{
                    initialValue: current.design
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择工地设计单位"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { designCompanys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="勘测单位">
                  {getFieldDecorator('survey',{
                    initialValue: current.survey
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择工地勘测单位"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { surveyCompanys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="监管单位">
                  {getFieldDecorator('supervision',{
                    initialValue: current.supervision
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择工地监管单位"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { supervisionCompanys.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left"><Icon type="share-alt" /> 联系方式</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="现场负责人">
                  {getFieldDecorator('personname',{
                    initialValue: current.personname
                  })(<Input placeholder="请输入工地现场负责人" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="负责人联系方式">
                  {getFieldDecorator('phone',{
                    initialValue: current.phone
                  })(<Input placeholder="请输入工地现场负责人联系方式" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="销售人员姓名">
                  {getFieldDecorator('salesname',{
                    initialValue: current.salesname
                  })(<Input placeholder="请输入销售人员姓名" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="销售联系电话">
                  {getFieldDecorator('salesphone',{
                    initialValue: current.salesphone
                  })(<Input placeholder="请输入销售联系电话" />)}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left"><Icon type="user" /> 账号信息</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="超管账号">
                  {getFieldDecorator('username',{
                    rules: [{ required: true, message: '请输入超管账号' }],
                    initialValue: current.username
                  })(<Input disabled={uuid !== ''} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入超管账号" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="超管密码">
                  {getFieldDecorator('password',{
                    rules: [{ required: true, message: '请输入超管密码' }],
                    initialValue: current.password
                  })(<Input disabled={uuid !== ''} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入超管密码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24} md={24} sm={24} style={{textAlign:'center'}}>
                <Button type="primary" htmlType="submit" loading={creating}>{`${uuid === '' ? '新增' : '修改'}工地信息`}</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );

  }
}

export default ConstructionForm;

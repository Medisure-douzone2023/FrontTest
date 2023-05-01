import React from 'react';
import { Col, Row, DatePicker, Dropdown, Button, Input, Table, Menu } from 'antd';
import { useState } from 'react';
import '../../assets/styles/Spec.css';


function Spec(props) {
  const [drops, setdrops] = useState(1);

  const handleMenuClick = (e) => {
    setdrops(e.key);
  };
  const { RangePicker } = DatePicker;
  const columns = [
    {
      title: "no",
      dataIndex: "no",
      key: "no"
    },
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
    },
  
    {
      title: "보험유형",
      key: "insurance",
      dataIndex: "insurance",
    },
    {
      title: "진행상태",
      key: "status",
      dataIndex: "status",
    },
  ];
  const data = [
    {
      no: (
        <>
          <div>1</div>
        </>
      ),
      name: (
        <>
          <div className="author-info">
            조영인
          </div>
        </>
      ),
      insurance: (
        <>
          <div>건강보험</div>
        </>
      ),
      status: (
        <>
          <div className="ant-employed">
            미심사
          </div>
        </>
      ),
    },
  ]
  const items = [
    {
      label: '건강보험',
      key: '1'
    },
    {
      label: '의료급여',
      key: '2'
    }
  ];

  const menu = (
    <Menu onClick={handleMenuClick}>
      {items.map(item => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div>
      <Row gutter={[24, 16]} >
      <Col span={8} className='Col1'>
        <span>진료기간</span><RangePicker className='picker' picker="week"/><br/><br/>
        <span>보험유형</span><Dropdown.Button overlay={menu}>{drops == 1 ? '건강보험' : "의료급여"}</Dropdown.Button><br/><br/>
        <span>등록번호</span><Input placeholder="등록번호" style={{width: '50%'}} /><br/><br/>
        <Button type="primary" block style={{width: "80%", margin: '0px 0px'}}>
          조회
        </Button>
        <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  className="ant-border-space"
                />
      </Col>
      <Col span={7} className='Col2'>
        환자정보<br/><br/>
      <div>
        이름:
      </div></Col>
      <Col span={7}></Col>
  
      <Col span={8} />
      <Col span={8} />
      <Col span={8} />
      </Row>
      <Row gutter={[24, 16]}>
      <Col span={8} />
      <Col span={8} />
      <Col span={8} />
      </Row>
    </div>
  );
}

export default Spec;
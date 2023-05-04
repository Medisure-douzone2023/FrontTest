import { useState } from "react";
import { Button, Table, DatePicker, Space, Select, Row, Col } from 'antd';
import axios from 'axios'
const options = [{ value: '미송신', labe: '미송신' }, { value: '변환', labe: '변환' }];
let thisdata;
const handleChange = (value, option) => {
  thisdata = value
};
let apiArray = {};
let searchDate = '';
function Home() {
  const [size, setSize] = useState('middle');
  const { RangePicker } = DatePicker;
  let [data, setData] = useState([]);

  const search = (value, dateString) => {
    searchDate = dateString
    const param = { month: dateString, status: '미송신' };
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODI5ODkzNTgsImV4cCI6MTY4MzI4OTM1OH0.tcEDDuPaoTXnN8FSJvOtis42MzwhyVX75exLp86M93s';
    axios.get("/api/bill", { headers: { "Authorization": token }, params: param }).then((e) => {
      const result = e.data.data;
      for (var i = 0; i < result.length; i++) {
        result[i].key = i;
      }
      setData(result)
    }).catch(() => {
    })
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: '청구번호',
      dataIndex: 'bno',
      key: 'bno',
    },
    {
      title: '진료년월',
      dataIndex: 'cdate',
      key: 'cdate',
    },
    {
      title: '보험유형',
      dataIndex: 'insurance',
      key: 'insurance',
    },
    {
      title: '청구번호',
      dataIndex: 'bnumber',
      key: 'bnumber',
    },
    {
      title: '청구건수',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '본인부담금액',
      dataIndex: 'fprice',
      key: 'fprice',
    },
    {
      title: '청구금액',
      dataIndex: 'billprice',
      key: 'billprice',
    },
    {
      title: '진행상태',
      dataIndex: 'bstatus',
      key: 'bstatus',
    },
    {
      title: '주차',
      dataIndex: 'week',
      key: 'week',
    }
  ];

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    apiArray = selectedRows;
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const send = () => {
    let apiParameters = [];
    for (let i = 0; i < apiArray.length; i++) {
      apiParameters.push(apiArray[i].bno)
    }
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODMxNjM0NzMsImV4cCI6MTY4MzQ2MzQ3M30.KNki4YM9I8iEexAEmx9_SNXJXPRtz2zl1OjxlGj2TAw';
    axios.put("/api/bill/make", apiParameters, {
      headers: {
        "Authorization": token,
      },
    }).then((response) => {
      search(searchDate, searchDate)
      alert("sam 파일 생성이 완료되었습니다.")
    }).catch((error) => {
    });
  }

  return (
    <div>
      <br />
      <h4>청구서 검색</h4>
      <br />
      <Row>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          <Space direction="vertical" size={12}>
            <DatePicker picker="month" onChange={search} />
          </Space>
        </Col>
        <Col xs={{ span: 1, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          <Space
            direction="vertical"
            style={{
              width: '100%',
            }}
          >
            <Select
              size={size}
              defaultValue="미송신"
              onChange={handleChange}
              style={{
                width: 200,
              }}
              options={options}
            />
          </Space>
        </Col>
        <Col xs={{ span: 1, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          <Button type="primary" ghost onClick={search}>검색</Button>
        </Col>
      </Row>
      <br />
      <br />
      <br />
      <h4>청구서 조회</h4>
      <br />
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      <Button type="primary" ghost onClick={send}>송신</Button>
    </div>
  );
}
export default Home;


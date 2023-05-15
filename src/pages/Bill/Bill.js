import { useState } from "react";
import { Button, Table, DatePicker, Space, Select, Row, Col } from 'antd';
import axios from 'axios'

function Bill(props) {
  let token = props.token;
  const statusOptions = [{ value: '미송신', labe: '미송신' }, { value: '변환', labe: '변환' }];
  const insuranceOptions = [{ value: '건강보험', labe: '건강보험' }, { value: '의료급여', labe: '의료급여' }];

  const [date, setDate] = useState('');
  const [insurance, setInsurance] = useState('건강보험');
  const [status, setStatus] = useState('미송신');
  const [size, setSize] = useState('middle');

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
  let [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const selectDate = (value, dateString) => {
    setDate(dateString);
  }
  const selectStatus = (value, option) => {
    setStatus(value);
  };
  const setInsuranceOption = (value, option) => {
    setInsurance(value);
  };

  const search = () => {
    const param = { month: date, insurance: insurance, status: status };
    axios.get("/api/bill", { headers: { "Authorization": token }, params: param }).then((e) => {
      const result = e.data.data;
      for (var i = 0; i < result.length; i++) {
        result[i].key = i;
      }
      setData(result)
    }).catch((e) => {
      console.log("error", e);
    })
  }

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows)
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const send = () => {
    if (selectedRows.length > 0) {
      let apiParameters = [];
      for (let i = 0; i < selectedRows.length; i++) {
        apiParameters.push(selectedRows[i].bno)
      }
      const result = data.filter(d => !selectedRows.some(s => d.key === s.key));
      setData(result)
      setSelectedRows('');
      setSelectedRowKeys('');

      axios.put("/api/bill/make", apiParameters, {
        headers: {
          "Authorization": token,
        },
      }).then((response) => {
        alert("sam 파일 생성이 완료되었습니다.")
      }).catch((e) => {
        console.log("error", e);
      });
    }
  }

  const cancel = () => {
    if (selectedRows.length > 0) {
      let apiParameters = [];
      for (let i = 0; i < selectedRows.length; i++) {
        apiParameters.push(selectedRows[i].bno)
      }

      const result = data.filter(d => !selectedRows.some(s => d.key === s.key));
      setData(result)
      setSelectedRows('');
      setSelectedRowKeys('')

      axios.put("/api/bill/delete", apiParameters, {
        headers: {
          "Authorization": token,
        },
      }).then((response) => {
        alert("sam 파일 삭제가 완료되었습니다.")
      }).catch((e) => {
        console.log("error", e);
      });
    }
  }
  const 송신변환끄기 = () => {
    const isUnSent = selectedRows.map((item) => item.bstatus === '변환');
    const isSent = selectedRows.map((item) => item.bstatus === '미송신');
    console.log("isUnSent",isUnSent)
    if (isUnSent) {
      return true;
    } 
    else {
      return false;
    }
  };

  const 송신취소끄기 = () => {
    const isUnSent = selectedRows.map((item) => item.bstatus === '변환');
    const isSent = selectedRows.map((item) => item.bstatus === '미송신');
    console.log("isSent",isSent)
    if (isSent) {
      return true;
    } 
    else {
      return false;
    }
  };

  return (
    <div>
      <br />
      <h4>청구서 검색</h4>
      <br />
      <Row>
        <Col>
          <Space direction="horizontal" size={12}>
            <DatePicker picker="month" onChange={selectDate} />
            <Select
              size={size}
              defaultValue="건강보험"
              onChange={setInsuranceOption}
              style={{
                width: 200,
              }}
              options={insuranceOptions}
            />
            <Select
              size={size}
              defaultValue="미송신"
              onChange={selectStatus}
              style={{
                width: 200,
              }}
              options={statusOptions}
            />
            <Button type="primary" ghost onClick={search}>검색</Button>
          </Space>
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
        <span style={{marginLeft: 8}}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      <Button type="primary" ghost onClick={send} disabled={ 송신변환끄기()}> 송신 변환 </Button>
      <Button danger onClick={cancel} disabled={송신취소끄기()}>송신 취소</Button>
    </div>
  );
}
export default Bill;

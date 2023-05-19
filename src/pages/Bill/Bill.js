import { useEffect, useRef, useState } from "react";
import { Button, Table, DatePicker, Space, Select, Row, Col, Card } from 'antd';
import axios from 'axios'

function Bill(props) {
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    search();
  }, []);

  let token = props.token;
  const statusOptions = [{ value: null, label: '미선택' },{ value: '미송신', labe: '미송신' }, { value: '변환', labe: '변환' }];
  const insuranceOptions = [{ value: null, label: '미선택' },{ value: '건강보험', labe: '건강보험' }, { value: '의료급여', labe: '의료급여' }];

  const [date, setDate] = useState();
  const [insurance, setInsurance] = useState();
  const [status, setStatus] = useState();
  const [size, setSize] = useState('middle');

  const columns = [
    {
      title: '청구생성번호',
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
      dataIndex: 'bweek',
      key: 'bweek',
    }
  ];
  let [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [checkStatus, setCheckStatus] = useState();

  const selectDate = (value, dateString) => {
    setDate(dateString);
  }
  const selectStatus = (value, option) => {
    setStatus(value);
  };
  const setInsuranceOption = (value, option) => {
    setInsurance(value);
  };

  const formatBnum = (bNum) =>{
    return bNum === 0 ? '미생성' : bNum;
  }

  const search = () => {

    const param = { month: date, insurance: insurance, status: status };
    axios.get("/api/bill", { headers: { "Authorization": token }, params: param }).then((e) => {
      if (!isMountedRef.current) {
        return;
      }
      const data = e.data.data;
      if (data.length === 0) {
        setData(data);
        alert("데이터가 존재하지 않습니다.");
      } else {
        const result = data.map((item, index) => ({
          ...item,
          key: index,
          bnumber: formatBnum(item.bnumber),
          fprice: item.fprice.toLocaleString(),
          billprice: item.billprice.toLocaleString(),
        }));
        setData(result);
      }
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
    if(selectedRows.length === 0){
      alert('선택된 청구서가 없습니다. 송신 및 변환할 청구서를 선택해 주세요!')
    }
    if (selectedRows.length > 0) {
      let apiParameters = [];
      for (let i = 0; i < selectedRows.length; i++) {
        apiParameters.push(selectedRows[i].bno)
      }
      setSelectedRowKeys([]);
      setSelectedRows([]);
      axios.put("/api/bill/make", apiParameters, {
        headers: {
          "Authorization": token,
        },
      }).then((response) => {
        console.log("response",response);
        alert("sam 파일 생성이 완료되었습니다.")
        search()
      }).catch((e) => {
        console.log("error", e);
      });
    }
  }

  const cancel = () => {
    if(selectedRows.length === 0){
      alert('선택된 청구서가 없습니다. 송신 취소 할 청구서를 선택해 주세요!')
    }
    if (selectedRows.length > 0) {
      let apiParameters = [];
      for (let i = 0; i < selectedRows.length; i++) {
        apiParameters.push(selectedRows[i].bno)
      }
      setSelectedRowKeys([]);
      setSelectedRows([]);

      axios.put("/api/bill/delete", apiParameters, {
        headers: {
          "Authorization": token,
        },
      }).then((response) => {
        alert("sam 파일 삭제가 완료되었습니다.")
        search()
      }).catch((e) => {
        console.log("error", e);
      });
    }
  }
  const checkButtonDisabled = (status) => {
    const has미송신 = selectedRows.some((item) => item.bstatus === '미송신');
    const has변환 = selectedRows.some((item) => item.bstatus === '변환');
  
    if (has미송신 && has변환) {
      return true;
    }
    return selectedRows.length > 0 && !selectedRows.every((item) => item.bstatus === status);
  };

  return (
    <div>
      <br />
      <Card style={{ width: '100%' }}>
      <h4>청구서 검색</h4>
      <br />
      <Row>
        <Col>
          <Space direction="horizontal" size={12}>
            <DatePicker picker="month" onChange={selectDate} />
            <Select
              size={size}
              defaultValue="미선택"
              onChange={setInsuranceOption}
              style={{
                width: 200,
              }}
              options={insuranceOptions}
            />
            <Select
              size={size}
              defaultValue="미선택"
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
      <Button type="primary" ghost onClick={send} disabled={checkButtonDisabled('미송신')}> 송신 변환 </Button>
      <Button danger onClick={cancel} disabled={checkButtonDisabled('변환')}>송신 취소</Button>
      </Card>
    </div>
  );
}
export default Bill;

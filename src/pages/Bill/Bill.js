import { useEffect, useRef, useState } from "react";
import { Button, Table, DatePicker, Space, Select, Row, Col, Card } from 'antd';
import axios from 'axios'
import '../../assets/styles/Bill.css';
import Swal from "sweetalert2";
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
      align: 'center'
    },
    {
      title: '진료년월',
      dataIndex: 'cdate',
      key: 'cdate',
      align: 'center'
    },
    {
      title: '보험유형',
      dataIndex: 'insurance',
      key: 'insurance',
      align: 'center'
    },
    {
      title: '청구번호',
      dataIndex: 'bnumber',
      key: 'bnumber',
      align: 'center'
    },
    {
      title: '청구건수',
      dataIndex: 'count',
      key: 'count',
      align: 'center'
    },
    {
      title: '본인부담금액',
      dataIndex: 'fprice',
      key: 'fprice',
      align: 'center'
    },
    {
      title: '청구금액',
      dataIndex: 'billprice',
      key: 'billprice',
      align: 'center'
    },
    {
      title: '진행상태',
      dataIndex: 'bstatus',
      key: 'bstatus',
      align: 'center'
    },
    {
      title: '주차',
      dataIndex: 'bweek',
      key: 'bweek',
      align: 'center'
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
        custom.fire( {icon: 'info' ,html: '데이터가 존재하지 않습니다.'});
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
      custom.fire( {icon: 'error' ,html: '선택된 청구서가 없습니다. <br/> 송신 및 변환할 청구서를 선택해 주세요'});
      return;
    }
    if(selectedRows.some((item) => item.bstatus === '변환')){
      custom.fire( {icon: 'error' ,html: '이미 변환된 청구서가 포함되어 있습니다. 청구서를 확인해 주세요.'});
      setSelectedRowKeys([]);
      setSelectedRows([]);
      return;
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
        custom.fire( {icon: 'success' ,html: 'sam 파일 생성이 완료되었습니다.'});
        search()
      }).catch((e) => {
        console.log("error", e);
      });
    }
  }

  const cancel = () => {
    if(selectedRows.length === 0){
      custom.fire( {icon: 'error',html: '선택된 청구서가 없습니다.<br/> 송신 취소할 청구서를 선택해 주세요!'});
      return
    }
    if(selectedRows.some((item) => item.bstatus === '미송신')){
      custom.fire( {icon: 'error',html: '미송신된 청구서가 포함되어 있습니다. 청구서를 확인해 주세요.'});
      setSelectedRowKeys([]);
      setSelectedRows([]);
      return;
    }
    console.log("ho")
    if (selectedRows.length > 0) {
      let apiParameters = [];
      for (let i = 0; i < selectedRows.length; i++) {
        apiParameters.push(selectedRows[i].bno)
      }
      setSelectedRowKeys([]);
      setSelectedRows([]);
      console.log("apiParameters",apiParameters)
      axios.put("/api/bill/delete", apiParameters, {
        headers: {
          "Authorization": token,
        },
      }).then((response) => {
        custom.fire( {icon: 'success',html: 'sam 파일 삭제가 완료되었습니다.'});
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
      return false;
    }
    return selectedRows.length > 0 && !selectedRows.every((item) => item.bstatus === status);
  };

  const custom = Swal.mixin({
    confirmButtonText: '확인',
    confirmButtonColor: '#3085d6',
  })
  
  return (
    <div>
      <Card className="Bill">
      <h4>청구서 검색</h4>
      <br />
      <Row>
        <Col>
          <Space direction="horizontal" size={12}>
            <DatePicker picker="month" onChange={selectDate} />
            <Select
              size={size}
              onChange={setInsuranceOption}
              style={{
                width: 200,
              }}
              placeholder="보험 유형을 선택해주세요"
              options={insuranceOptions}
            />
            <Select
              size={size}
              placeholder="상태를 선택해주세요"
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
      </Card>
      <Card className="Bill">
      <h4>청구서 조회</h4>
      <br />
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button>
        <span style={{marginLeft: 8}}>
          {hasSelected ? ` ${selectedRowKeys.length} 개의 항목이 선택되었습니다.` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} className="BillTable" />
      <Space direction="horizontal" size={12}>
      <Button danger onClick={cancel} disabled={checkButtonDisabled('변환')}>송신 취소</Button>
      <Button type="primary" ghost onClick={send} disabled={checkButtonDisabled('미송신')}> 송신 변환 </Button>
      </Space>
      </Card>
    </div>
  );
}
export default Bill;

import { Table, DatePicker, Space, Button, Select, Row, Col,Card  } from "antd";
import axios from 'axios'
import { useEffect, useRef, useState } from "react";
import '../../assets/styles/InsertManual.css';
import Swal from "sweetalert2";

function InsertManual(props) {
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
  const options = [{ value: '미선택', labe: '미선택' },{ value: '건강보험', labe: '건강보험' }, { value: '의료급여', labe: '의료급여' }];
  const { RangePicker } = DatePicker;
  const [date, setDate] = useState('');
  const [insurance, setInsurance] = useState();
  const [size, setSize] = useState('middle');

  const columns = [
    {
      title: '환자명',
      dataIndex: 'pname',
      key: 'pname',
      align: 'center'
    },
    {
      title: '나이',
      dataIndex: 'age',
      key: 'age',
      align: 'center'
    },
    {
      title: '성별',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center'
    },
    {
      title: '보험유형',
      dataIndex: 'insurance',
      key: 'insurance',
      align: 'center'
    },
    {
      title: '진료기간',
      dataIndex: 'rdate',
      key: 'rdate',
      align: 'center'
    },
    {
      title: '본인부담금',
      dataIndex: 'fprice',
      key: 'fprice',
      align: 'center',
      render: (text) => `${text} 원`
    },
    {
      title: '청구금액',
      dataIndex: 'totalprice',
      key: 'totalprice',
      align: 'center',
      render: (text) => `${text} 원`
    },
    {
      title: '초진여부',
      dataIndex: 'visit',
      key: 'visit',
      align: 'center'
    }, {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      align: 'center'
    }
  ];

  let [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const selectDate = (value, dateString) => {
    setDate(dateString);
  }
  const handleChange = (value) => {
    setInsurance(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}년 ${month}월 ${day}일`;
  };

  const formatGender = (gender) =>{
   return gender === 'm'? '남' : gender ==='f' ?'여' :  ''
  }
  const formatVisited = (isVisited) =>{
    return isVisited ==='Y' ? '재진' : isVisited ==='N' ? '초진' : ''
  }
  
  const search = () => {
    const param = { startDate: date[0], endDate: date[1], insurance: insurance };
    axios
      .get("/api/receipt/insertManual", { headers: { "Authorization": token }, params: param })
      .then((response) => {
        if (!isMountedRef.current) {
          return;
        }
        const data = response.data.data;
        console.log("data",data)
        if (data.length === 0) {
          setDataSource(data);
          custom.fire( {icon: 'info',html: '데이터가 존재하지 않습니다.'});
        } else {
          const result = data.map((item, index) => ({
            ...item,
            key: index,
            rdate: formatDate(item.rdate),
            gender: formatGender(item.gender),
            visit: formatVisited(item.visit),
            fprice: item.fprice.toLocaleString(),
            totalprice: item.totalprice.toLocaleString(),
          })); 
          setDataSource(result);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const apiParam = () => {
    if (selectedRows.length > 0) {
      let apiParameters = [];
      let copy = selectedRows;
      setSelectedRows('');
      setSelectedRowKeys('');

      const result = dataSource.filter(data => !copy.some(apry => data.key === apry.key));
      setDataSource(result)
      for (let i = 0; i < copy.length; i++) {
        apiParameters.push([copy[i].rno, copy[i].pno])
      }
      console.log("selectedRows",selectedRows)
      console.log("apiParameters",apiParameters)
      axios.post("/api/bill/manualInsert", apiParameters, {
        headers: {
          "Authorization": token,
        },
      })
        .then((response) => {
          custom.fire( {icon: 'success' ,html: '수동생성이 완료되었습니다.'});
        }).catch((e) => {
          console.log("error", e);
          custom.fire( {icon: 'error' ,html: '올바르지 않은 요청입니다. 다시 시도해 주시기 바랍니다.'});
          setDataSource(copy);
        });
    }
  }
  const custom = Swal.mixin({
    confirmButtonText: '확인',
    confirmButtonColor: '#3085d6',
  })
  
  return (
    <div>
       <Card className="insertManual">
      <h4 style={{ marginTop: 16 }}> 진료 검색 </h4>
      <br></br>
      <Row>
        <Col>
          <Space direction="horizontal" size={12}>
            <RangePicker onChange={selectDate} />
            <Select
              size={size}
              onChange={handleChange}
              style={{ width: 200 }}
              options={options}
              placeholder="보험 유형을 선택해 주세요"
            />
            <Button type="primary" ghost onClick={search}>검색</Button>
          </Space>
        </Col>
      </Row>
      <br />
      </Card>
      <Card className="insertManual">
      <h4> 진료 조회 </h4>
      <br />
      <div style={{ marginBottom: 30 }}>
        <div
          style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
            체크해제
          </Button>
          <span
            style={{ marginLeft: 8 }}>
            {hasSelected ? ` ${selectedRowKeys.length} 개의 항목이 선택되었습니다.` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} className="insertManualTable"/>
      </div>
      <Button type="primary" ghost onClick={apiParam} disabled={!hasSelected}>수동생성</Button>
      </Card>
    </div>
  );
}
export default InsertManual;

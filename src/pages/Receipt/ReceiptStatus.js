import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,   // 여러 테이블을 Card 느낌으로 임포트해서 구성할 것이다.
  Radio,  // 
  Table,  // 테이블
  Button,
  Select,
  Alert,
} from "antd";
// 아이콘 임포트  
import '../../assets/styles/Receipt.css';
const { Option } = Select;

function ReceiptStatus(props) {
  // 에러 창 alert
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  // 완료 창 alert
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // error 문구 state
  const [errorDescription, setErrorDescription] = useState(``);
  // success 문구 state
  const [successDescription, setSuccessDescription] = useState(``);

  const [caring, setCaring] = useState([]);

  const receiptColumn = [
    {
      title: 'no',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => (currentReceiptPage - 1) * 5 + index + 1,
    },
    {
      title: "환자명",
      dataIndex: "pname",
      key: "pname"
    },
    {
      title: "접수시간",
      dataIndex: "rdate",
      key: "rdate"
    },
    {
      title: "증상",
      dataIndex: "rcondition",
      key: "rcondition",
      ellipsis: true,
    },
    {
      title: "초진/재진",
      dataIndex: "visit",
      key: "visit"
    },
    {
      title: "수납여부",
      dataIndex: "pay",
      key: "pay"
    },
    {
      title: '상태변경',
      dataIndex: 'statusbox',
      key: 'statusbox',
      render: (text, record) => (
        <Select
          value={record.status} onChange={(value) => {
            handleDropboxStatusChange(value, record);
          }}
          style={{ width: '77px' }}
        >
          <Option value="접수">접수  </Option>
          <Option value="진료중">진료중</Option>
          <Option value="수납대기">수납대기</Option>
          <Option value="완료">완료</Option>
        </Select>
      ),
    },
    {
      title: "취소",
      dataIndex: "cancel",
      key: "cancel",
      render: (text, record) => (
        <Button danger onClick={() => { cancelReceipt(record) }}>취소</Button>
      )
    },
  ]
  const allColumn = [
    {
      title: 'no',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => (currentReceiptPage - 1) * 5 + index + 1,
    },
    {
      title: "환자명",
      dataIndex: "pname",
      key: "pname"
    },
    {
      title: "접수시간",
      dataIndex: "rdate",
      key: "rdate"
    },
    {
      title: "증상",
      dataIndex: "rcondition",
      key: "rcondition",
      ellipsis: true,
    },
    {
      title: "초진/재진",
      dataIndex: "visit",
      key: "visit"
    },
    {
      title: "수납여부",
      dataIndex: "pay",
      key: "pay"
    },
    {
      title: '상태변경',
      dataIndex: 'statusbox',
      key: 'statusbox',
      // sorter: (a, b) => a.status.localeCompare(b.status),
      render: (text, record) => (
        <Select
          // style={{ width: '96px'} }
          value={record.status}
          onChange={(value) => {
            handleDropboxStatusChange(value, record);
          }} >
          <Option value="접수">접수</Option>
          <Option value="진료중">진료중</Option>
          <Option value="수납대기">수납대기</Option>
          <Option value="완료">완료</Option>
        </Select>
      ),
    },
  ]
  const onChange = (e) => props.setStatus(e.target.value);
  const [currentReceiptPage, setCurrentReceiptPage] = useState(1);
  useEffect(() => {
    props.fetchReceiptData(props.status);
  }, [props.status, currentReceiptPage]);
  useEffect(() => {
    props.setReceiptData(props.receiptData);
  }, [props.receiptData, currentReceiptPage]);

  useEffect(() => {
    props.fetchReceiptData();
  }, [currentReceiptPage])



  const cancelReceipt = (record) => {
    axios.delete(`/api/receipt/${record.rno}`, {

      headers: {
        "Authorization": props.token
      },
    })
      .then(() => {
        alert("접수가 취소되었습니다");
        props.fetchReceiptData(props.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // 진료중인 환자가 있는지 없는지 가져오는 함수
  
  const fetchCaringData = () => {
    axios.get('/api/receipt/status', {
        headers: {
            "Authorization": props.token
        },
        params: {
          status: "진료중"
        }
    })
        .then((response) => {
            const copy = [...response.data.data];
            setCaring(copy);
            console.log("진료중환자", response.data.data);
            
        })
        .catch((error) => {
            console.log(error);
        });
}


  const handleDropboxStatusChange = (value, record) => {
    // 나중에 이거 지워야함.
    fetchCaringData(); 
    
    setShowErrorAlert(false);
    setShowSuccessAlert(false); 

    setErrorDescription(` ${record.status}에서 ${value} 상태로는 변경할 수 없습니다.`);
    setSuccessDescription(` ${record.status}에서 ${value} 상태로 변경되었습니다!`);
    if (value === "수납대기") {
      if (record.status === "진료중") {
        changeStatus(value, record);
      } else {
        setShowErrorAlert(true);
      }
    }

    else if (value === "진료중") {
      if (record.status === "접수" || record.status === "수납대기") {
        console.log("caring", caring);
        if(caring == 0 ){ 
          changeStatus(value, record);
        }else{
          setShowErrorAlert(true);  
        }
      } else {
        setShowErrorAlert(true);

      }
    }
    else if (value === "접수") {
      if (record.status === "진료중") {
        changeStatus(value, record);
      } else {
        setShowErrorAlert(true);
      }
    } 
    else {
      setShowErrorAlert(true);
    }

  }
  const changeStatus = (value, record) => {
    //console.log("value:", value);
    //console.log("record.status", record.status);
    axios.put(`/api/receipt/${record.rno}/${value}`, {}, {
      headers: {
        "Authorization": props.token
      },
    })
      .then((response) => {
        props.fetchReceiptData(props.status);
        props.fetchFeeTableData();
        setSuccessDescription(` ${record.status}에서 ${value} 상태로 변경되었습니다!`);
        setShowSuccessAlert(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 테이블 컬럼 바꿀 때 너무 빨리 바뀌어져서 설정함.
  const [renderedColumns, setRenderedColumns] = useState([]);
  useEffect(() => {
    const columns = props.status === '접수' ? receiptColumn : allColumn;
    setRenderedColumns(columns);
  }, [props.receiptData]);

  return (
    <>
      {/* 접수현황 테이블*/}
      <Card
        bordered={true} // 일단 true 
        title={props.status}
        extra={
           
          <Radio.Group onClick={props.fetchReceiptData} onChange={onChange} defaultValue="전체">
            <Radio.Button value="전체">전체</Radio.Button>
            <Radio.Button value="접수">접수</Radio.Button>
            <Radio.Button value="진료중">진료중</Radio.Button>
            <Radio.Button value="수납대기">수납대기</Radio.Button>
            <Radio.Button value="완료">완료</Radio.Button>
          </Radio.Group>
        } 
      >
{/* <Segmented options={['전체', '접수', '진료중', '수납대기', '완료']}  /> */}
        {showErrorAlert && (
          <Alert
            message="Error"
            description={errorDescription}
            type="error"
            showIcon
            closable
          />)}

        {showSuccessAlert && (
          <Alert
            message="Success"
            description={successDescription}
            type="success"
            showIcon
            closable
          />)}



        <div>
          <Table
            className="tablecss"
            columns={renderedColumns}
            style={{ width: "110%" }}
            dataSource={props.receiptData}
            pagination={{
              pageSize: 5,
              current: currentReceiptPage,
              onChange: (page) => setCurrentReceiptPage(page),
            }}
          />
        </div>

      </Card>


    </>
  )
}

export default ReceiptStatus; 
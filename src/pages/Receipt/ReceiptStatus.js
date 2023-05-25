import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Radio, Table, Button, Select, Alert, } from "antd";
import '../../assets/styles/Receipt.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Swal from 'sweetalert2'
const { Option } = Select;

function ReceiptStatus(props) {
  // 드롭다운 스타일
  const dropdownStyle = {
    borderRadius: '10px',
  };
  // 에러 창 alert
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  // 완료 창 alert
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  // error 문구 state
  const [errorDescription, setErrorDescription] = useState();
  // success 문구 state
  const [successDescription, setSuccessDescription] = useState();
  const [currentReceiptPage, setCurrentReceiptPage] = useState(1);
  const receiptColumn = [
    {
      title: 'no', dataIndex: 'index', key: 'index', align: 'center', width: '70px',
      // render: (text, record, index) => (currentReceiptPage - 1) * 5 + index + 1
    },
    { title: "환자명", dataIndex: "pname", key: "pname", align: 'center' },
    { title: "접수시간", dataIndex: "rdate", key: "rdate", align: 'center' },
    { title: "증상", dataIndex: "rcondition", key: "rcondition", ellipsis: true, align: 'center' },
    { title: "초진/재진", dataIndex: "visit", key: "visit", align: 'center' },
    { title: "수납여부", dataIndex: "pay", key: "pay", align: 'center' },
    {
      title: '상태변경', dataIndex: 'statusbox', key: 'statusbox', width: '120px',
      render: (text, record) => (
        <Select
          className="dropStyle" dropdownStyle={dropdownStyle}
          value={record.status} onChange={(value) => { handleDropboxStatusChange(value, record); }}
          style={{ align: 'left', alignItems: 'center', display: 'flex', width: '77px' }}
        >
          <Option value="접수">접수  </Option> 
          <Option value="진료중">진료중</Option>
          <Option value="수납대기">수납대기</Option>
          <Option value="완료">완료</Option>
        </Select>
      )
    },
    {
      title: "취소", dataIndex: "cancel", key: "cancel", align: 'center',
      render: (text, record) => (<Button className="roundShape" danger onClick={() => { cancelReceipt(record) }}>취소</Button>)
    }
  ]
  const allColumn = [
    { title: 'no', dataIndex: 'index', key: 'index', align: 'center', width: '70px',
      // render: (text, record, index) => (currentReceiptPage - 1) * 5 + index + 1
    },
    { title: "환자명", dataIndex: "pname", key: "pname", align: 'center' },
    { title: "접수시간", dataIndex: "rdate", key: "rdate", align: 'center' },
    { title: "증상", dataIndex: "rcondition", key: "rcondition", ellipsis: true, align: 'center' },
    { title: "초진/재진", dataIndex: "visit", key: "visit", align: 'center' },
    { title: "수납여부", dataIndex: "pay", key: "pay", align: 'center' },
    { title: '상태변경', dataIndex: 'statusbox', key: 'statusbox',
      // sorter: (a, b) => a.status.localeCompare(b.status), 
      render: (text, record) => (
        <Select
          className="dropStyle"
          dropdownStyle={dropdownStyle}
          value={record.status}
          style={{ borderRadius: '10px', width: '95px' }}
          onChange={(value) => { handleDropboxStatusChange(value, record); }} >
          <Option value="접수">접수</Option> 
          <Option value="진료중">진료중</Option>
          <Option value="수납대기">수납대기</Option>
          <Option value="완료">완료</Option>
        </Select>
      )
    },
  ]
  const [changeStatusQuestion, setChangeStatusQuesetion] = useState();
  const onChange = (e) => props.setStatus(e.target.value);
  // useEffect(() => {
  //   props.fetchReceiptData(props.status);
  // }, [props.status, currentReceiptPage]);


  // 넣을 이유가 없음
  // useEffect(() => {
  //   props.setReceiptData(props.receiptData);
  // }, [props.receiptData, currentReceiptPage]);
  

  // // 페이지 변할 때 마다, fetch >> 이것도 필요없음
  // useEffect(() => {
  //   props.fetchReceiptData();
  // }, [currentReceiptPage])

// 페이지네이션 초기화
  useEffect(() => {
    setCurrentReceiptPage(1);
  }, [props.status])


  const cancelReceipt = (record) => {
    axios.delete(`/api/receipt/${record.rno}`, {
      headers: {
        "Authorization": props.token
      },
    })
      .then(() => {
        alert("접수가 취소되었습니다");
        props.fetchReceiptData(props.status);
        props.resetAllCount();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // 진료중인 환자가 있는지 여부
  const fetchCaringData = () => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/receipt/status', {
          headers: {
            "Authorization": props.token
          },
          params: {
            status: "진료중"
          }
        })
        .then((response) => {
          console.log("caringData:", response.data.data);
          console.log("caringData's Length: ", response.data.data.length);
          resolve(response.data.data.length);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
  const handleDropboxStatusChange = (value, record) => {
    // 나중에 이거 지워야함.
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
    setChangeStatusQuesetion(`${record.pname}님의 상태를 ${record.status}에서 ${value} 변경하시겠습니까?`);
    setErrorDescription(` ${record.status}에서 ${value} 상태로는 변경할 수 없습니다.`);
    setSuccessDescription(` ${record.status}에서 ${value} 상태로 변경되었습니다!`);
    statusChangeAlert(value, record);
  }

      const connectWebSocket = (pname) => {
        const socket = new SockJS('/websocket');
        const stompClient = Stomp.over(socket);
      
        stompClient.connect({}, () => {
          console.log('Connected to WebSocket');
      
          const message = pname; // 보낼 메시지
          stompClient.send('/app/sendMessage', {}, message);
          console.log('Message sent: ' + message);
      
         // stompClient.disconnect();
          console.log('Disconnected from WebSocket');
        });
      };

  const changeStatus = (value, record) => {
    //console.log("value:", value);
    //console.log("record.status", record.status);
    axios.put(`/api/receipt/${record.rno}/${value}`, {}, {
      headers: {
        "Authorization": props.token
      },
    })
      .then((response) => {
        console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ")
        props.fetchReceiptData(props.status);
        
        if(value === "수납대기"){
        props.fetchFeeTableData();
        }
        setSuccessDescription(`${record.status}에서 ${value} 상태로 변경되었습니다!`);
        props.resetAllCount();
        connectWebSocket(record.pname)
        // setShowSuccessAlert(true);
        Swal.fire(
          '변경 완료 되었습니다.',
          { successDescription },
          '성공'
        )
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


  const statusChangeAlert = (value, record) => {
    return Swal.fire({
      title: '환자의 상태를 변경하시겠습니까?',         // `${changeStatusQuestion}`,
      text: " ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', 
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        if (value === "진료중") {
          if (record.status === "접수" || record.status === "수납대기") { // 이거 짤라야겠는데???
            fetchCaringData()
              .then((dataLength) => {
                if (dataLength === 0) {
                  changeStatus(value, record);
                } else {
                  Swal.fire(
                    '변경할 수 없습니다.',
                    // {successDescription}, 
                    'error: 진료중인 환자가 있습니다.'
                  )
                }
              });
          } else {
            Swal.fire(
              '변경할 수 없습니다.',
              // {successDescription},
              'error: 두 단계 이전/후로 변경할 수 없습니다.'
            )
          }
        }
        else if (value === "접수") {
          if (record.status === "진료중") {
            changeStatus(value, record);
          } else {
            Swal.fire(
              '변경할 수 없습니다.',
              // {successDescription}, 
              '실패'
            )
          }
        }
        else if (value === '수납대기'){
          if(record.status === "진료중"){
            Swal.fire(
              '변경할 수 없습니다.',
              // {successDescription},
              'error: 진료중인 환자를 수납대기 상태로 변경하실 수 없습니다.'
            )
          }
        }
        else {
          Swal.fire(
            '변경 할 수 없습니다.',
            // {successDescription},
            'error: 두 단계 이전/후로 변경할 수 없습니다.'
          )
        }
      }
    });
  };
  return (
    <>
      {/* 접수현황 테이블*/}
      <Card
        className='card'
        bordered={true} // 일단 true 
        headStyle={{ fontWeight: 'bold', fontSize: 21 }}
        title={props.status}
        extra={
          <Radio.Group onClick={props.fetchReceiptData} onChange={onChange} defaultValue="전체">
            <Radio.Button 
              style={{ width: '90px',  height: '40px', textAlign: 'center', padding: '5px'  }} 
              value="전체" >전체 ({props.totalCount})</Radio.Button>
            <Radio.Button 
              style={{ width: '90px', height: '40px', textAlign: 'center', padding: '5px'  }} 
              value="접수">접수 ({props.receiptCount}) </Radio.Button>
            <Radio.Button 
              style={{ width: '90px', height: '40px', textAlign: 'center', padding: '5px'  }} 
              value="진료중"> 진료중 ({props.careCount}) </Radio.Button>
            <Radio.Button 
              style={{ width: '90px', height: '40px', textAlign: 'center' , padding: '5px'  }} 
              value="수납대기">수납대기 ({props.feeCount}) </Radio.Button>
            <Radio.Button 
              style={{ width: '90px', height: '40px', textAlign: 'center', padding: '5px'  }} 
              value="완료">완료 ({props.completeCount}) </Radio.Button> 
          </Radio.Group>
        }
      >
        {/* 경고창 에러, 확인 */}
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
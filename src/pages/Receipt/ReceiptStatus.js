import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,   // 여러 테이블을 Card 느낌으로 임포트해서 구성할 것이다.
  Radio,  // 
  Table,  // 테이블
  Button,
  Select,
  Modal,  // 이거 해야함.
} from "antd";
// 아이콘 임포트  
import '../../assets/styles/Receipt.css';
import Q from 'q';
const { Option } = Select;

function ReceiptStatus(props) {
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
      render: (text, record) => (
        <Select
          style={{ width: '95px' }}
          autoFocus={true}
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

  const handleDropboxStatusChange = (value, record) => {
    if (value === "수납대기") {
      if (record.status === "진료중") {
        changeStatus(value, record);
      } else {
        alert("환자 상태의 한 단계 전/후 로만 가능합니다!");
      }
    }

    else if (value === "진료중") {
      if (record.status === "접수" || record.status === "수납대기") {
        changeStatus(value, record);
      } else {
        alert("환자 상태의 한 단계 전/후 로만 가능합니다!");
      }
    }
    else if (value === "접수") {
      if (record.status === "진료중") {
        changeStatus(value, record);
      } else {
        alert("환자 상태의 한 단계 전/후 로만 가능합니다!");
      }
    } else {
      alert("환자 상태의 한 단계 전/후 로만 가능합니다!");
    }

  }

  const changeStatus = (value, record) => {
    // setReceiptData([]);
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
        alert("[알림]:" + record.status + "에서 " + value + " 상태로 변경되었습니다.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 상태 현황에서 드롭다운으로 바꿀 때, 쓸 모달창 관련 변수 및 함수.
  const [showModal, setShowModal] = useState(false);



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
          /* <Segmented options={['전체', '접수', '진료중', '수납대기', '완료']} value={value} onChange={setValue} />*/
          <Radio.Group onClick={props.fetchReceiptData} onChange={onChange} defaultValue="전체">
            <Radio.Button value="전체">전체</Radio.Button>
            <Radio.Button value="접수">접수</Radio.Button>
            <Radio.Button value="진료중">진료중</Radio.Button>
            <Radio.Button value="수납대기">수납대기</Radio.Button>
            <Radio.Button value="완료">완료</Radio.Button>
          </Radio.Group>
        }
      >


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
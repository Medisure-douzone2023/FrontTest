import { useState, useEffect } from 'react';
import {
  Card,   // 여러 테이블을 Card 느낌으로 임포트해서 구성할 것이다.
  Radio,  // 
  Table,  // 테이블

} from "antd";
// 아이콘 임포트  
import '../../assets/styles/Receipt.css';


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
      key: "rcondition"
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
    { // 이부분 이렇게 하는게 의미가 없다. >>> 없는데 나중에 확인. (토글버튼 만들면서 확인.) key값, dataIndex값도 고치기.
      title: "취소", 
      dataIndex: "cancel",
      key: "cancel"
    }
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
      key: "rcondition"
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
    }
  ]

  const onChange = (e) => props.setStatus(e.target.value);

  

  const [currentReceiptPage, setCurrentReceiptPage] = useState(1);
  useEffect(() => {
    props.fetchReceiptData(props.status);
  }, [props.status]);


  return (
    <>
      {/* 접수현황 테이블*/}
      <Card
        bordered={true} // 일단 true 
        title="접수 현황"
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
            columns={props.status == "접수" ? receiptColumn : allColumn}
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
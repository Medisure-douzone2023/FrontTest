import { useState, useEffect } from 'react';
import axios from 'axios'
import {
  Row,    // grid 나누기
  Col,    // grid 나누기
  Card,   // 여러 테이블을 Card 느낌으로 임포트해서 구성할 것이다.
  Radio,  // 
  Table,  // 테이블
  Space,  // 버튼 둥글게(일단은 그 용도로.)
  Input,  // 입력창
  InputNumber, // 나이 입력창
  Button, // 버튼
  Avatar,    // 검색해봐야함.
  Segmented, // 전체,진료,수납 토글 용도.
  Typography, // 검색해봐야함.
  Modal,
  Form,
  Descriptions// 환자상세, 기타 모달창에 쓰려고.
} from "antd";
// 아이콘 임포트 
import { SearchOutlined, } from "@ant-design/icons";
import '../../assets/styles/Receipt.css';
import TextArea from 'antd/lib/input/TextArea';


function ReceiptStatus(props) {
  const receiptcolumn = [
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

  // const [status, setStatus] = useState('전체');
  const onChange = (e) => props.setStatus(e.target.value);

  // const [receiptData, setReceiptData] = useState([]);

  const [treatmentData, setTreatmentData] = useState([]);

  const [feeTableData, setFeeTableData] = useState([]);


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
        // extra={
        //   /* <Segmented options={['전체', '접수', '진료중', '수납대기', '완료']} value={value} onChange={setValue} />*/
          
        // }
      >
        <div>
          <Radio.Group onClick={props.fetchReceiptData} onChange={onChange} defaultValue="전체">
            <Radio.Button value="전체">전체</Radio.Button>
            <Radio.Button value="접수">접수</Radio.Button>
            <Radio.Button value="진료중">진료중</Radio.Button>
            <Radio.Button value="수납대기">수납대기</Radio.Button>
            <Radio.Button value="완료">완료</Radio.Button>
          </Radio.Group>
          <Table
            className="tablecss"
            columns={receiptcolumn}
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
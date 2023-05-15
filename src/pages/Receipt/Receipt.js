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
import ReceiptStatus from './ReceiptStatus';
import PatientSearch from './PatientSearch';
import FeeList from './FeeList';
// 이건 정확히 먼지 찾아보기 

const { Title } = Typography;

function Receipt(props) {

  let token = props.token;
  








  const [feeTableData, setFeeTableData] = useState([]);
  // 수납 테이블 리스트 데이터 가져오는 함수
  const fetchFeeTableData = () => {

    axios.get('/api/fee/list', {
      headers: {
        "Authorization": props.token
      }
    })
      .then((response) => {
        setFeeTableData(response.data.data);
        console.log("feeTableData", response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }



  const [receiptData, setReceiptData] = useState([]);
  const [status, setStatus] = useState('전체');
  // 환자 상태에 따른, 접수 테이블 데이터 가져오기 
  const fetchReceiptData = (status) => {

    axios.get('/api/receipt/status', {
      headers: {
        "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM4NTM1ODEsImV4cCI6MTY4NDE1MzU4MX0.g_KIAtjrpejmzinNeV7qACDOwciWP66XYrvnddmug1U"
      },
      params: {
        status: status
      }
    })
      .then((response) => {
        setReceiptData(response.data.data);
        console.log("receiptData", receiptData);
      })
      .catch((error) => {
        console.log(error);
      });
  };












  
  return (
    <>

      {/* 1행 검색창 및 환자 목록 리스트 */}
      <Row>
        <Col xs={14} sm={16} md={18} lg={20} xl={24}>
          <PatientSearch token={token} />
        </Col>
      </Row>


      {/* 2행 접수현황 테이블 & 수납 테이블*/}
      <Row gutter={[40, 0]}> {/* 두 테이블 사이 간격 조절 가능... 나머지 오른쪽 패딩은 나중에.*/}
        <Col xs={12} sm={12} md={12} lg={12} xl={12} >
          <ReceiptStatus token={token} 
          status={status}
          setStatus={setStatus}
          receiptData={receiptData}
          fetchReceiptData={fetchReceiptData}
           />
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={12} >
          <FeeList token={token} 
          fetchFeeTableData={fetchFeeTableData} 
          feeTableData={feeTableData}
          

          status={status}
          fetchReceiptData={fetchReceiptData}/>
        </Col>
      </Row>
    </>
  );
}

export default Receipt; 
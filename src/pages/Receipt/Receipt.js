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
        // console.log("feeTableData", response.data.data);
      })
      .catch((error) => {
        // console.log("feeTableData is here : ", feeTableData);
        console.log(error);
      });
  }



  const [receiptData, setReceiptData] = useState([]);
  const [status, setStatus] = useState('전체');
 
 
  useEffect(() => {
    fetchReceiptData();
  }, [status]);
 
   useEffect(() => {
     setReceiptData(receiptData);
   }, [receiptData]);
 
 
  // 환자 상태에 따른, 접수 테이블 데이터 가져오기 
  const fetchReceiptData = async() => {
    // setReceiptData([]);
    await axios.get('/api/receipt/status', {
      headers: {
        "Authorization": props.token
      },
      params: {
        status: status
      }
    })
      .then((response) => {
        response.data.data.map((data) => {
          const date = new Date(data.rdate);
          const localDate = date.toLocaleString().split(".")[3].slice(0, date.toLocaleString().split(".")[3].length-3);
          return data.rdate= localDate;
        }) 
      setReceiptData(response.data.data);
      // console.log("receiptData", receiptData); 
      })
      .catch((error) => { 
        console.log(error);
      });
  };


  return (
    <>

      {/* 1행 검색창 및 환자 목록 리스트 */}
      <Row gutter={[28, 12]}>
        <Col xs={14} sm={16} md={18} lg={21} xl={24}>
          <PatientSearch token={token} 
          status={status}
          receiptData={receiptData} 
          fetchReceiptData={fetchReceiptData} />
        </Col>
      </Row>


      {/* 2행 접수현황 테이블 & 수납 테이블*/}
      <Row gutter={[28, 12]}> {/* 두 테이블 사이 간격 조절 가능... 나머지 오른쪽 패딩은 나중에.*/}
        <Col xs={14} sm={14} md={14} lg={14} xl={14} >
          <ReceiptStatus token={token} 
          status={status}
          setStatus={setStatus}
          receiptData={receiptData}
          setReceiptData={setReceiptData}
          fetchReceiptData={fetchReceiptData}

          fetchFeeTableData={fetchFeeTableData} 
          feeTableData={feeTableData}

           />
        </Col>
 
        <Col xs={10} sm={10} md={10} lg={10} xl={10} >
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
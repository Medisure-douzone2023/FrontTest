import { useState, useEffect } from 'react';
import axios from 'axios'
import { Row, Col } from "antd";
import '../../assets/styles/Receipt.css';
import ReceiptStatus from './ReceiptStatus';
import PatientSearch from './PatientSearch';
import FeeList from './FeeList';

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
  const fetchReceiptData = async () => {
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
          const localDate = date.toLocaleString().split(".")[3].slice(0, date.toLocaleString().split(".")[3].length - 3);
          data.rdate = localDate;

          const visit = data.visit === "y" ? "재진" : "초진";
          data.visit = visit;

          const pay = data.pay === "y" ? "완료" : "미납";
          data.pay = pay;

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
      {/* 1행 - 환자리스트 + 검색창 */}
      <Row gutter={[28, 12]}  >
        <Col xs={14} sm={16} md={18} lg={21} xl={24}>
          <PatientSearch token={token}
            status={status}
            receiptData={receiptData}
            fetchReceiptData={fetchReceiptData} />
        </Col>
      </Row>
      {/* 2행 - 환자상태 테이블 & 수납테이블 */}
      <Row gutter={[16, 0]}  > {/* 두 테이블 사이 간격 조절 */}
        {/* 환자상태 테이블 */}
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
        {/* 수납테이블 */}
        <Col xs={10} sm={10} md={10} lg={10} xl={10} >
          <FeeList token={token}
            fetchFeeTableData={fetchFeeTableData}
            feeTableData={feeTableData}
            status={status}
            fetchReceiptData={fetchReceiptData} />
        </Col>
      </Row>

    </>
  );
}

export default Receipt; 
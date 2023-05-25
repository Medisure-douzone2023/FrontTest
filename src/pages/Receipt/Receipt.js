import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card } from "antd";
import '../../assets/styles/Receipt.css';
import ReceiptStatus from './ReceiptStatus';
import PatientSearch from './PatientSearch';
import FeeList from './FeeList';
import { PieChart, Pie, Sector, Cell, Legend } from 'recharts';
const COLORS = ['#00C49F', '#FFBB28', '#FF8042', 'green'];
function Receipt(props) {
  let token = props.token;

  const [totalCount, setTotalCount] = useState(0);
  const [receiptCount, setReceiptCount] = useState(0);
  const [careCount, setCareCount] = useState(0);
  const [feeCount, setFeeCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  // charts용 데이터 및 디자인

  const chartdata = [
    // { name: '전체', value: totalCount, fill: '#0088FE', },
    { name: '접수', value: receiptCount, fill: '#00C49F', },
    { name: '진료중', value: careCount, fill: '#FFBB28', },
    { name: '수납대기', value: feeCount, fill: '#FF8042', },
    { name: '완료', value: completeCount, fill: 'green', }
  ]; 
  const [feeTableData, setFeeTableData] = useState([]);
  const fetchFeeTableData = () => {
    axios.get('/api/fee/list', {
      headers: {
        "Authorization": props.token
      }
    })
      .then((response) => {
        setFeeTableData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [receiptData, setReceiptData] = useState([]);
  const [status, setStatus] = useState('전체');

  useEffect(() => {
    fetchReceiptData();
  }, [status]);

  useEffect(() => {
    resetAllCount();
  }, []);

  useEffect(() => {
    setReceiptData(receiptData);
  }, [receiptData]);

  const resetAllCount = () => {
    fetchTotalCount();
    fetchReceiptCount();
    fetchCareCount();
    fetchFeeCount();
    fetchCompleteCount();
  };

  const fetchTotalCount = async () => {
    await axios.get('/api/receipt/status', {
      headers: {
        "Authorization": props.token
      },
      params: {
        status: "전체"
      }
    })
      .then((response) => {
        setTotalCount(response.data.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchReceiptCount = async () => {
    await axios.get('/api/receipt/status', {
      headers: {
        "Authorization": props.token
      },
      params: {
        status: "접수"
      }
    })
      .then((response) => {
        setReceiptCount(response.data.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCareCount = async () => {
    await axios.get('/api/receipt/status', {
      headers: {
        "Authorization": props.token
      },
      params: {
        status: "진료중"
      }
    })
      .then((response) => {
        setCareCount(response.data.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchFeeCount = async () => {
    await axios.get('/api/receipt/status', {
      headers: {
        "Authorization": props.token
      },
      params: {
        status: "수납대기"
      }
    })
      .then((response) => {
        setFeeCount(response.data.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCompleteCount = async () => {
    await axios.get('/api/receipt/status', {
      headers: { "Authorization": props.token },
      params: { status: "완료" }
    })
      .then((response) => {
        setCompleteCount(response.data.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchReceiptData = async () => {
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

          const visit = data.visit === "Y" ? "재진" : "초진";
          data.visit = visit;

          const pay = data.pay === "Y" ? "완료" : "미납";
          data.pay = pay;
        });
        setReceiptData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const midAngle = (startAngle + endAngle) / 2;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;  // 차트 더듬이 길이
    const sy = cy + (outerRadius + 10) * sin;  // 차트 더듬이 길이
    const mx = cx + (outerRadius + 21) * cos;  // 차트 더듬이 길이
    const my = cy + (outerRadius + 21) * sin;  // 차트 더듬이 길이  
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    return (
      <g>
        
        {/* 차트 중간에 제목 데이터 출력 코드 */}
        <text x={cx} y={cy} dy={8} textAnchor="middle"  fontSize={24} >
          전체 ({totalCount}건)
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}               // sector 색깔임.
        />

        {/* Sector: 마우스 오버했을 때 차트 외곽에 선으로 나타내는 거 */}
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 7}
          outerRadius={outerRadius + 12}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />

        {/* 작은 구슬 */}
        <circle cx={ex} cy={ey} r={6} fill={fill} stroke="none" /> 

        {/* 위에 짝대기 해서 뜨는 글자 (마우스 오버했을때) */}
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} fontWeight="bolder" fontSize={24} textAnchor={textAnchor} fill="#333">{`${value}건`}</text>
        {/* 회색 작은 퍼센트 글자 */}
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dx={30} dy={22} fontSize={14} textAnchor={textAnchor} fill="#999">
          {`(비율: ${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };
  // label 용 함수 (defaul로 다 데이터 띄우려고 함)

  const renderCustomizedLabel = ({ cx, cy, startAngle, endAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const midAngle = (startAngle + endAngle) / 2;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;        // 숫자 안으로 모이게 할 수 있음 원을 중심으로.
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      // 여기가 5개의 데이터 숫자 다 띄워주는 text, 출력시키고 싶은 데이터 바인딩하면 됨.
      <text x={x} y={y} fill="white" fontWeight="bolder" textAnchor="middle"fontSize={22} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
// 데이터가 없을 경우 차트에 안띄우기 위함
  const filteredData = chartdata.filter((entry) => entry.value !== 0);
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={16} sm={16} md={18} lg={18} xl={16}>
          <PatientSearch
            token={token}
            resetAllCount={resetAllCount}
            status={status}
            receiptData={receiptData}
            fetchReceiptData={fetchReceiptData}
          />
        </Col>
        <Col xs={8} sm={8} md={6} lg={4} xl={8}>
          <Card className='chartcard' title="현황" headStyle={{ fontWeight: 'bold', fontSize: 21, }}>
            <PieChart width={550} height={570}>          // 차트 위치 이동
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={filteredData}// 보여주고 싶은 데이터 넣기
                cx="40%"           // 화면상 x 좌표
                cy="40%"           // 화면상 y 좌표
                innerRadius={60}  // 크기 조정 안쪽원
                outerRadius={130}  // 크기 조정 바깥원
                fill="#5996F8"     // 색상
                dataKey="value"
                onMouseEnter={onPieEnter} // 마우스 올렸을 때 responsive
                isAnimationActive={true}  // 애니메이션
                labelLine={false}         // 더듬이 없애기
                label={renderCustomizedLabel} // 라벨용 (전체 데이터 띄워주기)
              >
                {/* 차트에 색깔 입혀주는 거 */}
                {chartdata.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend iconSize={20} verticalAlign="middle" layout="vertical" align="left" />            
            </PieChart> 
 
          </Card>
        </Col>            
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={14} sm={14} md={14} lg={14} xl={14}>
          <ReceiptStatus
            token={token}
            status={status}
            setStatus={setStatus}
            receiptData={receiptData}
            setReceiptData={setReceiptData}
            fetchReceiptData={fetchReceiptData}
            fetchFeeTableData={fetchFeeTableData}
            feeTableData={feeTableData}
            resetAllCount={resetAllCount}
            totalCount={totalCount}
            receiptCount={receiptCount}
            careCount={careCount}
            feeCount={feeCount}
            completeCount={completeCount}
          />
          
        </Col>
        <Col xs={10} sm={10} md={10} lg={10} xl={10}>
          <FeeList
            token={token}
            resetAllCount={resetAllCount}
            fetchFeeTableData={fetchFeeTableData}
            feeTableData={feeTableData}
            status={status}
            fetchReceiptData={fetchReceiptData}
          />
        </Col>
      </Row>
    </>
  );
}

export default Receipt;

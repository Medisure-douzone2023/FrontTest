
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
  Button, // 버튼
  Avatar,     // 검색해봐야함.
  Segmented, // 전체,진료,수납 토글 용도.
  Typography, // 검색해봐야함.
  Modal,
  Descriptions// 환자상세, 기타 모달창에 쓰려고.
} from "antd";

/*아이콘 임포트*/
import {
  SearchOutlined,
  MenuUnfoldOutlined,
  FontSizeOutlined
} from "@ant-design/icons";
import SizeContext from 'antd/lib/config-provider/SizeContext';
import '../../assets/styles/Receipt.css';
  
 
/*이건 정확히 먼지 찾아보기*/
const { Title } = Typography;
/* 접수 현황 테이블 컬럼 */
const receiptcolumn = [
  {
    title: "접수번호",
    dataIndex: "rno",
    key: "rno"
  },
  {
    title: "환자번호",
    dataIndex: "pno",
    key: "pno"
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

/* 환자 테이블 컬럼 */
const patientcolumn = [
  {
    title: "no",
    dataIndex: "pno",
    key: "pno",
    // width: "32%",
  },
  {
    title: "환자명",
    dataIndex: "pname",
    key: "pname",
  },

  {
    title: "나이",
    key: "age",
    dataIndex: "age",
  },
  {
    title: "생년월일",
    key: "birthdate",
    dataIndex: "birthdate",
  },
  {
    title: "연락처",
    key: "contact",
    dataIndex: "contact",
  },
  {
    title: "성별",
    key: "gender",
    dataIndex: "gender",
  },
  {
    title: "주소",
    key: "address",
    dataIndex: "address",
  },
  {
    title: "보험유형",
    key: "insurance",
    dataIndex: "insurance",
  },
  {
    title: "비고",
    key: "etc",
    dataIndex: "etc",
  },
  /*이것도 덩달아 그냥 쭉 나중에 고치기.*/

  {
    title: "접수",
    key: "receipt",
    dataIndex: "receipt"
  }

];

const patientdata = [
  {
    no: "1",
    pname: "홍길동",
    age: "18",
    birthdate: "19960929",
    contact: "010-1234-1234",
    gender: "남자",
    address: "미국 캘리포니아주",
    insurance: "건강",
    etc: "빠름",

    receipt: (
      <>
        <Button type="primary">접수</Button>
      </>
    )
  }]




const feecolumn = [
  {
    title: "접수번호",
    key: "rno",
    dataIndex: "rno"
  },
  {
    title: "이름",
    key: "pname",
    dataIndex: "pname"
  },
  {
    title: "생년월일",
    key: "birthdate",
    dataIndex: "birthdate"
  },
  {
    title: "수납",
    key: "feee",
    dataIndex: "feee"
  }
]

function Receipt(props) {

  const [pname, setPname] = useState('');

  const [pnameData, setpnameData] = useState([]);

  const [status, setStatus] = useState('전체');
  const onChange = (e) => setStatus(e.target.value);
  const [receiptData, setReceiptData] = useState([]);


  const [patientData, setpatientData] = useState([]);
  const [visible, setVisible] = useState(false);
  const fetchData = async () => {
    const response = await axios.get('/api/patient');
    setpatientData(response.data.data);
    //console.log("patientData", patientData);
    setVisible(true);
  }
  const handleCancel = () => {
    setVisible(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    submitData2();
  }, [status])
  //console.log(status);
  /*이부분은 *모달창 관련* 변수 선언 및 함수 선언 */
  const [isModalOpenPatient, setIsModalOpenPatient] = useState(false);
  const showModalPatient = () => {
    setIsModalOpenPatient(true);
  };
  const patientHandleOk = () => {
    setIsModalOpenPatient(false);
  };

  /*이부분은 환자 이름 입력해서 데이터 가져오기 */
  const submitData = () => {

    axios.get('/api/patient/' + pname, {
      params: {
        pname: pname
      }
    })
      .then((response) => {
        setpnameData(response.data.data);
        //console.log("pnameData", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*환자 상태에 따른, 접수 테이블 데이터 가져오기 */
  const submitData2 = () => {

    axios.get('/api/receipt/status', {
      params: {
        status: status
      }
    })
      .then((response) => {
        setReceiptData(response.data.data);
        // console.log("statusData", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* segmented 값 설정할 때 쓰는 state (일단 생략)*/
  const [value, setValue] = useState('전체');

  return (

    <>
      {/* 검색 창 */}
      <Input
        className="receipt-search"
        placeholder=" 이름 입력 "
        value={pname}
        onChange={(e) => setPname(e.target.value)}
        prefix={<SearchOutlined />} 
      />
      <Space>
        <Button type="primary" onClick={() => { showModalPatient(); submitData(); }} >
          검 색
        </Button>

        {/*환자 상세 검색 Modal */}
        <Modal
          className="modalStyle"
          visible={isModalOpenPatient}
          // onOk={patientHandleOk}
          footer={[
            null,
            null,
            <Button onClick={patientHandleOk} type='primary' >확 인</Button>
          ]}
          width={700}
        >

          <>
            <p>{pnameData.pname}</p>
            <p>{pnameData.age}</p>
            <p>{pnameData.birthdate}</p>
            <p>{pnameData.contact}</p>
            <p>{pnameData.gender}</p>
            <p>{pnameData.address}</p>
            <p>{pnameData.insurance}</p>
            <p>{pnameData.etc}</p>
          </>

          {/* {pnameData.length > 0 && (
            <>
              <p>{pnameData[0].pname}</p>
              <p>{pnameData[0].age}</p>
              <p>{pnameData[0].birthdate}</p>
              <p>{pnameData[0].contact}</p>
              <p>{pnameData[0].gender}</p>
              <p>{pnameData[0].address}</p>
              <p>{pnameData[0].insurance}</p>
              <p>{pnameData[0].etc}</p>
            </>
          )} */}
        </Modal>

        <Button type="primary" danger >
          신규 환자 등록
        </Button>
      </Space>

      {/* 1행 */}
      <Row>
        <Col xs={14} sm={16} md={18} lg={20} xl={24} >
          {/* 환자 목록 리스트 */}
          <Card
            bordered={true} /*있어보여서(미세하게 테두리) 일단 넣었는데 원래 기본 값 false. 나중에 확인.*/
            // className="criclebox tablespace mb-24"
            style={{ marginBottom: 40 }}
          // title="환자 목록 리스트 " //(뺄까???)

          >
            <div style={{ marginBottom: 18, fontWeight: 'lighter', fontSize: 20, textAlign: 'center' }}>환자 목록 리스트 </div>
            <div /* className="table-responsive" */ >
              <Table
                className="tablecss"
                columns={patientcolumn}
                dataSource={patientData}
              // pagination={false}
              // className="ant-border-space"
              />
            </div>

          </Card>
        </Col>
      </Row>

      {/* 2행 */}
      <Row gutter={[40, 0]}> {/* 두 테이블 사이 간격 조절 가능... 나머지 오른쪽 패딩은 나중에.*/}

        <Col xs={12} sm={12} md={12} lg={12} xl={12} >
          {/* 접수현황 테이블*/}
          <Card
            bordered={true} // 일단 true로 
            title="접수 현황"
            extra={
              /* <Segmented options={['전체', '접수', '진료중', '수납대기', '완료']} value={value} onChange={setValue} />*/
              <Radio.Group onClick={submitData2} onChange={onChange} defaultValue="전체">
                <Radio.Button value="전체">전체</Radio.Button>
                <Radio.Button value="접수">접수</Radio.Button>
                <Radio.Button value="진료중">진료중</Radio.Button>
                <Radio.Button value="수납대기">수납대기</Radio.Button>
                <Radio.Button value="완료">완료</Radio.Button>
              </Radio.Group>
            }
          >
            <div /* className="table-responsive" */ >
              <Table
                className="tablecss"
                columns={receiptcolumn}
                dataSource={receiptData}
                pagination={false}
              />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={12} >
          {/* 접수현황 테이블*/}
          <Card
            bordered={true}
            title="수납"
            extra={
              <Button> 처방 내역 </Button>
            }
          >
            <div /* className="table-responsive" */ >

              <Table
                columns={feecolumn}
                className="tablecss"
                // dataSource={data().data[0]}
                pagination={false}
              // className="ant-border-space"
              />
            </div>

          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Receipt; 
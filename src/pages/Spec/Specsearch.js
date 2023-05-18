import { Col,  
  DatePicker, 
  Dropdown, 
  Button, 
  Input, 
  Table, 
  Menu,
  Row,
  Card
} from 'antd';
import { useState, React, useEffect} from 'react';
import axios from 'axios';
import '../../assets/styles/Spec.css';
import Specuser from './Specuser.js'
import SpecModal from './SpecModal';
import Specbilldisease from './Specbilldisease';
import Specbillcare from './Specbillcare'

function Specsearch(props) {
  const [insurance, setInsurance] = useState('건강보험');
  const [pno, setPno] = useState('');
  const [bno, setBno] = useState();
  const [rno, setRno] = useState();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [userno, setUserno] = useState();
  const [username, setUsername] = useState();
  const [gender, setGender] = useState();
  const [age, setAge] = useState();
  const [birthdate, setBirthdate] = useState();
  const [contact, setContact]= useState();
  const [userinsurance, setUserinsurance] = useState();
  const [record, setRecord] = useState();
  
  const [mainsearchValue, setMainsearchValue] = useState('');
  const [subsearchValue, setSubsearchValue] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);

  const [selectionType] = useState('checkbox');
  const [searchData, setSearchData] = useState([null]);
  const [billdiseaseData, setBilldiseaseData] = useState([null]);
  const [billcareData, setBillcareData] = useState([null]);
  const [maincommondata, setMaincommondata] = useState([null]);
  const [subcommondata, setSubcommondata] = useState([null]);
  const { RangePicker } = DatePicker;
  const [status, setStatus] = useState();
  
  let token = localStorage.getItem("accessToken");
  
  // 상태가 미심사인 명세서를 가져온다.(기본 테이블)
  const specificationData = async () => {
    try {
      const response = await axios.get('/api/spec/info', {
        headers:{
          "Authorization": token
        }
        });
        return response.data;
      } catch (error) {
        console.error(error);
      }
    };

  // 검색에 맞는 명세서 조회
  const fetchData = async (startDate, endDate, insurance, pno) => {
    try {
      const response = await axios.get('/api/spec', {
        headers:{
          "Authorization": token
        },
        params: {
          startDate: startDate,
          endDate: endDate,
          insurance: insurance,
          pno: pno
        }
        });
        return response.data;
      } catch (error) {
        console.error(error);
      }
    };

    // 검색한 명세서를 클릭 시 환자 정보, 청구 상병 정보, 청구 진료 정보를 가져온다.
    const diseasecareData = async (bno, pno, rno) => {
      try {
        const response = await axios.get('/api/bill/info', {
          headers:{
              "Authorization": token
          },
          params: {
            bno: bno,
            pno: pno,
            rno: rno
          }
        });
        setBno(bno);
        setRno(rno);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    };

    // 처음 명세서를 모두 불러오기
    const fetchSpecificationData = async () => {
      try {
        const data = await specificationData();
        const specificaiondata = data.data.map((item, i) => ({
          key: i,
          bno: item.bno,
          rno: item.rno,
          pno: item.pno,
          no: <div>{i + 1}</div>,
          name: <div className="author-info">{item.pname}</div>,
          insurance: <div>{item.insurance}</div>,
          status: <div>{item.sstatus}</div>,
          delete: <Button danger ghost size={'middle'} onClick={() => specdeletebutton(item)} >
          삭제
        </Button>
        }));
        setBno(bno);
        setSearchData(specificaiondata);
      } catch (error) {
        console.error(error);
      }
    };

    // 검색으로 명세서 데이터 찾아오기
    const handleSearch = async () => {
      if (!startDate || !endDate) {
        alert("진료기간을 선택해주세요.");
        return;
      }
      try {
        const data = await fetchData(startDate, endDate, insurance, pno);
        const searchData = data.data.map((item, i) => ({
          key: i,
          bno: item.bno,
          rno: item.rno,
          pno: item.pno,
          name: <div className="author-info">{item.pname}</div>,
          insurance: <div>{item.insurance}</div>,
          status: <div className="ant-employed">{item.sstatus}</div>,
          delete: <Button danger ghost size={'middle'} onClick={() => specdeletebutton(item)}>
                삭제
              </Button>
        }));
          if(searchData.length === 0){
            alert("검색 결과가 없습니다.");
            return;
          } else {
            setSearchData(searchData);
          }
      } catch (error) {
        alert("검색 결과가 없습니다.");
      }
    };
    useEffect(() => {
      let isMounted = true;

      const fetchSpecificationData = async () => {
        try {
          const data = await specificationData();
          const specificaiondata = data.data.map((item, i) => ({
            key: i,
            bno: item.bno,
            rno: item.rno,
            pno: item.pno,
            no: <div>{i + 1}</div>,
            name: <div className="author-info">{item.pname}</div>,
            insurance: <div>{item.insurance}</div>,
            status: <div>{item.sstatus}</div>,
            delete: (
              <Button danger ghost size={'middle'} onClick={() => specdeletebutton(item)}>
                삭제
              </Button>
            )
          }));
    
          if (isMounted) {
            setBno(bno);
            setSearchData(specificaiondata);
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      fetchSpecificationData();
    
      return () => {
        isMounted = false;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const specdeletebutton = async (record) =>{
      try {
        await axios.put(`/api/spec/${record.bno}`, {
        rno: record.rno,
        status: "삭제"
    }, {
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    alert("명세서 삭제가 완료되었습니다.");
    if (props.startDate && props.endDate && props.insurance && props.pno) {
      await handleSearch();
    } else {
      await fetchSpecificationData();
    }
  } catch(error) {
    console.error(error);
  }
}
    // 검색기능에서 키값을 통해 건강보험인지 의료급여인지
    const handleMenuClick = (e) => {
      // eslint-disable-next-line eqeqeq
      const key = e.key == 1 ? '건강보험' : '의료급여';
      setInsurance(key);
    };

  // 검색 시 날짜 데이터 포맷
  const handleDateChange = (dates) => {
    if (dates) {
      const start = dates[0]?.format('YYYYMMDD');
      const end = dates[1]?.format('YYYYMMDD');
      setStartDate(start);
      setEndDate(end);
   } 
  };

  // 모달 닫기 열기 확인
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 모달 창 취소 버튼 클릭 시 모달창 안의 내용 초기화
  const diseasehandleCancel = () => {
    setModalOpen(false);
    setMainsearchValue('');
    setSubsearchValue('');
    setMaincommondata([]);
    setSubcommondata([]);
  };

  // 테이블 컬럼
  const searchColumns = [
      {
        title: "이름",
        dataIndex: "name",
        key: "name",
        align: "center",
      },
    
      {
        title: "보험유형",
        key: "insurance",
        dataIndex: "insurance",
        align: "center",
      },
      {
        title: "진행상태",
        key: "status",
        dataIndex: "status",
        align: "center",
      },
      {
        title: "삭제",
        key: "delete",
        dataIndex: "delete",
        align: "center",
      },
    ];
    
    const items = [
      {
        label: '건강보험',
        key: '1'
      },
      {
        label: '의료급여',
        key: '2'
      }
    ];
    
    // 검색된 명세서를 클릭 시 환자 정보 테이블, 명세서 상병 정보, 처방 정보 테이블 관리
    const handleRowClick = async (record) => {
      try{
        setRecord(record);
        setStatus(record.status.props.children);
        const diseasecareDatas = await diseasecareData(record.bno, record.pno, record.rno);
        const diseasecareData1 = diseasecareDatas.data.billdiseaseList.map((item, i) => ({
           key: item.dno,
           bno: record.bno,
           pno: record.pno,
           rno: record.rno,
           dno: item.dno,
           no: <div>{i+1}</div>,
           dmain: <div className="author-info">{item.dmain}</div>,
           dcode: <div>{item.dcode}</div>,
           disease: <div className="ant-employed billdiseasetable" data-content={item.dname}>{item.dname}</div>, 
         }));
         setBilldiseaseData(diseasecareData1);
         
          const userData1 = diseasecareDatas.data.patient
          setUsername(userData1.pname);
          setUserno(userData1.pno);
          // eslint-disable-next-line eqeqeq
          setGender(userData1.gender == "m" ? '남자' : '여자');
          setAge(userData1.age);
          setBirthdate(userData1.birthdate);
          setContact(userData1.contact);
          setUserinsurance(userData1.insurance);
        
         const diseasecareData2 = diseasecareDatas.data.billCareList.map((item, i) => ({
          item: item,
          key : i,
          no : <div key={item.tno}>{i+1}</div>,
          tcode : <div className="author-info">{item.tcode}</div>,
          tname : <div className="ant-employed billdiseasetable" data-content={item.tname}>{item.tname}</div>,
          tprice: <div >{item.tprice}</div>
         }));
         setBillcareData(diseasecareData2);
         disablebutton(record.status.props.children);
        } catch(error){
        console.error(error);
      }
    };

    const disablebutton = (record) =>{
      if (record === "미심사") {
        return false; // 미심사인 경우 버튼 비활성화
      } 
    }

    const menu = (
      <Menu onClick={handleMenuClick}>
        {items.map(item => (
          <Menu.Item key={item.key}>{item.label}</Menu.Item>
        ))}
      </Menu>
    );
   
  return (
    <>
      <Col span={6.5} className='Col1' style={{paddingRight: "0px"}}>
        <Card style={{ width: '100%', height: '100%' }}>
          <span className='span'>진료기간</span><RangePicker className='picker' picker="week" onChange={handleDateChange}></RangePicker><br/><br/>
          <div>
          </div>
          <span className='span'>보험유형</span><Dropdown.Button overlay={menu}>{insurance}</Dropdown.Button><br/><br/>
          <span className='span'>등록번호</span><Input placeholder="등록번호" style={{width: '70%'}} onChange={(e) => setPno(e.target.value)} /><br/><br/>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" ghost block style={{ width: "100%", margin: '0px 0px' }} onClick={handleSearch}>
                조회
            </Button>
          </div>
      <Table    
                columns={searchColumns}
                dataSource={searchData}
                pagination={false}
                className="ant-border-space"
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                })}
              />
        </Card>
    </Col>
    
    <Col span={16} className='Col2'>
    <Card style={{ width: '98%', height: '100%' }}>
      <Specuser
            username={username} 
            userno={userno}
            gender={gender}
            age={age}
            birthdate={birthdate}
            contact={contact}
            userinsurance={userinsurance} />
    <Row>
      <Specbilldisease
              status={status}
              selectionType={selectionType} 
              billdiseaseData={billdiseaseData}
              handleRowClick={handleRowClick}
              disablebutton={disablebutton}
              record={record}
              setModalOpen={setModalOpen}
              diseasehandleCancel={diseasehandleCancel}/>

    <Specbillcare
        status={status}
        bno={bno}
        rno={rno}
        record={record}
        setIsModalOpen={setIsModalOpen}
        billcareData={billcareData}
        handleSearch={handleSearch}
        fetchSpecificationData={fetchSpecificationData}
        startDate={startDate}
        endDate={endDate}
        insurance={insurance}
        pno={pno}
        handleCancel={handleCancel}/>
    </Row>
    </Card>
    </Col>
    <SpecModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleCancel={handleCancel}
        billdiseaseData={billdiseaseData}
        billcareData={billcareData}
        ModalOpen={ModalOpen}
        handleRowClick={handleRowClick}
        diseasehandleCancel={diseasehandleCancel}
        mainsearchValue={mainsearchValue}
        subsearchValue={subsearchValue}
        setMainsearchValue={setMainsearchValue}
        setSubsearchValue={setSubsearchValue}
        selectionType={selectionType}
        maincommondata={maincommondata}
        setMaincommondata={setMaincommondata}
        subcommondata={subcommondata}
        setSubcommondata={setSubcommondata}
        record={record}
        setModalOpen={setModalOpen}
        />
    </>
  );
}

export default Specsearch;
import { Col,  
    DatePicker, 
    Dropdown, 
    Button, 
    Input, 
    Table, 
    Menu,
    Row,
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
            status: <div className="ant-employed">{item.sstatus}</div>,
          }));
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
            no: <div>{i + 1}</div>,
            name: <div className="author-info">{item.pname}</div>,
            insurance: <div>{item.insurance}</div>,
            status: <div className="ant-employed">{item.sstatus}</div>,
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
        fetchSpecificationData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      
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
          title: "no",
          dataIndex: "no",
          key: "no"
        },
        {
          title: "이름",
          dataIndex: "name",
          key: "name",
        },
      
        {
          title: "보험유형",
          key: "insurance",
          dataIndex: "insurance",
        },
        {
          title: "진행상태",
          key: "status",
          dataIndex: "status",
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
      useEffect(() => {
      }, [billdiseaseData]);
      
      // 검색된 명세서를 클릭 시 환자 정보 테이블, 명세서 상병 정보, 처방 정보 테이블 관리
      const handleRowClick = async (record) => {
        try{
          setRecord(record);
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
             disease: <div className="ant-employed" data-content={item.dname}>{item.dname}</div>, 
           }));
           setBilldiseaseData(diseasecareData1);

            const userData1 = diseasecareDatas.data.patient
            setUserno(userData1.pno)
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
            tname : <div>{item.tname}</div>,
            tprice: <div>{item.tprice}</div>
           }));
           setBillcareData(diseasecareData2);
          } catch(error){
          console.error(error);
        }
      };

      const menu = (
        <Menu onClick={handleMenuClick}>
          {items.map(item => (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          ))}
        </Menu>
      );
     
    return (
      <>
        <Col span={6} className='Col1' style={{paddingRight: "0px"}}>
            <span className='span'>진료기간</span><RangePicker className='picker' picker="week" onChange={handleDateChange}></RangePicker><br/><br/>
            <div>
            </div>
            <span className='span'>보험유형</span><Dropdown.Button overlay={menu}>{insurance}</Dropdown.Button><br/><br/>
            <span className='span'>등록번호</span><Input placeholder="등록번호" style={{width: '70%'}} onChange={(e) => setPno(e.target.value)} /><br/><br/>
            <Button type="primary" block style={{width: "90%", margin: '0px 0px'}} onClick={handleSearch}>
                조회
            </Button>
        <Table
                  columns={searchColumns}
                  dataSource={searchData}
                  pagination={false}
                  className="ant-border-space"
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                  })}
                />
      </Col>
      
      <Col span={17} className='Col2'>
        <Specuser 
              userno={userno}
              gender={gender}
              age={age}
              birthdate={birthdate}
              contact={contact}
              userinsurance={userinsurance} />

      <Row>
        <Specbilldisease
                selectionType={selectionType} 
                billdiseaseData={billdiseaseData}
                handleRowClick={handleRowClick}
                record={record}
                setModalOpen={setModalOpen}
                diseasehandleCancel={diseasehandleCancel}/>

      <Specbillcare
          bno={bno}
          rno={rno}
          setIsModalOpen={setIsModalOpen}
          billcareData={billcareData}
          handleSearch={handleSearch}
          fetchSpecificationData={fetchSpecificationData}
          startDate={startDate}
          endDate={endDate}
          insurance={insurance}
          pno={pno}
          handleCancel={handleCancel}
                    />
      </Row>
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
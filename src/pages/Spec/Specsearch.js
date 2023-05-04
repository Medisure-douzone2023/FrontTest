import { Col,  
    DatePicker, 
    Dropdown, 
    Button, 
    Input, 
    Table, 
    Menu,
    Row,
    Descriptions,
    Modal
 } from 'antd';
import { useState, React} from 'react';
import axios from 'axios';
import '../../assets/styles/Spec.css';

function Specsearch(props) {
    const [insurance, setInsurance] = useState('건강보험');
    const [pno, setPno] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [date, setDate] = useState([]);

    const [bbno, setBbno] = useState();
    const [bpno, setBpno] = useState();
    const [brno, setBrno] = useState();

    const [userno, setUserno] = useState();
    const [gender, setGender] = useState();
    const [age, setAge] = useState();
    const [birthdate, setBirthdate] = useState();
    const [contact, setContact]= useState();
    const [userinsurance, setUserinsurance] = useState();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ModalOpen, setModalOpen] = useState(false);
    
    const [selectionType] = useState('checkbox');
    const [searchData, setSearchData] = useState([null]);
    const [billdiseaseData, setBilldiseaseData] = useState([null]);
    const [billcareData, setBillcareData] = useState([null]);

    const [commondata, setCommondata] = useState([null]);
    const { RangePicker } = DatePicker;
    const { Search } = Input;
    

    
      const fetchData = async (startDate, endDate, insurance, pno) => {
        try {
          const response = await axios.get('/api/spec', {
            headers:{
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODMxODk2ODgsImV4cCI6MTY4MzQ4OTY4OH0.SrnWSdk3NLb2Y4XsNbMIr91mmrdTUJ5PPqf04XTI-_w"
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
      const diseasecareData = async (bbno, bpno, brno) => {
        try {
          const response = await axios.get('/api/bill/info', {
            headers:{
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODMxODk2ODgsImV4cCI6MTY4MzQ4OTY4OH0.SrnWSdk3NLb2Y4XsNbMIr91mmrdTUJ5PPqf04XTI-_w"
            },
            params: {
              bno: bbno,
              pno: bpno,
              rno: brno
            }
          });
          return response.data;
        } catch (error) {
          console.error(error);
        }
      };
      const diseaseData = async (keyword) => {
        try {
          const response = await axios.get('/api/common/care', {
            headers:{
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODMxODk2ODgsImV4cCI6MTY4MzQ4OTY4OH0.SrnWSdk3NLb2Y4XsNbMIr91mmrdTUJ5PPqf04XTI-_w"
            },
            params: {
              keyword: keyword,
              gkey: 'DD'
            }
          });
          return response.data;
        } catch (error) {
          console.error(error);
        }
      };

      const handleMenuClick = (e) => {
        const key = e.key == 1 ? '건강보험' : '의료급여';
        setInsurance(key);
      };

      const handleSearch = async () => {
        try {
          const data = await fetchData(startDate, endDate, insurance, pno);
          const searchData = data.data.map((item, i) => ({
            no: <div>{i+1}</div>,
            name: <div className="author-info">{item.pname}</div>,
            insurance: <div>{item.insurance}</div>,
            status: <div className="ant-employed">{item.sstatus}</div>,
          }));
          // searchData 상태 업데이트 또는 다른 작업 수행
          setSearchData(searchData);
          setBbno(data.data[0].bno);
          setBrno(data.data[0].rno);
          setBpno(data.data[0].pno);
        } catch (error) {
          console.error(error);
        }
      };

      const handleDateChange = (dates) => {
        if (dates) {
            const start = dates[0]?.format('YYYYMMDD');
            const end = dates[1]?.format('YYYYMMDD');
            setDate([start, end]);
            setStartDate(start);
            setEndDate(end);
        } else {
            setDate([]);
        }
      };

    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const diseaseModal = () => {
      setModalOpen(true);
    };
    const diseasehandleOk = () => {
      setModalOpen(false);
    };
    const diseasehandleCancel = () => {
      setModalOpen(false);
    };

    const onSearch = async (value) => {
      try{
         const data = await diseaseData(value);
         const commondata = await data.data.map((item, i) => ({
          no: <>{i+1}</>,
          dcode: <>{item.gcode}</>,
          disease: <>{item.codename}</>
         }));
         setCommondata(commondata);
       } catch(error){
         console.error(error);
       }
      diseaseData(value);
    }

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
      const billcareColumns = [
        {
          title: "no",
          dataIndex: "no",
          key: "no"
        },
        {
          title: "처방코드",
          dataIndex: "tcode",
          key: "tcode",
        },
      
        {
          title: "처방명",
          key: "tname",
          dataIndex: "tname",
        },
        {
          title: "처방금액",
          key: "tprice",
          dataIndex: "tprice",
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

      const handleRowClick = async (record) => {
        try{
          const diseasecareDatas = await diseasecareData(bbno, bpno, brno);
          const diseasecareData1 = diseasecareDatas.data.diseases.map((item, i) => ({
            key: i,
             no: <div key={item.dno}>{i+1}</div>,
             dmain: <div className="author-info">{item.dmain}</div>,
             dcode: <div>{item.dcode}</div>,
             disease: <div className="ant-employed">{item.dname}</div>,
           }));
           const userData1 = diseasecareDatas.data.patient
           setUserno(userData1.pno)
           setGender(userData1.gender == "m" ? '남자' : '여자');
           setAge(userData1.age);
           setBirthdate(userData1.birthdate);
           setContact(userData1.contact);
           setUserinsurance(userData1.insurance);
           setBilldiseaseData(diseasecareData1);
           console.log(diseasecareDatas.data)
           const diseasecareData2 = diseasecareDatas.data.treatments.map((item, i) => ({
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
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
        },
        getCheckboxProps: (record) => {
        },
      };
      const diseaseColumns = [
        {
          title: 'no',
          dataIndex: 'no',
        },
        {
          title: '주/부',
          dataIndex: 'dmain',
        },
        {
          title: '상병코드',
          dataIndex: 'dcode',
        },
        {
          title: '상병명',
          dataIndex: 'disease'
        }
      ];
      const diseaseModalColumns = [
        {
          title: 'no',
          dataIndex: 'no',
        },
        {
          title: '상병코드',
          dataIndex: 'dcode',
        },
        {
          title: '상병명',
          dataIndex: 'disease'
        }
      ];
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
      <Descriptions title="환자 정보" className='description'>
        <Descriptions.Item label="환자등록번호">{userno}</Descriptions.Item>
        <Descriptions.Item label="성별">{gender}</Descriptions.Item>
        <Descriptions.Item label="나이">{age}</Descriptions.Item>
        <Descriptions.Item label="주민등록번호">{birthdate}</Descriptions.Item>
        <Descriptions.Item label="전화번호">{contact}</Descriptions.Item>
        <Descriptions.Item label="보험유형">{userinsurance}</Descriptions.Item>
      </Descriptions>
      
      <br/><br/>
      <Row>
      <Col span={12} >선택 명세서의 상병 정보
      <Table 
        style={{width: "95%"}}
        rowSelection={{
          type: selectionType,
           ...rowSelection,
         }}
        columns={diseaseColumns}
        dataSource={billdiseaseData}
        pagination={false}
      /> 
      <Button type="primary" size={'middle'} className='disease-btn'>
            삭제
          </Button>
      <Button type="primary" size={'middle'} onClick={diseaseModal} onCancel={diseasehandleCancel} className='disease-btn'>
            추가
          </Button>
      </Col>
      <Col span={12}>선택 명세서의 처방 정보
      <Table
                  columns={billcareColumns}
                  dataSource={billcareData}
                  pagination={false}
                />
      <Button type="primary" size={'middle'} className='treatment-btn'>
            취소
          </Button>
      <Button type="primary" size={'middle'} className='treatment-btn'>
            완료
          </Button>
      <Button type="primary" size={'middle'} className='treatment-btn' onClick={showModal} onCancel={handleCancel}>
            처방내역
          </Button>
      
      </Col>
      </Row>
      </Col>
      <Modal 
          title="처방 내역" 
          visible={isModalOpen} 
          onOk={handleOk} 
          cancelButtonProps={{ style: { display: 'none' } }} 
          okText="확인"
          className='tmodal'>
        <p className='p'>진단 내역</p>
        <Table 
        columns={diseaseColumns}
        dataSource={billdiseaseData}
        pagination={false}
      /> 
      <p className='p'>처방 내역</p>
      <Table
        columns={billcareColumns}
        dataSource={billcareData}
        pagination={false}
        className='treatment-table'
        />
      </Modal>

      <Modal 
          title="상병추가" 
          visible={ModalOpen} 
          onOk={diseasehandleOk}
          onCancel={diseasehandleCancel}
          okText="추가"
          cancelText="취소"
          className='tmodal'>
        <p className='psearch'>상병
        <Search
        placeholder="input search text"
        onSearch={onSearch}
        className='ant-searchbox'
        style={{
          width: 200,
        }}
        />
        
        </p>
        <Table 
        rowSelection={{
          type: selectionType,
           ...rowSelection,
         }}
        columns={diseaseModalColumns}
        dataSource={commondata}
        pagination={false}
      /> 
      </Modal>
      </>
    );
}

export default Specsearch;
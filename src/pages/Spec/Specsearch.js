import { Col,  
    DatePicker, 
    Dropdown, 
    Button, 
    Input, 
    Table, 
    Menu,
    Row,
    Descriptions,
    Modal,
    Radio
 } from 'antd';
import { useState, React, useEffect} from 'react';
import axios from 'axios';
import '../../assets/styles/Spec.css';

function Specsearch(props) {
    const [insurance, setInsurance] = useState('건강보험');
    const [pno, setPno] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [date, setDate] = useState([]);

    const [userno, setUserno] = useState();
    const [gender, setGender] = useState();
    const [age, setAge] = useState();
    const [birthdate, setBirthdate] = useState();
    const [contact, setContact]= useState();
    const [userinsurance, setUserinsurance] = useState();
    const [record, setRecord] = useState();
    const [selectDatas, setSelectDatas] = useState([]);

    const [nos, setNos] = useState([]);
    const [dmain1, setDmain] = useState({});
    const [searchValue, setSearchValue] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ModalOpen, setModalOpen] = useState(false);

    const [selectionType] = useState('checkbox');
    const [searchData, setSearchData] = useState([null]);
    const [billdiseaseData, setBilldiseaseData] = useState([null]);
    const [billcareData, setBillcareData] = useState([null]);
    const [commondata, setCommondata] = useState([null]);
    const { RangePicker } = DatePicker;
    const { Search } = Input;
    

      // 검색에 맞는 명세서 조회
      const fetchData = async (startDate, endDate, insurance, pno) => {
        try {
          const response = await axios.get('/api/spec', {
            headers:{
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM3MDI4MDQsImV4cCI6MTY4NDAwMjgwNH0.sydph7T5v4Wv_8WZ90G7DWsXP4xYyceMJz37wQ9fFyY"
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
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM3MDI4MDQsImV4cCI6MTY4NDAwMjgwNH0.sydph7T5v4Wv_8WZ90G7DWsXP4xYyceMJz37wQ9fFyY"
            },
            params: {
              bno: bno,
              pno: pno,
              rno: rno
            }
          });
          return response.data;
        } catch (error) {
          console.error(error);
        }
      };

      // 공통코드에서 검색을 통해 상병 & 상병코드 가져오기
      const diseaseData = async (keyword) => {
        try {
          const response = await axios.get('/api/common/care', {
            headers:{
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM3MDI4MDQsImV4cCI6MTY4NDAwMjgwNH0.sydph7T5v4Wv_8WZ90G7DWsXP4xYyceMJz37wQ9fFyY"
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

      //청구 상병 추가 통신
      const billdiseaseadd = async (voList) => {
        try{
          const response = await axios.post('/api/billdisease/adddisease', voList, {
            headers: {
              "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM3MDI4MDQsImV4cCI6MTY4NDAwMjgwNH0.sydph7T5v4Wv_8WZ90G7DWsXP4xYyceMJz37wQ9fFyY",
              "Content-Type": "application/json"
            }
          });
          return response.data;
        } catch(error){
          console.error(error)
        }
      }

      // 청구 상병 삭제 통신
      const billdiseasedelete = async (nos) => {
        try {
          const response = await axios.delete('/api/billdisease/delete', {
            headers: {
              "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM3MDI4MDQsImV4cCI6MTY4NDAwMjgwNH0.sydph7T5v4Wv_8WZ90G7DWsXP4xYyceMJz37wQ9fFyY",
              "Content-Type": "application/json"
            },
            data: nos
          });
          return response.data;
        } catch (error) {
          console.error(error);
        }
      }

      // 검색기능에서 키값을 통해 건강보험인지 의료급여인지
      const handleMenuClick = (e) => {
        const key = e.key == 1 ? '건강보험' : '의료급여';
        setInsurance(key);
      };

      // 검색한 값의 명세서 테이블 정보
      const handleSearch = async () => {
        if (!startDate || !endDate) {
          alert('진료기간을 선택해주세요.');
          return;
        } else if(!pno) {
          alert('환자번호를 입력해주세요.')
          return;
        }
        try {
          const data = await fetchData(startDate, endDate, insurance, pno);
          const searchData = data.data.map((item, i) => ({
            bno: item.bno,
            rno: item.rno,
            pno: item.pno,
            no: <div>{i+1}</div>,
            name: <div className="author-info">{item.pname}</div>,
            insurance: <div>{item.insurance}</div>,
            status: <div className="ant-employed">{item.sstatus}</div>,
          }));
          // searchData 상태 업데이트 또는 다른 작업 수행
            setSearchData(searchData);
        } catch (error) {
          console.error(error);
        }
      };

      // 검색 시 날짜 데이터 포맷
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

      // 주/부 라디오 버튼
      useEffect(() => {
         console.log("effect dmain:", dmain1);
         setDmain(dmain1);
         console.log("최종:", dmain1);
      }, [dmain1]);  
      const handleMainChange = (e, i) => {
        console.log("e:", e, "i :", i);
        setDmain((prevDmain) => ({ ...prevDmain, [i]: e }));
        console.log(dmain1);
      };

    // 모달 닫기 열기 확인
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

    // 청구 상병 모달에서 추가 클릭 시 데이터 변환
    const diseasehandleOk = async () => {
      try {
        console.log(selectDatas);
        await billdiseaseadd(selectDatas);
        await handleRowClick(record);
      } catch (error) {
        console.error(error);
      }
      console.log("받은값:", selectDatas);
      setModalOpen(false);
      setSearchValue('');
      setCommondata([]);
    };

    const diseasehandleCancel = () => {
      setModalOpen(false);
      setSearchValue('');
      setCommondata([]);
    };

    // 삭제 버튼 처리
    const deletebutton = async () => {
      try{
        await billdiseasedelete(nos);
        await handleRowClick(record);
      } catch(error){
        console.log(error);
      }
    };

    // 청구 상병 추가 시 모달 창 정보
    const onSearch = async (value) => {
      try{
         const data = await diseaseData(value);
         const commondata = await data.data.map((item, i) => ({
          key : item.gcode,
          no: <>{i+1}</>,
          dcode: <>{item.gcode}</>,
          disease: <>{item.codename}</>,
          dmain:  
          <Radio.Group onChange={(e) => handleMainChange(e.target.value, item.gcode)} defaultValue={'부'}>
               <Radio.Button value="주" checked={dmain1[item.gcode] === '주'}>주</Radio.Button>
               <Radio.Button value="부" checked={dmain1[item.gcode] === '부'}>부</Radio.Button>
             </Radio.Group>
         }));
         setCommondata(commondata);
       } catch(error){
         console.error(error);
       }
      diseaseData(value);
    }

    // 테이블 컬럼들
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
        },
        {
          title: '주/부',
          dataIndex: 'dmain'
        }
      ];
      useEffect(() => {
        console.log('bill disease data changed:', billdiseaseData);
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
             disease: <div className="ant-employed">{item.dname}</div>, 
           }));
           setBilldiseaseData(diseasecareData1);
           console.log("저장값:", billdiseaseData);

           const userData1 = diseasecareDatas.data.patient
           setUserno(userData1.pno)
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

      // 명세서 상병 데이터에서 선택 된 데이터 정보 삭제할때 사용
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log("선택값:", selectedRows, "선택 키 : " , selectedRowKeys)
          const newSelectDatas = selectedRows.map((row,i) => {
            console.log("row", row);
            const pno = row.pno;
            const rno = row.rno;
            const dno = row.dno;
            return {pno, rno, dno}
          })
          setNos(newSelectDatas)
        }
      };

      // 모달창 상병검색에서 선택 된 데이터 정보
      const diseaserowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          const newSelectDatas = selectedRows.map((row, i) => {
            console.log("row:", row);
            const dcode = row.dcode ? row.dcode.props.children : null;
            const dname = row.disease ? row.disease.props.children : null;
            const key = row.key;
            const currentDmain = dmain1[key] !== undefined ? dmain1[key] : "부";
            console.log("dmain1 키값:", dmain1[key]);
            const dmain = currentDmain === "주" ? "주" : "부";
            const bno = billdiseaseData[0].bno;
            const pno = billdiseaseData[0].pno;
            const rno = billdiseaseData[0].rno;
            return {bno, pno, rno, dmain, dcode, dname };
      });
      const newDmain1 = { ...dmain1 };
      selectedRows.forEach(row => {
        const key = row.key;
        const currentDmain = dmain1[key] !== undefined ? dmain1[key] : "부";
        newDmain1[key] = currentDmain === "주" ? "주" : "부";
    });
      setDmain(newDmain1);
      setSelectDatas(newSelectDatas);
    }
};
     
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
      <Button type="primary" size={'middle'} onClick={deletebutton}className='disease-btn'>
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
          onCancel={handleCancel}
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
        placeholder="상병명 or 상병코드"
        onSearch={onSearch}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className='ant-searchbox'
        style={{
          width: 200,
        }}
        />
        
        </p>
        <Table 
        rowSelection={{
          type: selectionType,
           ...diseaserowSelection,
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
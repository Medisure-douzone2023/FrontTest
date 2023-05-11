import {React, useEffect, useState} from 'react';
import { Input, Table, Modal, Radio } from 'antd';
import axios from 'axios';

function SpecModal(props) {
    const [dmain1, setDmain] = useState({});
    const [selectDatas, setSelectDatas] = useState([]);
    const { Search } = Input;

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

    // 청구 상병 모달에서 추가 클릭 시 데이터 변환
    const diseasehandleOk = async () => {
        try {
          await billdiseaseadd(selectDatas);
          await props.handleRowClick(props.record);
        } catch (error) {
          console.error(error);
        }
        props.setModalOpen(false);
        props.setSearchValue('');
        props.setCommondata([]);
      };

    // 모달 창 취소 버튼 클릭 시 모달창 안의 내용 초기화
    const diseasehandleCancel = () => {
        props.setModalOpen(false);
        props.setSearchValue('');
        props.setCommondata([]);
      };
      const handleOk = () => {
        props.setIsModalOpen(false);
      };

    //모달창 상병검색에서 선택 된 데이터 정보
    const diseaserowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          const newSelectDatas = selectedRows.map((row, i) => {
            const dcode = row.dcode ? row.dcode.props.children : null;
            const dname = row.disease ? row.disease.props.children : null;
            const key = row.key;
            const currentDmain = dmain1[key] !== undefined ? dmain1[key] : "부";
            console.log("dmain 키값: ", dmain1[key])
            const dmain = currentDmain === "주" ? "주" : "부";
            const bno = props.billdiseaseData[0].bno;
            const pno = props.billdiseaseData[0].pno;
            const rno = props.billdiseaseData[0].rno;
            return { bno, pno, rno, dmain, dcode, dname };
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
           props.setCommondata(commondata);
         } catch(error){
           console.error(error);
         }
        diseaseData(value);
      }

      // 주/부 라디오 버튼 dmain 값 저장
      useEffect(() => {
        setDmain(dmain1);
     }, [dmain1]);  
     const handleMainChange = (e, i) => {
       setDmain((prevDmain) => ({ ...prevDmain, [i]: e }));
       console.log(e,i);
     };

     // modal 컬럼
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
    return (
        <>
        <Modal 
          title="처방 내역" 
          visible={props.isModalOpen} 
          onOk={handleOk} 
          cancelButtonProps={{ style: { display: 'none' } }} 
          onCancel={props.handleCancel}
          okText="확인"
          className='tmodal'>
        <p className='p'>진단 내역</p>
        <Table 
        columns={diseaseColumns}
        dataSource={props.billdiseaseData}
        pagination={false}
      /> 
      <p className='p'>처방 내역</p>
      <Table
        columns={billcareColumns}
        dataSource={props.billcareData}
        pagination={false}
        className='treatment-table'
        />
      </Modal>

      <Modal 
          title="상병추가" 
          visible={props.ModalOpen} 
          onOk={diseasehandleOk}
          onCancel={diseasehandleCancel}
          okText="추가"
          cancelText="취소"
          className='tmodal'>
        <p className='psearch'>상병
        <Search
        placeholder="상병명 or 상병코드"
        onSearch={onSearch}
        value={props.searchValue}
        onChange={(e) => props.setSearchValue(e.target.value)}
        className='ant-searchbox'
        style={{
          width: 200,
        }}
        />
        
        </p>
        <Table 
        rowSelection={{
          type: props.selectionType,
           ...diseaserowSelection,
         }}
        columns={diseaseModalColumns}
        dataSource={props.commondata}
        pagination={false}
      /> 
      </Modal>
      </>
    );
}

export default SpecModal;
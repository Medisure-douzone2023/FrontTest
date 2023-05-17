import {React, useState} from 'react';
import { Input, Table, Modal } from 'antd';
import axios from 'axios';

function SpecModal(props) {
    const [mainselectDatas, setMainSelectDatas] = useState([]);
    const [subselectDatas, setSubSelectDatas] = useState([]);
    const [mainSelectedRowKeys, setMainSelectedRowKeys] = useState([]);
    const [subSelectedRowKeys, setSubSelectedRowKeys] = useState([]);
    const { Search } = Input;
    let token = localStorage.getItem("accessToken");

    //청구 상병 추가 통신
    const billdiseaseadd = async (voList) => {
        try{
          const response = await axios.post('/api/billdisease/adddisease', voList, {
            headers: {
              "Authorization": token,
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
                "Authorization": token
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
          const concatdata = mainselectDatas.concat(subselectDatas);
          await billdiseaseadd(concatdata);
          await props.handleRowClick(props.record);
        } catch (error) {
          console.error(error);
        }
        props.setModalOpen(false);
        props.setMainsearchValue('');
        props.setSubsearchValue('');
        props.setMaincommondata([]);
        props.setSubcommondata([]);
        setMainSelectedRowKeys([]);
        setSubSelectedRowKeys([]);
      };

    // 모달 창 취소 버튼 클릭 시 모달창 안의 내용 초기화
    const diseasehandleCancel = () => {
        props.setModalOpen(false);
        props.setMainsearchValue('');
        props.setSubsearchValue('');
        props.setMaincommondata([]);
        props.setSubcommondata([]);
        setMainSelectedRowKeys([]);
        setSubSelectedRowKeys([]);
      };

    const handleOk = () => {
      props.setIsModalOpen(false);
    };

      //모달창 주상병검색에서 선택 된 데이터 정보
      const MaindiseaserowSelection = {
        selectedRowKeys : mainSelectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          const newSelectDatas = selectedRows.map((row, i) => {
          const dcode = row.dcode ? row.dcode.props.children : null;
          const dname = row.disease ? row.disease.props.children : null;
          const bno = props.billdiseaseData[0].bno;
          const pno = props.billdiseaseData[0].pno;
          const rno = props.billdiseaseData[0].rno;
          const dmain = "주"
          return { bno, pno, rno, dmain, dcode, dname };
      },);
      setMainSelectDatas(newSelectDatas);
      setMainSelectedRowKeys(selectedRowKeys);
      }
    };

    //모달창 주상병검색에서 선택 된 데이터 정보
    const SubdiseaserowSelection = {
      selectedRowKeys : subSelectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        const newSelectDatas = selectedRows.map((row, i) => {
          const dcode = row.dcode ? row.dcode.props.children : null;
          const dname = row.disease ? row.disease.props.children : null;
          const bno = props.billdiseaseData[0].bno;
          const pno = props.billdiseaseData[0].pno;
          const rno = props.billdiseaseData[0].rno;
          const dmain = "부"
          return { bno, pno, rno, dmain, dcode, dname };
    },);
    setSubSelectDatas(newSelectDatas);
    setSubSelectedRowKeys(selectedRowKeys);
    }
  };
  
    // 청구 주상병 추가 시 모달 창 정보
    const MainonSearch = async (value) => {
        try{
           const data = await diseaseData(value);
           const commondata = await data.data.map((item, i) => ({
            key : item.gcode,
            no: <>{i+1}</>,
            dcode: <>{item.gcode}</>,
            disease: <>{item.codename}</>,
           }));
           props.setMaincommondata(commondata);
           if(commondata.length === 0){
            alert("검색 결과가 없습니다.")
            return;
           }
         } catch(error){
          console.error(error);
         }
        diseaseData(value);
      }
      // 청구 부상병 추가 시 모달 창 정보
    const SubonSearch = async (value) => {
      try{
         const data = await diseaseData(value);
         const commondata = await data.data.map((item, i) => ({
          key : item.gcode,
          no: <>{i+1}</>,
          dcode: <>{item.gcode}</>,
          disease: <>{item.codename}</>,
         }));
         props.setSubcommondata(commondata);
         console.log("commondata: ", commondata);
         if(commondata.length === 0){
          alert("검색 결과가 없습니다.")
          return;
         }
       } catch(error){
        console.error(error);
       }
      diseaseData(value);
    }

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
        <p className='psearch'>주상병
        <Search
        placeholder="상병명 or 상병코드"
        onSearch={MainonSearch}
        value={props.mainsearchValue}
        onChange={(e) => props.setMainsearchValue(e.target.value)}
        className='ant-searchbox'
        style={{
          width: 200,
        }}
        />
        </p>

        <Table 
        rowSelection={{
          type: props.selectionType,
           ...MaindiseaserowSelection,
         }}
        columns={diseaseModalColumns}
        dataSource={props.maincommondata}
        pagination={{
          pageSize: 5
        }}
        rowKey="key"
      /> 

      <br/><br/>
      <p className='psearch'>부상병
      <Search
        placeholder="상병명 or 상병코드"
        onSearch={SubonSearch}
        value={props.subsearchValue}
        onChange={(e) => props.setSubsearchValue(e.target.value)}
        className='ant-searchbox'
        style={{
          width: 200,
        }}
        />
      </p>
      <Table 
        rowSelection={{
          type: props.selectionType,
           ...SubdiseaserowSelection,
         }}
        columns={diseaseModalColumns}
        dataSource={props.subcommondata}
        pagination={{
          pageSize: 5
        }}
        rowKey="key"
      /> 
      </Modal>
      </>
    );
}

export default SpecModal;
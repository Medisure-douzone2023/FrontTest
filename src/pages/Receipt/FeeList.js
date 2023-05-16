import { useState, useEffect } from 'react';
import axios from 'axios'
import {
    Card,   // 여러 테이블을 Card 느낌으로 임포트해서 구성할 것이다.
    Table,  // 테이블
    Button, // 버튼
    Modal,
} from "antd";
// 아이콘 임포트 
import '../../assets/styles/Receipt.css';


function FeeList(props) {
    useEffect(() => {
        props.fetchFeeTableData();
      }, []);
    // 수납 데이터
    const [feeData, setFeeData] = useState([]);

    // 수납 모달 관련
    const [feeModalVisible, setFeeModalVisible] = useState(false);

    const [currentFeePage, setCurrentFeePage] = useState(1);

    // 수납 테이블 컬럼
    const feeTableColumn = [

        {
            title: 'no',
            dataIndex: '',
            key: 'index',
            render: (text, record, index) => (currentFeePage - 1) * 5 + index + 1,
        },
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
            dataIndex: "feee",
            render: (text, record) => (
                <Button type="primary" danger onClick={() => { fetchFeeData(record); setFeeModalVisible(true); }}>수 납</Button>
            ),
        }
    ]
    // 수납한 환자 수납상태 변경 ('Y')
    const updatePayData = () => {
        axios.put('/api/receipt/updatepay/' + feeData.rno, {}, {
            headers: {
                "Authorization": props.token
            },
        })
            .then(() => {
                // submitData2();
                alert("수납이 완료되었습니다.");      
                setFeeModalVisible(false);
               // console.log("------ 변경전 fee 데이터 확인 ------", props.feeTableData);
                props.fetchFeeTableData(); 
                
                submitFeeData(); // fee 테이블에 데이터 넣기.

                props.fetchReceiptData(props.status);
               // console.log("----- fetctfee 호출됨 ------");
                //console.log("------ 변경후 fee 데이터 확인 ------", props.feeTableData);
            })
            .catch((error) => {
                console.log(error);
            });

    }
    // fee테이블에 데이터 넣기.
    const submitFeeData = () =>{
        
        axios.post('/api/fee/' + feeData.rno, {
            
             fno: null,
             cno: feeData.treatment[0].cno,
             fprice: feeData.fprice,
             totalprice : feeData.totalprice,
             fdate : null,
        }, {
            headers: {
                "Authorization": props.token
            }
        }).then(() => {
            // console.log("submitFeeData", feeData);
        }).catch((error) => {
            console.log(error);
        })
    }

     // 진짜 수납 데이터 가져오는 함수.
     const fetchFeeData = (record) => {
        axios.get('/api/fee/' + record.rno, {
            headers: {
                "Authorization": props.token
            },
        })
            .then((response) => {
                setFeeData(response.data.data);
                
              // console.log("FeeData", feeData);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            {/* 수납모달 */}
            <Modal
                visible={feeModalVisible}
                onCancel={()=> setFeeModalVisible(false)}
                footer={[
                    <Button onClick={() => updatePayData(feeData)}> 수납하기 </Button>,
                    <Button onClick={() => setFeeModalVisible(false)}> 취소 </Button>
                ]}
            >
                <p> 접수 번호 : {feeData.rno}</p>
                <p> 환자 정보 : </p>
                <p> 총 가격 : {feeData.totalprice}</p>
                <p> 처방내역 : </p>
                <p> 가격 : {feeData.fprice}</p>

            </Modal>

            {/* 수납대상자 목록 테이블*/}
            <Card
                title="수납"
            >
                <div>
                    <Table
                        columns={feeTableColumn}
                        className="tablecss"
                        dataSource={props.feeTableData}
                        pagination={{
                            pageSize: 5,
                            current: currentFeePage,
                            onChange: (page) => setCurrentFeePage(page),
                        }}
                        // onRow={(record) => ({
                        //     onDoubleClick: () => { handleFeeRowClick(record) }
                        // })}
                    >
                    </Table>
                    {/* {selectedFeeRow && (
                        <Modal
                            visible={treatmentModalVisible}
                            onCancel={() => setTreatmentModalVisible(false)}
                            onOk={() => setTreatmentModalVisible(false)}
                        >
                            <p>처방내역 </p>
                        </Modal>
                    )} */}
                </div>
            </Card>

        </>
    )
}

export default FeeList; 
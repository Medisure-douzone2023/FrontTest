import { useState, useEffect } from 'react';
import axios from 'axios'
import { Card, Table, Button, Modal } from "antd";
import '../../assets/styles/Receipt.css';
import Swal from 'sweetalert2'

function FeeList(props) {
    useEffect(() => {
        props.fetchFeeTableData(); 
    }, []);
    // 수납 데이터
    const [feeData, setFeeData] = useState([]);
    // 수납 모달 관련
    const [feeModalVisible, setFeeModalVisible] = useState(false);
    // 수납 테이블 페이지네이션
    const [currentFeePage, setCurrentFeePage] = useState(1);
    // 수납 테이블 컬럼
    const feeTableColumn = [
        {title: 'no', dataIndex: '', key: 'index', align: 'center',
        render: (text, record, index) => (currentFeePage - 1) * 5 + index + 1,
        },
        {title: "이름", key: "pname", dataIndex: "pname", align: 'center' },
        {title: "주민등록번호", key: "birthdate", dataIndex: "birthdate", align: 'center' }, 
        {title: "수납", key: "feee", dataIndex: "feee", align: 'center',
            render: (text, record) => (
                <Button type="primary" ghost onClick={() => { fetchFeeData(record); setFeeModalVisible(true); }}>수 납</Button>
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
    const submitFeeData = () => {
        axios.post('/api/fee/' + feeData.rno, {
            fno: null,
            cno: feeData.treatment[0].cno,
            fprice: feeData.fprice,
            totalprice: feeData.totalprice,
            fdate: null,
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
    // 수납 데이터 가져오는 함수.
    const fetchFeeData = (record) => {
        axios.get('/api/fee/' + record.rno, {
            headers: {
                "Authorization": props.token
            },
        })
            .then((response) => {
                setFeeData(response.data.data);
                setFeePname(response.data.data.patient.pname);
                setFeeTreat(response.data.data.treatment[0]);
                console.log("FeeData", feeData);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const [feeTreat, setFeeTreat] = useState({});
    const [feePname, setFeePname] = useState();
    return (
        <>
            {/* 수납모달 */}
            <Modal
                className='modalStyle'
                
                visible={feeModalVisible}
                onCancel={() => setFeeModalVisible(false)}
                footer={[
                    <Button type="primary" ghost onClick={() => updatePayData(feeData)}> 수납하기 </Button>,
                    <Button danger onClick={() => setFeeModalVisible(false)}> 취소 </Button>
                ]}
            >
                <h3>환자 수납</h3>
                <Card style={{height: '150px'}}  className='card'>
                <p> 접수 번호 : {feeData.rno}</p>
                <p> 환자 이름 : {feePname}</p>
            </Card>
            <Card style={{height: '300px'}} className='card'>            
                <p> 처방내역 : </p> 
                <p> 처방코드 {feeTreat.tcode} 처방명: {feeTreat.tname} 가격 : {feeData.fprice} </p>
            </Card>
            <Card style={{height: '80px'}} className='card'> 
            <p> 총 가격 : {feeData.totalprice}</p>
            </Card>
            </Modal>
            {/* 수납대상자 목록 테이블*/}
            <Card
                title="수납" 
                className='card'
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
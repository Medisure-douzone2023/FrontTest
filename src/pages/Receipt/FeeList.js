import { useState, useEffect } from 'react';
import axios from 'axios'
import { Card, Table, Button, Modal, Divider, Descriptions } from "antd";
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
        {
            title: 'no', dataIndex: '', key: 'index', align: 'center',
            render: (text, record, index) => (currentFeePage - 1) * 5 + index + 1,
        },
        { title: "이름", key: "pname", dataIndex: "pname", align: 'center' },
        {
            title: "주민등록번호", key: "birthdate", dataIndex: "birthdate", align: 'center',
            render: (text) => (<span title={text}>{text.length > 8 ? `${text.substring(0, 8)}******` : text}</span>)
        },
        {
            title: "수납", key: "feee", dataIndex: "feee", align: 'center',
            render: (text, record) => (
                <Button className="roundShape" type="primary" ghost onClick={() => { fetchFeeData(record); setFeeModalVisible(true); }}>수 납</Button>
            )
        }
    ]
    // 수납한 환자 수납상태 변경 ('Y')
    const updatePayData = () => {
        return Swal.fire({
            title: '수납하시겠습니까?',         // `${changeStatusQuestion}`,
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put('/api/receipt/updatepay/' + feeData.rno, {}, {
                    headers: {
                        "Authorization": props.token
                    },
                })
                    .then(() => {
                        Swal.fire({
                            title: '수납 완료 되었습니다.',
                            icon: 'warning',
                            message: '성공'
                        })
                        

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
        })
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
            props.resetAllCount();
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
                console.log("response Fee:", response);
                setFeeData(response.data.data);
                setFeePname(response.data.data.patient.pname);
                setFeeTreat(response.data.data.treatment);
                setFeeBirthDate(response.data.data.patient.birthdate);
                setFeeInsurance(response.data.data.patient.insurance);
                setFeeAge(response.data.data.patient.age);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const [feeTreat, setFeeTreat] = useState([]);
    const [feePname, setFeePname] = useState();
    const [feeBirthDate, setFeeBirthDate] = useState();
    const [feeInsurance, setFeeInsurance] = useState();
    const [feeAge, setFeeAge] = useState(); 
    const [feeTotalPrice, setFeeTotalPrice] = useState();
    return (
        <>
            {/* 수납모달 */}
            <Modal
                width={600}
                className='modalStyle'
                visible={feeModalVisible}
                onCancel={() => setFeeModalVisible(false)}
                footer={[
                    <Button className="roundShape" type="primary" ghost onClick={() => updatePayData(feeData)}> 수납하기 </Button>,
                    <Button className="roundShape" danger onClick={() => setFeeModalVisible(false)}> 취소 </Button>
                ]}
            >
                <h2>환자 수납</h2>
                <Divider />
                <h3>환자 정보</h3>
                <br />
                <p> 환자 이름 : {feePname}</p>
                <p> 주민 등록 번호 : {feeBirthDate} </p>
                <p> 접수 번호 :  {feeData.rno}</p>
                <Divider />
                <Descriptions title="처방내역" >
                    <span>처방 코드</span> 
                    <span>처방 이름</span>
                    <span>처방 가격</span>
                    {feeTreat.map((a, i) => (
                        <>
                            <Descriptions.Item>{a.tcode}</Descriptions.Item>
                            <Descriptions.Item>{a.tname}</Descriptions.Item>
                            <Descriptions.Item>{a.tprice}</Descriptions.Item>
                        </>
                    ))}
                </Descriptions>
                <Divider />
                <h3>진료/처방 청구 비용</h3> 
                     <br />
                     <span> 진료 할인/할증 적용 항목 </span><br/>
                     <span> - 보험 : {feeInsurance}</span><br/>
                     <span> - 진료시간 : {feeData.time}</span><br/>
                     <span> - 나이 : {feeAge}</span> 
                     <br></br><br></br>
                    

                     <p>*오전진료: 10%할인 [9시~11시], 야간진료: 10%할증 [오후6시~오전8시]</p>
                     <p>*보험 25% 할인 적용(건강보험 / 의료보험)</p>
                     <p>*7세미만 65세 이상 : 진료비 2000원 할인</p>
                    <Divider />
                        <h3 style={{textAlign : 'right'}}> 총 가격 : {feeData.fprice}</h3>
            </Modal>
            {/* 수납대상자 목록 테이블*/}
            <Card
                title="수납"
                className='card'
                headStyle={{ fontWeight: 'bold', fontSize: 21 }}
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
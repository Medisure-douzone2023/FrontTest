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
    InputNumber, // 나이 입력창
    Button, // 버튼
    Avatar,    // 검색해봐야함.
    Segmented, // 전체,진료,수납 토글 용도.
    Typography, // 검색해봐야함.
    Modal,
    Form,
    Descriptions// 환자상세, 기타 모달창에 쓰려고.
} from "antd";
// 아이콘 임포트 
import { SearchOutlined, } from "@ant-design/icons";
import '../../assets/styles/Receipt.css';
import TextArea from 'antd/lib/input/TextArea';


function FeeList(props) {

    // 수납 데이터
    const [feeData, setFeeData] = useState([]);

    // 수납 모달 관련
    const [feeModalVisible, setFeeModalVisible] = useState(false);

    const [feeTableData, setFeeTableData] = useState([]);

    const [currentFeePage, setCurrentFeePage] = useState(1);

 
    // 수납 테이블 컬럼
    const feeTableColumn = [

        {
            title: 'no',
            dataIndex: '',
            key: 'index',
            render: (text, record, index) => (currentFeePage - 1) * 10 + index + 1,
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
    const updatePayData = (feeData) => {
        console.log("feeData", feeData);
        axios.put('/api/receipt/updatepay/' + feeData.rno, {}, {
            headers: {
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM4NTM1ODEsImV4cCI6MTY4NDE1MzU4MX0.g_KIAtjrpejmzinNeV7qACDOwciWP66XYrvnddmug1U"
            },
        })
            .then(() => {
                // submitData2();
                fetchFeeTableData();
                alert("수납이 완료되었습니다.");
                setFeeModalVisible(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchFeeTableData();
    }, [])

    // 진짜 수납 데이터 가져오는 함수.
    const fetchFeeData = (record) => {
        axios.get('/api/fee/' + record.rno, {
            headers: {
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM4NTM1ODEsImV4cCI6MTY4NDE1MzU4MX0.g_KIAtjrpejmzinNeV7qACDOwciWP66XYrvnddmug1U"
            },
        })
            .then((response) => {
                setFeeData(response.data.data);
                console.log("FeeData", feeData);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    // 수납 테이블 리스트 데이터 가져오는 함수
    const fetchFeeTableData = () => {

        axios.get('/api/fee/list', {
            headers: {
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM4NTM1ODEsImV4cCI6MTY4NDE1MzU4MX0.g_KIAtjrpejmzinNeV7qACDOwciWP66XYrvnddmug1U"
            }
        })
            .then((response) => {
                setFeeTableData(response.data.data);
                console.log("feeTableData", response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchFeeTableData();
      }, [])


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
                <p> 처방내역 :</p>
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
                        dataSource={feeTableData}
                        pagination={{
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
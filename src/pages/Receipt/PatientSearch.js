import { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import {
    Row,    // grid 나누기
    Col,    // grid 나누기
    Card,   // 여러 테이블을 Card 느낌으로 임포트해서 구성할 것이다.
    Table,  // 테이블
    Space,  // 버튼 둥글게(일단은 그 용도로.)
    Input,  // 입력창
    Button, // 버튼
    Modal,
    Form,
} from "antd";
import { SearchOutlined, } from "@ant-design/icons";
import '../../assets/styles/Receipt.css';
import TextArea from 'antd/lib/input/TextArea';
import { useForm } from 'antd/lib/form/Form';

function PatientSearch(props) {
    const [pname, setPname] = useState();
    const [patientData, setPatientData] = useState([]); // 환자 이름으로 검색한 데이터.

    const textAreaRef = useRef(null);   // 증상입력 모달창 TextArea 박스 reset 용도
    const [newPatientForm] = useForm(); // 신규환자등록 모달창 input 박스 reset 용도
    // 환자증상 모달 관련   
    const [conditionModalVisible, setConditionModalVisible] = useState(false);
    const [condition, setCondition] = useState();

    // 환자 리스트 레코드 선택했을 때 + 환자 상세 모달
    const [patientModalVisible, setPatientModalVisible] = useState(false); // 환자상세모달(보이기,안보이기)
    const [selectedPatientRow, setSelectedPatientRow] = useState(null);
    // 환자 리스트에서 클릭했을 때 state 설정시켜주는 함수
    const handlePatientRowClick = (record) => {
        setSelectedPatientRow(record);
       // console.log('selectedPatientRow:', record);
    };

    //페이지넘기기 위한 state
    const [currentPatientPage, setCurrentPatientPage] = useState(1);
      
    /* 환자 테이블 컬럼 */
    const patientcolumn = [
        {
            title: 'no',
            dataIndex: '',
            key: 'index',
            render: (text, record, index) => (currentPatientPage - 1) * 5 + index + 1,
        },

        {
            title: "환자명",
            dataIndex: "pname",
            key: "pname",
        },

        {
            title: "나이",
            key: "age",
            dataIndex: "age",
        },
        {
            title: "생년월일",
            key: "birthdate",
            dataIndex: "birthdate",
        },
        {
            title: "연락처",
            key: "contact",
            dataIndex: "contact",
        },
        {
            title: "성별",
            key: "gender",
            dataIndex: "gender",
        },
        {
            title: "주소", 
            key: "address",
            dataIndex: "address",
        },
        {
            title: "보험유형",
            key: "insurance",
            dataIndex: "insurance",
        },
        {
            title: "비고",
            key: "etc",
            dataIndex: "etc",
        },
        {
            title: "접수",
            key: "receipt",
            dataIndex: "receipt",
            render: (text, record) => (
                <Button type="primary" onClick={() => { setConditionModalVisible(true); }}>접 수</Button>
            ),
        }
    ];


    // 초/재진 여부 관련
    const [visitData, setVisitData] = useState({});

    const fetchVisitData = () => {
       // console.log("패치방문함수 바로 처음에서, selectedPateintRow.pno: ", selectedPatientRow.pno);
        axios.get('/api/receipt/visit',
            {
                params: {
                    pno: selectedPatientRow.pno
                },
                headers: {
                    "Authorization": props.token
                }
            })
            .then((response) => {
               // console.log("response.data.data", response.data.data);
                // setVisitData(response.data.data);
                response.data.data == "" ? insertReceiptData("N") : insertReceiptData("Y");

                //console.log("패치방문데이터 안에서, selectedPateintRow.pno: ", selectedPatientRow.pno);
                // console.log("visitData", visitData);
            })
            .catch((error) => {
                
                
            });
    }
    // 상세 검색에서, [접수하기]
    const insertReceiptData = (visitD) => {
       // console.log(" ===== insertReceiptData 실행 =====")
        axios.post('/api/receipt', {
            rno: null,
            pno: selectedPatientRow.pno,
            rdate: null,
            rcondition: condition,
            status: '접수', 
            visit: visitD,
            pay: 'N',
            iscreated: 'N'
        }, {
            headers: {
                "Authorization": props.token
            }
        })
            .then((response) => {
              //  console.log("insertresponse", response)
                alert("접수 되었습니다.")
                textAreaRef.current.value = '';
                setConditionModalVisible(false);
                props.fetchFeeTableData();
            })
            .catch((error) => {
                console.error("insertReceipt error: ", error);
            });
    }
    // 신규환자등록 모달창 관련
    const [isModalOpenNewPatient, setIsModalOpenNewPatient] = useState(false);
    const showModalNewPatient = () => {
        setIsModalOpenNewPatient(true);
    };
    const newpatientHandleOk = () => {
        alert("신규 등록 되었습니다.");
        setIsModalOpenNewPatient(false);
    };

    // 환자 이름 입력해서 데이터 가져오기 
    const fetchPatientData = () => {
        axios.get(`/api/patient/${pname}`, {
            headers: {
                "Authorization": props.token
            }
        })
            .then((response) => {
                setPatientData(response.data.data);
               // console.log("patientData", response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

 
    // 신규 환자 데이터 insert 하기
    const submitNewPatientData = (values) => {
        axios.post('/api/patient', {
            pno: null,
            ...values
        }, {
            headers: {
                "Authorization": props.token
            }
        }).then(() => {
            newPatientForm.resetFields(); // input 박스 rest
        })
    };

    // 신규환자등록 모달안 layout 배열 
    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };

    return (
        <>
            {/* 검색 창 */}
            <Input
                className="receipt-search"
                style={{ width: 200 }}
                placeholder=" 이름 입력 "
                value={pname}
                onChange={(e) => setPname(e.target.value)}
                prefix={<SearchOutlined />}
            />
            <Space>
                {/*환자 검색 버튼*/}
                <Button type="primary" onClick={() => { fetchPatientData(); }}>
                    검 색
                </Button>
                {/* 신규환자등록 버튼 */}
                <Button type="primary" danger onClick={() => { showModalNewPatient(); }}>
                    신규 환자 등록
                </Button>
                <Modal
                    visible={isModalOpenNewPatient}
                    onCancel={() => setIsModalOpenNewPatient(false)}
                    footer={[
                        null,
                        null,
                    ]}
                    width={700}
                >

                    <Form {...layout} form={newPatientForm} onFinish={submitNewPatientData}>
                        <Form.Item name="pname" label="이름" rules={[{ required: true, },]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="age" label="나이">
                            <Input />
                        </Form.Item>
                        <Form.Item name="birthdate" label="생년월일">
                            <Input />
                        </Form.Item>
                        <Form.Item name="contact" label="연락처">
                            <Input />
                        </Form.Item>
                        <Form.Item name="gender" label="성별">
                            <Input />
                        </Form.Item>
                        <Form.Item name="address" label="주소">
                            <Input />
                        </Form.Item>
                        <Form.Item name="insurance" label="보험유형">
                            <Input />
                        </Form.Item>
                        <Form.Item name="etc" label="비고">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={newpatientHandleOk} type="primary" danger htmlType="submit">
                                신규등록
                            </Button>
                        </Form.Item>
                    </Form>

                </Modal>
            </Space>
            {/* 1행 */}

            {/* 환자리스트 */}
            <Card
                bordered={true}/*있어보여서(미세하게 테두리) 일단 넣었는데 원래 기본 값 false. 나중에 확인.*/
                style={{ marginBottom: 40 }}
            // title="환자리스트 " //(뺄까???)
            >

                <div style={{ marginBottom: 18, fontWeight: 'lighter', fontSize: 20, textAlign: 'center' }}>환자 리스트 </div>
                <div>
                    <Table
                        className="tablecss"
                        columns={patientcolumn}
                        dataSource={patientData}
                        pagination={{
                            pageSize: 5,
                            current: currentPatientPage,
                            onChange: (page) => setCurrentPatientPage(page),
                        }}
                        onRow={(record) => ({
                            onDoubleClick: () => { setPatientModalVisible(true); },
                            onClick: () => { handlePatientRowClick(record) }
                        })}
                    >
                    </Table>
                    {selectedPatientRow && (
                        <Modal
                            visible={patientModalVisible}
                            onCancel={() => setPatientModalVisible(false)}
                            onOk={() => setPatientModalVisible(false)}
                        >
                            <p>이름: {selectedPatientRow.pname}</p>
                            <p>나이: {selectedPatientRow.age}</p>
                            <p>생년월일: {selectedPatientRow.birthdate}</p>
                            <p>연락처: {selectedPatientRow.contact}</p>
                            <p>성별: {selectedPatientRow.gender}</p>
                            <p>주소: {selectedPatientRow.address}</p>
                            <p>보험유형: {selectedPatientRow.insurance}</p>
                            <p>비고: {selectedPatientRow.etc}</p>
                        </Modal>
                    )}
                </div>
            </Card>

            {/* 환자 증상 모달 */}
            <Modal
                visible={conditionModalVisible}
                onCancel={() => setConditionModalVisible(false)}
                footer={[
                    <Button type="primary" danger onClick={fetchVisitData}> 접수 하기 </Button>,
                    <Button onClick={() => { setConditionModalVisible(false); textAreaRef.current.value = ''}}> 취소 </Button>
                ]}

            >
                <h3>증상을 입력하세요</h3>

                <Input.TextArea
                    ref={textAreaRef}
                    onChange={(e) => { setCondition(e.target.value) }}
                    placeholder="환자의 증상을 입력하세요 ..." 
                />
            </Modal>
        </>
    )
}

export default PatientSearch;


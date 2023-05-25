import { React, useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Card, Table, Space, Input, Button, Modal, Form, Select, Divider, Descriptions } from "antd";
import '../../assets/styles/Receipt.css';
import TextArea from 'antd/lib/input/TextArea';
import DaumPostcode from 'react-daum-postcode';
import Swal from 'sweetalert2'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const { Option } = Select;
function PatientSearch(props) {
    const [pname, setPname] = useState([]);
    const [patientData, setPatientData] = useState([]); // 환자 이름으로 검색한 데이터.
    const textAreaRef = useRef(null);   // 증상입력 모달창 TextArea 박스 reset 용도
    const [newPatientForm] = Form.useForm(); // 신규환자등록 모달창 input 박스 reset 용도

    // 환자증상 모달 관련   
    const [conditionModalVisible, setConditionModalVisible] = useState(false);
    const [condition, setCondition] = useState();
    // 환자 리스트 레코드 선택했을 때 + 환자 상세 모달
    const [patientModalVisible, setPatientModalVisible] = useState(false);
    const [selectedPatientRow, setSelectedPatientRow] = useState();
    // 환자 리스트에서 클릭했을 때 state 설정시켜주는 함수
    const handlePatientRowClick = (record) => {
        setSelectedPatientRow(record);
        // console.log('selectedPatientRow:', record);
    };
    //연락처
    // const [contact, setContact] = useState({ contact1: '010', contact2: '', contact3: '' });
    //주민등록번호
    const checkDuplicateBirthdate = (birthdate) => {
        const isDuplicate = patientData.some(
            (patient) => patient.birthdate === birthdate
        );
        return isDuplicate;
    };

    //페이지네이션 state
    const [currentPatientPage, setCurrentPatientPage] = useState(1);
    /* 환자 테이블 컬럼 */
    const patientcolumn = [
        { title: 'no', dataIndex: 'index', key: 'index', align: 'center', width: '50px',
        // render: (text, record, index) => (currentPatientPage - 1) * 5 + index + 1
        },
        { title: "환자명", dataIndex: "pname", key: "pname", align: 'center', width: '80px' },
        { title: "나이", key: "age", dataIndex: "age", align: 'center', width: '59px' },
        { title: "주민등록번호", key: "birthdate", dataIndex: "birthdate", align: 'center', width: '139px',
          render: (text) => (<span title={text}>{text.length > 8 ? `${text.substring(0, 8)}******` : text}</span>)
        },
        { title: "연락처", key: "contact", dataIndex: "contact", align: 'center', width: '139px',
          render: (text) => {
                const visibleDigits = text.substring(0, 4);
                const hiddenDigits = text.substring(4, 8).replace(/\d/g, '*');
                const lastDigits = text.substring(8);
                return <span title={text}>{`${visibleDigits}${hiddenDigits}${lastDigits}`}</span>;
          }
        },
        { title: "성별", key: "gender", dataIndex: "gender", align: 'center', width: '61px' },
        { title: "주소", key: "address", dataIndex: "address", ellipsis: true, align: 'center', width: 'auto' },
        { title: "보험유형", key: "insurance", dataIndex: "insurance", align: 'center', width: 'auto' },
        { title: "비고", key: "etc", dataIndex: "etc", ellipsis: true, align: 'center', width: 'auto' },
        {
            title: "접수", key: "receipt", dataIndex: "receipt", align: 'center', width: 'auto',
            render: (text, record) => (<Button className="roundShape" type="primary" ghost onClick={() => { setConditionModalVisible(true); }}>접 수</Button>),
        }
    ];
    const fetchVisitData = () => {
        // console.log("패치방문함수 바로 처음에서, selectedPateintRow.pno: ", selectedPatientRow.pno);
        return Swal.fire({
            title: '접수하시겠습니까?',         // `${changeStatusQuestion}`,
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
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
                        props.fetchReceiptData(props.status);
                        //console.log("패치방문데이터 안에서, selectedPateintRow.pno: ", selectedPatientRow.pno);
                        // console.log("visitData", visitData);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
    }
    // [접수하기]
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
                Swal.fire({
                    title: '접수 완료 되었습니다.',
                    icon: 'warning',
                    message: '성공'
                })
                props.resetAllCount();
                setCondition();
                textAreaRef.current.value = '';
                setConditionModalVisible(false);
                // props.fetchFeeTableData(props.status);
            })
            .catch((error) => {
                console.error("insertReceipt error: ", error);
            });
    }
    // 신규환자등록 모달창 관련
    const [isModalOpenNewPatient, setIsModalOpenNewPatient] = useState(false);
    const showModalNewPatient = () => {
        setInputAddress();
        setInputZoneCode();
        // resetDetailAddress();
        setIsModalOpenNewPatient(true);
    };
    useEffect(() => {
        fetchPatientData();
    }, []);
    // 환자 이름으로 데이터 가져오기 
    const fetchPatientData = () => {
        axios
            .get(`/api/patient/${pname}`, {
                headers: {
                    "Authorization": props.token
                }
            })
            .then((response) => {
                const modifiedData = response.data.data.map((patient, i) => ({
                    ...patient,
                    index : i+1,
                    key: patient.pno,
                    gender: patient.gender === "m" ? "남자" : "여자",
                    visit: patient.visit === "y" ? "재진" : "초진"
                }));
                setPatientData(modifiedData);
                // console.log("patientData", modifiedData);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // 신규 환자 데이터 insert 하기
    const submitNewPatientData = (values) => {
        return Swal.fire({
            title: '신규로 등록하시겠습니까?',         // `${changeStatusQuestion}`,
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                newPatientForm.validateFields();
                // 휴대전화
                const contact1 = newPatientForm.getFieldValue('contact1');
                const contact2 = newPatientForm.getFieldValue('contact2');
                const contact3 = newPatientForm.getFieldValue('contact3');

                console.log("contact1", contact1);
                console.log("contact2", contact2);
                console.log("contact3", contact3);

                const contactValue = `${contact1}-${contact2}-${contact3}`;
                console.log("contactValue", contactValue);
                // 주민등록번호
                const birthDate1 = newPatientForm.getFieldValue('birthdate1');
                const birthDate2 = newPatientForm.getFieldValue('birthdate2');
                const birthdate = `${birthDate1}-${birthDate2}`;

                // 상세주소
                const detailAddress = newPatientForm.getFieldsValue('detailAddress');


                // Check for duplicate birthdate
                const isDuplicate = checkDuplicateBirthdate(birthdate);

                if (isDuplicate) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Duplicate birthdate. Please enter a unique birthdate.',
                        icon: 'error',
                    });
                    return; // Stop further execution
                }



                // 현재 날짜 구하기
                const today = new Date();
                const currentYear = today.getFullYear();
                const currentYear2 = currentYear - 2000;
                // 입력받은 연도 구하기
                let year = parseInt(birthdate.slice(0, 2));

                if (year > currentYear2) {
                    year += 1900;
                } else {
                    year += 2000;
                }
                // 입력받은 주민번호에서 성별 구하기
                const genderNumber = parseInt(birthdate.slice(7, 8));
                let gender = '';
                if (genderNumber % 2 === 0) {
                    gender = 'f';
                } else {
                    gender = 'm';
                }
                // 만 나이 구하기
                let age = currentYear - year;
                // Calculate the age
                const address = `${inputAddress} ${inputZoneCode} ${detailAddress}`;
                axios.post('/api/patient', {
                    pno: null,
                    age: age,
                    gender: gender,
                    address: address,
                    contact: contactValue,
                    birthdate: birthdate,
                    ...values
                }, {
                    headers: {
                        "Authorization": props.token
                    }
                }).then(() => {
                    Swal.fire({
                        title: '등록 되었습니다.',
                        icon: 'warning',
                        message: '성공'
                    })
                    props.resetAllCount();
                    setIsModalOpenNewPatient(false);
                    setInputAddress();
                    setInputZoneCode();
                    // resetDetailAddress();
                    // setContact({ contact1: '010', contact2: '', contact3: '' });
                    newPatientForm.resetFields(); // input 박스 rest
                    fetchPatientData();
                    setCurrentPatientPage(1);
                }).catch((error) => {
                    console.log(error);
                })
            }
        })
    };
    // 주소 창 모아둔 거
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [inputAddress, setInputAddress] = useState();
    const [inputZoneCode, setInputZoneCode] = useState();
    // const [inputDetailAddress, setInputDetailAddress] = useState();
    // 모달 핸들러, 데이터 저장, style  
    const handlePostcodeSearch = () => {
        if (isPostcodeOpen) {
            setIsPostcodeOpen(false);
        } else {
            setIsPostcodeOpen(true);
        }
    };
    const postCodeStyle = {
        width: '400px',
        height: '200px',
        display: 'block',
    };
    // const resetDetailAddress = () => {
    //     setInputDetailAddress('');
    // };
    const onCompletePost = data => {
        setInputAddress(data.address);
        setInputZoneCode(data.zonecode);
        // resetDetailAddress();
        setIsPostcodeOpen(false);
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

    const connectWebSocket = (pname) => {
        const socket = new SockJS('/websocket');
        const stompClient = Stomp.over(socket);
      
        stompClient.connect({}, () => {
          console.log('Connected to WebSocket');
      
          const message = pname; // 보낼 메시지
          stompClient.send('/app/sendMessage', {}, message);
          console.log('Message sent: ' + message);
      
         // stompClient.disconnect();
          console.log('Disconnected from WebSocket');
        });
      };
      
      
    return (
        <>
            <Space>
                {/* 신규환자등록 모달 */}
                <Modal
                    className="modalStyle"
                    visible={isModalOpenNewPatient}
                    onCancel={() => {
                        newPatientForm.resetFields(); setIsModalOpenNewPatient(false);
                        // setContact({ contact1: '010', contact2: '', contact3: '' });
                    }}
                    footer={[]}
                    width={600}
                >
                    <Form {...layout}
                        form={newPatientForm}
                        onFinish={submitNewPatientData}
                        initialValues={{ insurance: '건강보험', /* contact: contact1 */ }}>
                        <h2>신규 환자 등록</h2>
                        <Divider />
                        {/* 이름 */}
                        <Form.Item name="pname" label="이름" rules={[{ required: true, message: '이름을 입력해주세요.' }]}>
                            <Input className='roundShape' style={{ height: '30px', width: '25%' }} />
                        </Form.Item>

                        <Form.Item label="주민등록번호" rules={[{ required: true }]}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Item
                                    name="birthdate1"
                                    noStyle
                                    rules={[{ required: true, message: 'Please enter the first part of the birthdate.' }]}
                                >
                                    <Input
                                        className='roundShape'
                                        style={{ height: '32px', width: '34%' }}
                                        maxLength={6}
                                        onChange={(e) => {
                                            newPatientForm.setFieldsValue({ birthdate1: e.target.value });
                                            const birthDate2Value = newPatientForm.getFieldValue('birthdate2');
                                            const birthdate = `${e.target.value}-${birthDate2Value}`;
                                            const isDuplicate = checkDuplicateBirthdate(birthdate);
                                            if (isDuplicate) {
                                                Swal.fire({
                                                    title: 'Error',
                                                    text: '이미 등록된 환자입니다. 주민등록번호를 확인해주세요',
                                                    icon: 'error',
                                                });
                                            }
                                        }}
                                    />
                                </Form.Item>
                                <span style={{ height: '20px', margin: '5px' }}> - </span>
                                <Form.Item
                                    name="birthdate2"
                                    noStyle
                                    rules={[{ required: true, message: 'Please enter the second part of the birthdate.' }]}
                                >
                                    <Input
                                        className='roundShape'
                                        style={{ height: '32px', width: '34%' }}
                                        maxLength={7}
                                        onChange={(e) => {
                                            newPatientForm.setFieldsValue({ birthdate2: e.target.value });
                                            const birthDate1Value = newPatientForm.getFieldValue('birthdate1');
                                            const birthdate = `${birthDate1Value}-${e.target.value}`;
                                            const isDuplicate = checkDuplicateBirthdate(birthdate);
                                            if (isDuplicate) {
                                                Swal.fire({
                                                    title: 'Error',
                                                    text: 'Duplicate birthdate. Please enter a unique birthdate.',
                                                    icon: 'error',
                                                });
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item label="연락처" >
                            <div style={{ display: 'flex', alignItems: 'center' }} >
                                <Form.Item name="contact1" noStyle initialValue="010">
                                    <Select name="contact1" defaultValue="010" style={{ width: '75px' }}
                                    // onChange={(value) => setContact((prevContact) => ({ ...prevContact, contact1: value }))}
                                    >
                                        <Option value="010">010</Option>
                                        <Option value="011">011</Option>
                                    </Select>
                                </Form.Item>
                                <span style={{ height: '20px', margin: '5px' }}> - </span>
                                <Form.Item name="contact2" noStyle rules={[{ required: true, message: 'Please enter contact2.' }]}>
                                    <Input className="roundShape" style={{ height: '32px', width: '85px' }} maxLength={4}
                                    // onChange={(e) => setContact((prevContact) => ({ ...prevContact, contact2: e.target.value }))}
                                    />
                                </Form.Item>
                                <span style={{ height: '20px', margin: '5px' }}> - </span>
                                <Form.Item name="contact3" noStyle rules={[{ required: true, message: 'Please enter contact3.' }]}>
                                    <Input className="roundShape" style={{ height: '32px', width: '85px' }} maxLength={4}
                                    // onChange={(e) => setContact((prevContact) => ({ ...prevContact, contact3: e.target.value }))}
                                    />
                                </Form.Item>
                            </div>
                        </Form.Item>
                        {/* 주소 */}
                        <Form.Item
                            label="주소"
                            rules={[
                                { required: true, message: 'Please enter the first part of the address' }
                            ]}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Input
                                    className='roundShape'
                                    value={inputAddress}
                                    style={{ marginBottom: '4px' }}
                                    id="sample2_postcode"
                                    placeholder="우편번호"
                                    disabled
                                />
                                <Button
                                    className='roundShape'
                                    style={{ marginLeft: '5px', marginBottom: '5px' }}
                                    type="button"
                                    onClick={handlePostcodeSearch}
                                >
                                    우편번호 찾기
                                </Button>
                            </div>
                            <Input
                                className='roundShape'
                                value={inputZoneCode}
                                style={{ marginBottom: '4px' }}
                                id="sample2_address"
                                placeholder="주소"
                                disabled
                            />
                            <Form.Item name="detailAddress" noStyle rules={[{ required: true, message: '주소를 입력해주세요' }]}>
                                    <Input className="roundShape" style={{ height: '37px', width: '342px' }} 
                                    
                                    />
                                </Form.Item>
                            {isPostcodeOpen && (
                                <DaumPostcode
                                    style={postCodeStyle}
                                    onComplete={onCompletePost}
                                />
                            )}
                        </Form.Item>
                        {/* 보험유형 */}
                        <Form.Item name="insurance" value={inputZoneCode} label="보험유형" rules={[{ required: true }]}>
                            <Select style={{ width: '31%' }} defaultValue="건강보험" className='roundShape'>
                                <Select className='roundShape' value="건강보험">건강보험</Select>
                                <Select className='roundShape' value="의료급여">의료급여</Select>
                            </Select>
                        </Form.Item>
                        <Form.Item name="etc" label="비고" >
                            <TextArea className='roundShape' rows={3} />
                        </Form.Item>
                        <Form.Item shouldUpdate style={{ marginBottom: '0%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                            <Button
                                className="roundShape"
                                type="primary"
                                style={{ width: '140px', height: '45px', fontSize: '18px' }}
                                ghost
                                htmlType="submit"
                            >
                                등 록
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>
            {/* 환자 상세 정보 모달 */}
            {selectedPatientRow && (
                <Modal
                    width={900}
                    height={900}
                    className="modalStyle"
                    visible={patientModalVisible}
                    footer={[
                        <Button className='roundShape' type="primary" ghost onClick={() => { setPatientModalVisible(false); }} > 확인 </Button>,
                    ]}
                    onCancel={() => setPatientModalVisible(false)}
                >
                    <div>
                        <Descriptions
                            title="환자 상세 정보"
                            bordered
                            extra={<Divider />}
                        >
                            <Descriptions.Item label="이름">{selectedPatientRow.pname}</Descriptions.Item>
                            <Descriptions.Item label="성별">{selectedPatientRow.gender}</Descriptions.Item>
                            <Descriptions.Item label="주민등록번호"> {selectedPatientRow.birthdate}</Descriptions.Item>
                            <Descriptions.Item label="나이"> {selectedPatientRow.age}</Descriptions.Item>
                            <Descriptions.Item label="연락처"> {selectedPatientRow.contact}</Descriptions.Item>
                            <Descriptions.Item label="주소"> {selectedPatientRow.address}</Descriptions.Item>
                            <Descriptions.Item label="비고">{selectedPatientRow.etc}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </Modal>
            )}
            {/* 환자 증상 모달 */}
            <Modal
                className="modalStyle"
                width={600}
                height={500}
                centered visible={conditionModalVisible}
                // visible={conditionModalVisible}
                onCancel={() => {
                    setConditionModalVisible(false)
                    setCondition();
                }}
                footer={[
                    <Button className='roundShape' type="primary" ghost onClick={fetchVisitData}> 접수 하기 </Button>,
                    <Button className='roundShape' danger onClick={() => { setConditionModalVisible(false); setCondition(); }}> 취소 </Button>
                ]}
            >
                <h3>증상을 입력하세요</h3>
                <Input.TextArea
                    className='roundShape'
                    rows={8}
                    ref={textAreaRef}
                    value={condition}
                    onChange={(e) => { setCondition(e.target.value) }}
                    placeholder="환자의 증상을 입력하세요 ..."
                />
            </Modal>
            {/* 환자리스트 카드 */}
            <Card
                bordered={true} /*있어보여서(미세하게 테두리) 일단 넣었는데 원래 기본 값 false. 나중에 확인.*/
                style={{ marginBottom: 40 }}
                className='patientcard'
                title="환자리스트 "
                headStyle={{ fontWeight: 'bold', fontSize: 21 }}
                extra={
                    <>
                        <Space>
                            {/* 검색 Input */}
                            <Input
                                style={{ height: 39, borderRadius: 7 }}
                                className="receipt-search"
                                placeholder=" 이름 입력 "
                                value={pname}
                                onChange={(e) => setPname(e.target.value)}
                            />
                            {/*환자 검색 버튼*/}
                            <Button style={{ width: '80px', height: '37px', borderRadius: 5 }} type="primary" ghost onClick={() => { fetchPatientData() }}>
                                검 색
                            </Button>
                            {/* 신규환자등록 버튼 */}
                            <Button style={{ width: '120px', height: '37px', borderRadius: 5 }} danger onClick={() => { showModalNewPatient(); }}>
                                신규 환자 등록
                            </Button>
                        </Space>
                    </>
                }
            >
                {/* 환자리스트 테이블 */}
                {/* <div style={{ marginBottom: 18, fontWeight: 'lighter', fontSize: 20, textAlign: 'center' }}>환자 리스트 </div> */}
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

                </div>
            </Card>
        </>
    )
}
export default PatientSearch;

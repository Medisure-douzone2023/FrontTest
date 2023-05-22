import { React, useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Card, Table, Space, Input, Button, Modal, Form, Select, } from "antd";
import { SearchOutlined, } from "@ant-design/icons";
import '../../assets/styles/Receipt.css';
import TextArea from 'antd/lib/input/TextArea';
import DaumPostcode from 'react-daum-postcode';
import Swal from 'sweetalert2'
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
    const [contact, setContact] = useState({ contact1: '010', contact2: '', contact3: '' }); 
    //주민등록번호
    const [birthDate, setBirthDate] = useState({ birthDate1: '', birthDate2: '' });
    //페이지네이션 state
    const [currentPatientPage, setCurrentPatientPage] = useState(1);
    /* 환자 테이블 컬럼 */
    const patientcolumn = [
        { title: 'no', dataIndex: '', key: 'index', align: 'center', width: '100px',
          render: (text, record, index) => (currentPatientPage - 1) * 5 + index + 1
        },
        { title: "환자명", dataIndex: "pname", key: "pname", align: 'center', width: '120px' },
        { title: "나이", key: "age", dataIndex: "age", align: 'center', width: '80px' },
        { title: "주민등록번호", key: "birthdate", dataIndex: "birthdate", align: 'center', width: '160px',
          render: (text) => (<span title={text}>{text.length > 8 ? `${text.substring(0, 8)}******` : text}</span>)
        },
        { title: "연락처", key: "contact", dataIndex: "contact", align: 'center', width: '160px',
        render: (text) => {
            const visibleDigits = text.substring(0, 4);
            const hiddenDigits = text.substring(4, 8).replace(/\d/g, '*');
            const lastDigits = text.substring(8);
            return <span title={text}>{`${visibleDigits}${hiddenDigits}${lastDigits}`}</span>;
          }
        },
        { title: "성별", key: "gender", dataIndex: "gender", align: 'center', width: '80px' },
        { title: "주소", key: "address", dataIndex: "address", ellipsis: true, align: 'center', width: '400px' },
        { title: "보험유형", key: "insurance", dataIndex: "insurance", align: 'center', width: '120px' },
        { title: "비고", key: "etc", dataIndex: "etc", ellipsis: true, align: 'center', width: '180px' },
        { title: "접수", key: "receipt", dataIndex: "receipt", align: 'center', width: '120px',
          render: (text, record) => (<Button type="primary" ghost onClick={() => { setConditionModalVisible(true); }}>접 수</Button>),
        }
    ];
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
                props.fetchReceiptData(props.status);
                //console.log("패치방문데이터 안에서, selectedPateintRow.pno: ", selectedPatientRow.pno);
                // console.log("visitData", visitData);
            })
            .catch((error) => {
                console.log(error);
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
                props.fetchFeeTableData(props.status);
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
        resetDetailAddress();
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
                const modifiedData = response.data.data.map((patient) => ({
                    ...patient,
                    gender: patient.gender === "m" ? "남자" : "여자",
                    visit: patient.visit === "y" ? "재진" : "초진"
                }));
                setPatientData(modifiedData);
                console.log("patientData", modifiedData);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // 신규 환자 데이터 insert 하기
    const submitNewPatientData = (values) => {
        console.log("values: ", values);
        // 휴대전화
        const contactValue = `${contact.contact1}-${contact.contact2}-${contact.contact3}`;
        console.log("contavValue: ", contactValue);
        const birthdate = `${birthDate.birthDate1}-${birthDate.birthDate2}`;
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
        const address = `${inputAddress} ${inputZoneCode} ${inputDetailAddress}`;
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
            alert("신규 등록 되었습니다.");
            setIsModalOpenNewPatient(false);
            setInputAddress();
            setInputZoneCode();
            resetDetailAddress();
            setContact();
            setBirthDate();
            newPatientForm.resetFields(); // input 박스 rest
            fetchPatientData();
            setCurrentPatientPage(1);
        }).catch((error) => {
            console.log(error);
        })
    };
    // 신규환자등록 중복성 검사
    const [birthdateError, setBirthdateError] = useState(null);
    const [contactError, setContactError] = useState(null);
    // 주소 창 모아둔 거
    // 주소창 모달
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [inputAddress, setInputAddress] = useState();
    const [inputZoneCode, setInputZoneCode] = useState();
    const [inputDetailAddress, setInputDetailAddress] = useState();
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
    const resetDetailAddress = () => {
        setInputDetailAddress('');
    };
    const onCompletePost = data => {
        setInputAddress(data.address);
        setInputZoneCode(data.zonecode);
        resetDetailAddress();
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

    return (
        <>
            <Space>
                {/* 신규환자등록 모달 */}
                <Modal
                    className="modalStyle"
                    visible={isModalOpenNewPatient}
                    onCancel={() => { newPatientForm.resetFields(); setIsModalOpenNewPatient(false) }}
                    footer={[]}
                    width={700}
                >
                    <Form {...layout} 
                        form={newPatientForm} 
                        onFinish={submitNewPatientData} 
                        initialValues={{ insurance: '건강보험' , contact: contact }} >
                        <h3>신규 환자 등록</h3>
                        <Form.Item name="pname" label="이름" rules={[{ required: true, }]}>
                            <Input className='roundShape' style={{ height: '32px', width: '25%' }}/>
                        </Form.Item>
                        <Form.Item
                            name=""
                            label="주민등록번호"
                            rules={[{ required: true, }]}
                        >
                            <Input 
                                id='birthdate1'
                                className='roundShape'
                                style={{ height: '32px', width: '34%' }}
                                onChange={(e) =>
                                    setBirthDate((prevContact) => ({
                                        ...prevContact,
                                        birthDate1: e.target.value,
                                    }))
                                }
                                maxLength={6}
                                rules={[
                                    {
                                      required: true,
                                    },
                                  ]}
                                
                            />
                            <span style={{ height: '32px', margin: 'auto' }}> - </span>
                            <Input
                                id='birthdate2'
                                className='roundShape'
                                style={{ height: '32px', width: '34%' }}
                                onChange={(e) =>
                                    setBirthDate((prevContact) => ({
                                        ...prevContact,
                                        birthDate2: e.target.value,
                                    }))
                                }
                                maxLength={7}
                            />
                        </Form.Item>
                        <Form.Item name="" label="연락처" rules={[{ required: true }]}>
                            <div style={{ display: 'flex' }}>
                                <Select
                                    defaultValue="010"
                                    style={{ width: '75px' }}
                                    onChange={(value) =>
                                        setContact((prevContact) => ({
                                            ...prevContact,
                                            contact1: value,
                                        }))
                                    }
                                >
                                    <Option value="010">010</Option>
                                    <Option value="011">011</Option>
                                </Select>
                                <span style={{ height: '32px', marginLeft:'2%', marginRight:'2%' }}> _ </span>
                                <Input
                                    name="contact2"
                                    className="roundShape"
                                    style={{ height: '32px', width: '100px' }}
                                    onChange={(e) =>
                                        setContact((prevContact) => ({
                                            ...prevContact,
                                            contact2: e.target.value,
                                        }))
                                    } 
                                    maxLength={4}
                                />
                                <span style={{ height: '32px', marginLeft:'2%', marginRight:'2%' }}> _ </span>
                                <Input
                                    name="contact3"
                                    className="roundShape"
                                    style={{ height: '32px', width: '100px' }}
                                    onChange={(e) =>
                                        setContact((prevContact) => ({
                                            ...prevContact,
                                            contact3: e.target.value,
                                        }))
                                    }
                                    maxLength={4}
                                    rules={[
                                        {
                                          required: true,
                                          len: 4,
                                        },
                                      ]}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item name="" label="주소" rules={[{ required: true }]} >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Input className='roundShape' style={{ marginBottom : '4px' }} id="sample2_postcode" placeholder="우편번호" value={inputZoneCode} disabled />
                                <Button className='roundShape' style={{ marginLeft: '5px', marginBottom : '5px' }} type="button" onClick={handlePostcodeSearch}>우편번호 찾기</Button>
                            </div>
                            <Input className='roundShape' style={{ marginBottom : '4px' }} id="sample2_address" placeholder="주소" value={inputAddress} disabled />
                            <Input className='roundShape' id="sample2_detailAddress" placeholder="상세주소" value={inputDetailAddress} onChange={e => setInputDetailAddress(e.target.value)} />
                            {isPostcodeOpen && (
                                <DaumPostcode
                                    style={postCodeStyle}
                                    onComplete={onCompletePost}
                                />
                            )}
                        </Form.Item>
                        <Form.Item  name="insurance" label="보험유형" rules={[{ required: true }]}>
                            <Select style={{ width: '25%'}}defaultValue="건강보험" className='roundShape'>
                                <Select className='roundShape' value="건강보험">건강보험</Select>
                                <Select className='roundShape' value="의료급여">의료급여</Select>
                            </Select>
                        </Form.Item>
                        <Form.Item name="etc" label="비고" >
                            <TextArea className='roundShape' rows={3} />
                        </Form.Item>
                        <Form.Item shouldUpdate>
                            <Button
                                type="primary"
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
                    className="modalStyle"
                    visible={patientModalVisible}
                    footer={[
                        <Button className='roundShape' type="primary" ghost onClick={() => { setPatientModalVisible(false); }} > 확인 </Button>,

                    ]}
                    onCancel={() => setPatientModalVisible(false)}
                >
                    <h2>환자 상세 정보</h2>
                    <p>이름: {selectedPatientRow.pname}</p>
                    <p>나이: {selectedPatientRow.age}</p>
                    <p>주민등록번호: {selectedPatientRow.birthdate}</p>
                    <p>연락처: {selectedPatientRow.contact}</p>
                    <p>성별: {selectedPatientRow.gender}</p>
                    <p>주소: {selectedPatientRow.address}</p>
                    <p>보험유형: {selectedPatientRow.insurance}</p>
                    <p>비고: {selectedPatientRow.etc}</p>

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
                    <Button className='roundShape' danger onClick={() => { setConditionModalVisible(false); textAreaRef.current.value = '' }}> 취소 </Button>
                ]}
            >
                <h3>증상을 입력하세요</h3>
                <Input.TextArea
                    className='roundShape'
                    rows={10}
                    ref={textAreaRef}
                    value={condition}
                    onChange={(e) => {setCondition(e.target.value)}}
                    placeholder="환자의 증상을 입력하세요 ..."
                />
            </Modal>
            {/* 환자리스트 카드 */}
            <Card
                bordered={true} /*있어보여서(미세하게 테두리) 일단 넣었는데 원래 기본 값 false. 나중에 확인.*/
                style={{ marginBottom: 40 }}
                className='card'
                title="환자리스트 "
                headStyle={{ fontSize: 19 }}
                extra={
                    <>
                        <Space>
                            {/* 검색 창 */}
                            <Input
                                className="receipt-search"
                                placeholder=" 이름 입력 "
                                style={{ borderRadius: 7 }}
                                value={pname}
                                onChange={(e) => setPname(e.target.value)}
                                prefix={<SearchOutlined />}
                            />
                            {/*환자 검색 버튼*/}
                            <Button style={{ borderRadius: 5 }} type="primary" ghost onClick={() => { fetchPatientData()}}>
                                검 색
                            </Button>
                            {/* 신규환자등록 버튼 */}
                            <Button style={{ borderRadius: 5 }} danger onClick={() => { showModalNewPatient(); }}>
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

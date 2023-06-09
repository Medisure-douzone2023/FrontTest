import { Input, Select, Space, Button, Radio, Table,Tag } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Tooltip from "antd/es/tooltip";
const { Option } = Select;
const { TextArea } = Input;
const Swal = require('sweetalert2');
function CareNote(props) {
  let token = props.token;
  const [options, setOptions] = useState([]);
  const [treats, setTreats] = useState([]);
  const [selectDD, setSelectDD] = useState([]);
  const [selectTT, setSelectTT] = useState([]);
  //진료데이터: cuserid(나중에 토큰에서 가져오기)
  const [memo, setMemo] = useState("");
  const onMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const Toast = Swal.mixin({
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })
  const resetForm = () => {
    //진료 완료/취소 시 데이터 초기화
    setOptions([]);
    setTreats([]);
    setSelectDD([]);
    onMemoChange({ target: { value: "" } }); //진료 메모 초기화
    handleDDChange([]); //Table 초기화
    handleTTChange([]);
    props.setPatient({});
    props.setIsVisited();
  };
  const onClickCancel = async () => {
    //진료 취소 버튼 클릭
    if (props.rno === 0) {
      Toast.fire({
        html: "진료중인 환자가 없습니다. <br/>" +
        "환자를 호출하세요.",
        icon: 'warning',
      });
      return;
    }
    const result = await Toast.fire({
      title: '진료를 취소하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      showconfirmButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });
    if (result.isDismissed) {//취소
      return;
    }
    const responseUpdateRnoStatus = await axios({
      //진료 상태 업데이트(진료중 -> 접수)
      method: "PUT",
      url: `/api/receipt/${props.rno}/접수`,
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });
    console.log(responseUpdateRnoStatus.data.result);
    if (responseUpdateRnoStatus.data.result !== "success") {
      console.error(responseUpdateRnoStatus.data.message);
    }
    resetForm(); //상태 리셋
    document.location.href = "/";
  };
  const onButtonClick = async () => {
    if (selectDD.length === 0 || selectTT.length === 0) {
      Toast.fire({
        html: '진료하신 상병, 처방을 추가해주세요.',
        icon: 'warning',
      });
      return;
    }
    //진료 완료 버튼 클릭
    if (props.rno === 0) {
      Toast.fire({
        html: '진료중인 환자가 없습니다. 환자를 호출하세요.',
        icon: 'warning',
      });
      return;
    }
    if (memo === "") {
      const result = await Toast.fire({
        html: '진료메모가 비었습니다. 진료를 완료하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        showconfirmButton: true,
      });
      if (result.isDismissed) {//취소
        return;
      }
    }
    // 진료추가 후,cno(진료번호) 리턴받고 상병,처방 추가
    const data = {
      //진료 데이터
      rno: Number(props.rno),
      memo: memo,
      cuserid: localStorage.getItem("userid"),
    };
    const response = await axios({
      //진료 추가
      method: "POST",
      url: `/api/care`,
      data: data,
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });
    if (response.data.result !== "success") {
      alert("진료 추가 오류 발생");
      return;
    }
    const cno = response.data.data.cno; //진료 번호
    console.log("cno: ", cno);
    // 상병추가 cno, dname, dcode, dmain
    const DDData = {
      //상병 데이터
      cno: Number(cno),
      diseasevo: selectDD,
    };
    const responseDD = await axios({
      //상병 추가
      method: "POST",
      url: `/api/disease`,
      data: DDData,
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });
    console.log("ddresponse: ", responseDD.data.result);
    // 처방추가 cno, tname, tcode, tprice
    const TTData = {
      //처방 데이터
      cno: Number(cno),
      treatmentvo: selectTT,
    };
    const responseTT = await axios({
      //처방 추가
      method: "POST",
      url: `/api/treat`,
      data: TTData,
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });
    console.log("ttresponse: ", responseTT.data.result);
    if (responseDD.data.result === "success" && responseTT.data.result === "success") {
      Toast.fire({
        title: "진료가 완료되었습니다.",
        icon: "info",
      })
      //환자 status 변경, 값들 초기화
      const responseUpdateRnoStatus = await axios({
        //접수 상태 업데이트
        method: "PUT",
        url: `/api/receipt/${props.rno}/수납대기`,
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      });
      console.log(responseUpdateRnoStatus.data.result);
      resetForm(); //상태 초기화
      document.location.href = "/";
    }
  };
  const onDDKeywordChange = async (e) => {
    //상병 검색 키워드 변경 시 호출
    setOptions([]);
    if (e.key === "Enter") {
      const keyword = e.target.value;
      const response = await axios({
        method: "get",
        url: `/api/common/care`,
        params: {
          keyword: keyword,
          gkey: "DD",
        },
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      });
      setOptions(response.data.data); //검색 결과 options에 저장
      console.log(response.data.data);
    }
  };
  const onTTKeywordChange = async (e) => {
    //처방 검색 키워드 변경 시 호출
    setTreats([]);
    if (e.key === "Enter") {
      //Enter 눌렀을 때만 검색
      const keyword = e.target.value;
      const response = await axios.get("/api/common/care", {
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
        params: {
          gkey: "TT",
          keyword: keyword,
        },
      });
      setTreats(response.data.data); //검색 결과 treats에 저장
      console.log(response.data.data);
    }
  };

  const handleDDChange = (value) => {
    //상병 option 변경 시 호출
    console.log(`상병 변경: ${value}`);
    //selectDD 배열의 dcode와 선택된 option value(dcode)배열을 비교하여 value에 있는 값만 selectDD에 저장
    const updateSelectDD = selectDD.filter((dd) => {
      return value.some((v) => v === dd.dcode);
    });
    setSelectDD(updateSelectDD);
    // setSelectDD(selectDD.filter((dd)=> value.includes(dd.dcode)));    //선택된 상병 중 취소한 상병은 dcode
  };

  const handleDDSelect = (value, option) => {
    console.log(`selected 상병  ${value} ${option.label}`);
    const updatedSelectDD = [...selectDD, { dcode: value, dname: option.label, dmain: "부" }];
    setSelectDD(updatedSelectDD);
  };

  const handleTTChange = (value) => {
    console.log(`처방 변경: ${value}`);
    const updatedSelectTT = selectTT.filter((tt) => {
      return value.some((v) => v === tt.tname);
    });
    setSelectTT(updatedSelectTT);
    // setSelectTT(selectTT.filter((tt)=> value.includes(tt.tcode)));
  };
  const handleTTSelect = (value, option) => {
    console.log(`처방selected ${value} ${option.label} ${option.data.gprice}`);
    const updatedSelectTT = [
      ...selectTT,
      { tcode: option.label, tname: value, tprice: option.data.gprice },
    ];
    setSelectTT(updatedSelectTT);
  };

  const handleMainChange = (value, record) => {
    console.log("Selected 주/부:", value, "Record:", record);
    const updateSelectDD = selectDD.map((dd) => {
      if (dd.dcode === record.dcode && dd.dmain !== value) {
        return {
          ...dd,
          dmain: value,
        };
      }
      return dd;
    });
    setSelectDD(updateSelectDD);
  };

  useEffect(() => {
    if (props.isVisited === "Y") {
      const initialOptions = [{ tcode: "TT02", tname: "재진", tprice: "4000" }];
      setSelectTT(initialOptions);
    } else if (props.isVisited === "N") {
      const initialOptions = [{ tcode: "TT01", tname: "초진", tprice: "5000" }];
      setSelectTT(initialOptions);
      // const value = 'TT01';
      // const option = {
      //   label: '초진',
      //   data: {
      //     gprice: 5000,
      //   }
      // };
      // handleTTSelect(value, option);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isVisited]);

  const diseaseColumns = [
    {
      fixed: true,
      className: "dmain",
      title: "주/부",
      key: "main",
      dataIndex: "dmain",
      width: 150,
      render: (text, record) => (
        <Radio.Group
          onChange={(e) => handleMainChange(e.target.value, record)}
          defaultValue={record.dmain}
          key={record.dcode}
        >
          <Radio.Button value={"주"}>주</Radio.Button>
          <Radio.Button value={"부"}>부</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      className: "dcode",
      title: "코드명",
      dataIndex: "dcode",
      key: "dcode",
      fixed: true,
      width: 100,
    },
    {
      title: "상병이름",
      dataIndex: "dname",
      key: "dname",
      className: "diseaseColumn",
      ellipsis: {
        showTitle: false,
      },
      render: (dname) => (
        <Tooltip placement="topLeft" title={dname}>
          {dname}
        </Tooltip>
      ),
    },
  ];
  return (
    <>
      <h1>상병</h1>
      <Select
        className="diseaseSelect"
        notFoundContent={null}
        mode="multiple"
        optionLabelProp="label"
        placeholder="상병 검색"
        placement="bottomLeft"
        onChange={handleDDChange}
        onInputKeyDown={onDDKeywordChange}
        onSelect={handleDDSelect}
        optionFilterProp="label"
        autoClearSearchValue="true"
        value={selectDD.map((option) => option.dcode)}
        allowClear="true"
        tagRender={(props) => {
          const { label, closable, onClose } = props;
          return (
            <Tag color="cyan" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
              {label}
            </Tag>
          );
        }}
      >
        {options !== [] &&
          options.map((option, index) => (
            <Option
              className="diseaseOption"
              value={option.gcode}
              label={option.codename}
              key={index}
            >
              <Space>
                <span aria-label={option.gcode}>{option.gcode}</span>
                {option.codename}
              </Space>
            </Option>
          ))}
      </Select>
      <Table
        className="diseaseTable"
        rowKey="dcode"
        pagination={false}
        dataSource={selectDD}
        tableLayout={true}
        columns={diseaseColumns}
      />

      <h1 className="careNoteText">처방</h1>
      <Select
        className="treatSelect"
        notFoundContent={null} //옵션 비어있으면 내용 표시 안함
        mode="multiple" //multiple: 여러 옵션 표시
        optionLabelProp="value"
        placeholder="처방 검색" //옵션 렌더링시 option.label을 레이블로 사용
        placement="bottomLeft"
        onChange={handleTTChange} //옵션 변경 시 호출
        onInputKeyDown={onTTKeywordChange} //키보드 입력 시 호출되는 콜백함수
        onSelect={handleTTSelect} //옵션 선택 시 호출
        optionFilterProp="value" //옵션 검색 시 어떤 속성 기준으로 필터링 할 지
        autoClearSearchValue="true" //옵션 검색 후 자동으로 검색어 지움
        value={selectTT.map((option) => option.tname)} //현재 선택된 옵션 나타내는 배열, tcode속성 배열로 만들 어 선택된 옵션 표시
        tagRender={(props) => {
          const { label, closable, onClose } = props;
          return (
            <Tag color="cyan" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
              {label}
            </Tag>
          );
        }}
        allowClear="true"
      >
        {treats !== [] &&
          treats.map((treat, index) => (
            <Option
              className="treatOption"
              value={treat.codename}
              label={treat.gcode}
              key={index}
              data={treat}
            >
              <Space>
                <span aria-label={treat.gcode}>{treat.gcode}</span>
                {treat.codename}
              </Space>
            </Option>
          ))}
      </Select>
      <h1 className="careNoteText">진료메모</h1>
      <TextArea
        className="careNote"
        showCount
        maxLength={100}
        onChange={onMemoChange}
        value={memo}
      />
      <Button className="careDone" type="primary" ghost shape="round" onClick={onButtonClick}>
        진료 완료
      </Button>
      <Button className="careCancel" danger shape="round" onClick={onClickCancel}>
        진료 취소
      </Button>
    </>
  );
}
export default CareNote;

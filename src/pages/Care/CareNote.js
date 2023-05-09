import { Input,  Select, Space, Button, Radio, Table, Dropdown, Menu} from 'antd';
import React, { useState, useRef} from 'react';
import axios from 'axios';
import Column from 'antd/lib/table/Column';
const { Option } = Select;
const { TextArea } = Input;



function CareNote(props) {
  const [options, setOptions] = useState([]);
  const [treats, setTreats] = useState([]);
  const [selectDD, setSelectDD] = useState([]);
  const [selectTT, setSelectTT] = useState([]);
  //진료데이터: memo(상태관리), rno(props), cuserid(나중에 토큰에서 가져오기)
  const [memo, setMemo] = useState("");
  const onMemoChange = (e) => {
    setMemo(e.target.value);
  }

  const resetForm = () => {
    setOptions([]);
    setTreats([]);
    setSelectDD([]);
    onMemoChange({ target: { value: '' } }); //진료 메모 초기화
    handleDDChange([]);                     //Table 초기화
    handleTTChange([]);
    props.setPatient({});
  }
  const onClickCancel = async() =>{
    if(props.rno === 0){
      alert('진료중인 환자가 없습니다. 환자를 호출하세요');
      return;
    }
    if(!window.confirm("진료를 취소하시겠습니까?")){
      return;
    }
    //진료 상태 업데이트(진료중 -> 접수)
    const responseUpdateRnoStatus = await axios({
      method: 'PUT',
      url: `/api/receipt/${props.rno}/접수`,
      headers: {
        "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE",
        'Accept': 'application/json'
      }
    })
    console.log(responseUpdateRnoStatus.data.result);
    if(responseUpdateRnoStatus.data.result !== 'success') {
      console.error(responseUpdateRnoStatus.data.message);
    }
    //상태 리셋
    resetForm();
  }
  const onButtonClick = async() => {
    if(props.rno === 0){
      alert("진료중인 환자가 없습니다. 환자를 호출하세요.");
      return;
    }
    if(memo === ''){
      if(!window.confirm("진료메모 비었음. 진료를 완료하시겠습니까?")){
        return;
      }
    }
    // 진료추가 #{rno }, #{memo }, #{cuserid } 진료 추가 후,cno(진료번호) 리턴받고 상병,처방 추가
    const data = {
      'rno': Number(props.rno),
      'memo': memo,
      'cuserid': 'eee'
    }
    console.log(data);
    const response = await axios({
      method: 'POST',
      url: `/api/care`,
      data: data,
      headers: {
        "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE",
        'Accept': 'application/json'
      }
    });
    //진료번호 null 또는 response.data.result success인 지 확인 필요
    if(response.data.result !== 'success'){
      alert("오류 발생");
      return;
    }
    const cno = response.data.data.cno;
    console.log('cno: ',cno);
    // 상병추가 #{cno }, #{dname }, #{dcode }, #{dmain }
    const DDData ={
      'cno': Number(cno),
      'diseasevo': selectDD
    }

    const responseDD = await axios({
      method: 'POST',
      url: `/api/disease`,
      data: DDData,
      headers: {
        "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE",
        'Accept': 'application/json'
      }
    })
    console.log("ddresponse: ",responseDD.data.result);
    // 처방추가 #{cno }, #{tname }, #{tcode }, #{tprice }
    const TTData = {
      'cno': Number(cno),
      'treatmentvo': selectTT
    }
    const responseTT = await axios({
      method: 'POST',
      url: `/api/treat`,
      data: TTData,
      headers: {
        "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE",
        'Accept': 'application/json'
      }
    })
    console.log("ttresponse: ",responseTT.data.result);
    if(responseDD.data.result === 'success' && responseTT.data.result === 'success'){
      alert("진료 완료");
      //환자 status 변경, 값들 초기화 
      const responseUpdateRnoStatus = await axios({
        method: 'PUT',
        url: `/api/receipt/${props.rno}/수납대기`,
        headers: {
          "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE",
          'Accept': 'application/json'
        }
      })
      console.log(responseUpdateRnoStatus.data.result);
      resetForm();
    }
   }
    const onDDKeywordChange = async(e) => {
      setOptions([]);
      if(e.key ==='Enter'){
        setOptions([]);
        const keyword = e.target.value;
        const response = await axios({
          method: 'get',
          url: `/api/common/care?keyword=${keyword}&gkey=DD`,
          headers: {
            "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE",
            'Accept': 'application/json'
          }
        });
        setOptions(response.data.data);
        console.log(response.data.data);
      }
    }
    const onTTKeywordChange = async (e) => {
      setTreats([]);
      if(e.key ==='Enter'){
        const keyword = e.target.value;
        const response = await axios.get(
          '/api/common/care', {
            headers: {
                "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE"
            }
            , params: {
              "gkey" : 'TT',
              "keyword": keyword 
            }
          }
        )
        setTreats(response.data.data);
        console.log(response.data.data);
        }
    }

    const handleDDChange = (value) => {
      console.log(`상병 변경: ${value}`);
      setSelectDD(selectDD.filter((dd)=> value.includes(dd.dcode)));
    };
    
    const handleDDSelect = (value, option) => {
      console.log(`selected 상병  ${value} ${option.label}`);
      const updatedSelectDD = [...selectDD, { dcode: value, dname: option.label, dmain: '부'}];
      setSelectDD(updatedSelectDD);
    };

    const handleTTChange = (value) => {
      console.log(`처방 변경: ${value}`);
      setSelectTT(selectTT.filter((tt)=> value.includes(tt.tcode)));
    };
    const handleTTSelect = (value, option) => {
      console.log(`selected ${value} ${option.label} ${option.data.gprice}`);
      const updatedSelectTT = [...selectTT, { tcode: value, tname: option.label, tprice: option.data.gprice}];
      setSelectTT(updatedSelectTT);
    };

    const handleMainChange = (value, record) => {
      console.log('Selected 주/부:', value, 'Record:', record);
      const updateSelectDD = selectDD.map(dd => {
        if(dd.dcode === record.dcode && dd.dmain !== value) {
          return {
            ...dd, dmain: value,
          };
        }
        return dd;
      });
      setSelectDD(updateSelectDD);
    };
    return (
        <>
            <h1>상병</h1>
            <Select 
                    notFoundContent={null}
                    mode="multiple" style={{width: '100%'}} 
                    optionLabelProp="label" placeholder="상병 검색" 
                    placement="bottomLeft"
                    onChange={handleDDChange}
                    onInputKeyDown ={onDDKeywordChange}
                    onSelect={handleDDSelect}
                    optionFilterProp="label"
                    autoClearSearchValue='true'
                    value ={selectDD.map(option => option.dcode)}
                    >
                {options !== [] && (options).map((option,index) => (
                  <Option value={option.gcode} label={option.codename} key={index} style={{width: '100%'}}>
                      <Space>
                        <span role="img" aria-label={option.gcode}>
                          {option.gcode}
                        </span>
                        {option.codename}
                      </Space>
                  </Option>)
                  )}
            </Select>
            <Table  rowKey="rno" pagination={false} dataSource={selectDD}>
              <Column title="주/부" key="main" dataIndex="dcode" render={(text, record) => (
                <Radio.Group onChange={(e) => handleMainChange(e.target.value, record)}  defaultValue='부'>
                  <Radio.Button value="주">주</Radio.Button>
                  <Radio.Button value="부">부</Radio.Button>
                </Radio.Group>
              )} />
              <Column title="코드명" dataIndex="dcode" key="dcode" />
              <Column title="상병이름" dataIndex="dname" key="dname" />
            </Table>


            <h1>처방</h1>
            <Select
                  notFoundContent={null} 
                  mode="multiple" style={{width: '100%'}} 
                  optionLabelProp="label" placeholder="처방 검색" 
                  placement="bottomLeft"
                  onChange={handleTTChange} 
                  onInputKeyDown ={onTTKeywordChange}
                  onSelect={handleTTSelect}
                  optionFilterProp="label"
                  autoClearSearchValue='true'
                  value ={selectTT.map((option) => option.tcode)}
                  >
                  {treats !== [] && treats.map((treat,index) => 
                    <Option value={treat.gcode} label={treat.codename} key={index} style={{width: '100%'}} data={treat}>
                      <Space>
                        <span role="img" aria-label={treat.gcode}>
                          {treat.gcode}
                        </span>
                        {treat.codename}
                      </Space>
                    </Option>)
                  }
            </Select>
            <h1>진료메모</h1>
            <TextArea showCount maxLength={100} onChange={onMemoChange} style={{width: '100%', height: '200px'}} value={memo}/>
            <Button type="primary" ghost onClick={onButtonClick}>진료 완료</Button>
            <Button danger onClick={onClickCancel}>진료 취소</Button>
        </>
    );
}
export default CareNote;
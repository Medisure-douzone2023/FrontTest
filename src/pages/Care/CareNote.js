import { Input,  Select, Space} from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const { Option } = Select;
const { TextArea } = Input;
const onMemoChange = (e) => {
    console.log('Change:', e.target.value);
}

const handleDDChange = (value) => {
  
  console.log(`selected ${value}`);
};

const handleTTChange = (value) => {
  console.log(`selected ${value}`);
};
function CareNote(props) {
    const [options, setOptions] = useState([]);
    const [DKeyword, setDKeyword] = useState();
    const [treats, setTreats] = useState([]);
    const [TKeyword, setTKeyword] = useState();
    const onDDKeywordChange = async(e) => {
      if(e.key ==='Enter'){
        setDKeyword(e.target.value);
        console.log(e.target);
        const keyword = e.target.value;
        const response = await axios.get(
          '/api/common/care', {
            headers: {
                "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4Mjk4NTIyNiwiZXhwIjoxNjgzMjg1MjI2fQ.2CpvMAsbnCssjovVWFDOeVpZ0Gy4fx22YYGHKzJ9i-Y"
            }
            , params: {
              "gkey" : 'DD',
              "keyword": keyword 
            }
          }
        )
        setOptions(response.data.data);
        setDKeyword();
      }
    }
    const onTTKeywordChange = async (e) => {
      if(e.key ==='Enter'){
        e.preventDefault();
        const keyword = e.target.value;
        setTKeyword(e.target.value);
        const response = await axios.get(
          '/api/common/care', {
            headers: {
                "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4Mjk4NTIyNiwiZXhwIjoxNjgzMjg1MjI2fQ.2CpvMAsbnCssjovVWFDOeVpZ0Gy4fx22YYGHKzJ9i-Y"
            }
            , params: {
              "gkey" : 'TT',
              "keyword": keyword 
            }
          }
        )
        setTreats(response.data.data);
        setTKeyword();
        }
    }
    useEffect(() =>{

    },[options])
    return (
        <>
            <h1>상병</h1>
            <Select mode="multiple" style={{width: '100%'}} 
                    optionLabelProp="label" placeholder="상병 검색" 
                    placement="bottomLeft" dropdownMatchSelectWidth={false} 
                    onKeyDown={onDDKeywordChange} searchValue={DKeyword}
                    onChange={handleDDChange}>
                {(options).map((option,index) => (
                    <Option value={option.gcode} label={option.codename} key={index} style={{width: '100%'}}>
                      <Space>
                        <span role="img" aria-label={option.gcode}>
                          {option.gcode}
                        </span>
                        {option.codename}
                      </Space>
                    </Option>)
                  ) }
            </Select>
            <h1>처방</h1>
            <Select mode="multiple" style={{width: '100%'}} 
                  onKeyDown={onTTKeywordChange} optionLabelProp="label" 
                  placeholder="상병 검색" placement="bottomLeft" 
                  dropdownMatchSelectWidth={false} 
                  onChange={handleTTChange} searchValue={TKeyword}>
                  {treats !== [] && treats.map((treat,index) => 
                    <Option value={treat.gcode} label={treat.codename} key={index} style={{width: '100%'}}>
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
            <TextArea showCount maxLength={100} onChange={onMemoChange} style={{width: '100%', height: '200px'}} />
            {/* <Table  rowKey="rno" pagination={false} dataSource={options} /> */}
        </>
    );
}
export default CareNote;
import React, { useState } from 'react';
import { Select, Space } from 'antd';
import axios from 'axios';

const options = [];
const param = { gkey: "DD", keyword: '' };

// const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzA5NTg2MiwiZXhwIjoxNjgzMzk1ODYyfQ.t_d2TTHdJZjC7reBG7ME1mMg3tmCYMh7vU-gP0w1Xe0';
// axios.get("/api/common/care", { headers: { "Authorization": token }, params: param })
//   .then((e) => {
//     console.log("result Search", e)
//     let result = e.data.data;
//     for (let i = 10; i < result.length; i++) {
//       options.push({
//         value: result[i].gcode + " " + result[i].codename,
//         label: result[i].gcode + " " + result[i].codename,
//       });
//     }
//   }).catch(() => {
//     console.log('실패함')
//   })

const handleChange = (value) => {
  console.log(`selected ${value}`);
};
let val = '';

const onSearch = (value) => {
  if (value !== '') {
    val = value;
    console.log('값있음')
  } else {
    //open = false
    console.log('값없음')
  }
};

// const check = ()=>{
//   console.log("val in check",val  )
//   if (val !== '') {
//     console.log('열어')
//     return true
//   } else {
//     console.log('닫아')
//     return false
    
//   }
// }

// const setOpen = (e,value) =>{
//   console.log("setOpen",e)
//   console.log("value",value)
//   return value
// }
// const check = (open)=>{
//   console.log("val in check",open  )
//   if (val !== '') {
//     console.log('열어')
//      setOpen(true)
//   } else {
//     console.log('닫아')
//     setOpen(false)
//   }
// }

const Spec = () => {
  return (
    <Space
      style={{
        width: '100%',
      }}
      direction="vertical"
    >
      <Select
        mode="multiple"
        allowClear
        style={{
          width: '100%',
        }}
        placeholder="Please select"
        onChange={handleChange}
        options={options}
        onSearch={onSearch}

      //   open={setOpen}
      //  onDropdownVisibleChange={check}
      //  filterOption = {(inputvalue, option)=>{
      //   console.log("filterOption",inputvalue)
      //   console.log("option",option)
        
      //  }}
       
      />
    </Space>
  );
};
export default Spec;
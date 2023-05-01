import { Input } from 'antd';
import React from 'react';
const { TextArea } = Input;
const onChange = (e) => {
    console.log('Change:', e.target.value);
}
function CareNote(props) {
    return (
        <TextArea showCount maxLength={100} onChange={onChange} />
        
    );
}

export default CareNote;
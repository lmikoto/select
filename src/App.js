import React,{ useState, useEffect, Fragment } from 'react';
import { Card, Button, Modal, Input, Form, InputNumber, message } from 'antd';
import { EditOutlined,MinusOutlined,DeleteOutlined,SmileOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
 
import './App.css';

const { confirm } = Modal;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

function App() {
  const [modelVisiable,setModelVisiable] = useState(false);
  const [data,setData] = useState([]);
  const [editData,setEditData] = useState({});
  const [editInfo,setEditInfo] = useState({});
  const { name,item = [] } = editData;

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem("data") || "[]" )
    setData(data);
  },[])

  const cancel = () => {
    setEditData({});
    setModelVisiable(false);
  }

  const addLine = () => {
    item.push({ name: '', weight: 10 });
    setEditData({...editData,item})
  }

  const editLineWeight = (value,i) => {
    item[i].weight = value;
    setEditData({...editData,item})
  }

  const editName = (name,i) => {
    item[i].name = name;
    setEditData({...editData,item})
  }

  const deleteLine = (i) => {
    item.splice(i,1)
    setEditData({...editData,item})
  }

  const save = () => {
    const { index } = editInfo;
    const { name, item } = editData;
    if(isEmpty(name)){
      message.error("项目名必填")
      return
    }
    if(isEmpty(item)){
      message.error("必须至少有一项")
      return
    }
    for(let i =0; i< item.length;i++){
      if(isEmpty(item[i].name)){
        message.error("单行名称必填")
        return
      }
    }
    if(index === undefined){
      data.unshift(editData)
      setData(data)
      localStorage.setItem("data",JSON.stringify(data))
      setModelVisiable(false)
      message.success("保存成功")
    }else{
      data[index] = editData
      setData(data)
      localStorage.setItem("data",JSON.stringify(data))
      setModelVisiable(false)
      message.success("保存成功")
    }
  }

  const handleCreate = () => {
    setEditInfo({})
    setEditData({})
    setModelVisiable(true)
  }

  const handleEdit = (index) => {
    setEditInfo({ index })
    setEditData(data[index])
    setModelVisiable(true)
    localStorage.setItem("data",JSON.stringify(data))
  }
  
  const deleteData = (index) => {
    data.splice(index,1)
    setData([...data])
    localStorage.setItem("data",JSON.stringify(data))
    message.success("删除成功")
  }

  const handleDelete = (k) => {
    confirm({
      title: '确认删除吗',
      onOk() {
        deleteData(k)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  const random = (index) => {
    const d = data[index].item;
    const temp = []
    for(let i = 0; i< d.length;i++){
      for(let k = 0; k< d[i].weight ;k++){
        temp.push(d[i].name);
      }
    }
    const nameIndex = parseInt(Math.random()*(temp.length+1),10)
    Modal.confirm({
      title: '结果是。。。',
      content: temp[nameIndex],
      okText: '确认',
      cancelText: '取消',
    });
  }

  return (
    <div>
      <Button type="primary" className="createBtn" onClick={handleCreate} >新建</Button>
      <div className="App">
        {
          data.map((i,k)=>{
            const { name, item = [] } = i;
            const display1 = (item[0] && item[0].name) || ''
            const display2 = (item[1] && item[1].name) || ''
            const display3 = (item[2] && item[2].name) || ''
            return (
            <Card 
              className="card" 
              title={name}
              key={k}
              actions={[
                <SmileOutlined onClick={() => random(k)} />,
                <EditOutlined onClick={() => handleEdit(k)}/>,
                <DeleteOutlined onClick={() => handleDelete(k)} />,
              ]}
              >
              <p>{display1}</p>
              <p>{display2}</p>
              <p>{display3}</p>
              <p>...</p>
          </Card>
            )
          })
        }
        <Modal
          visible={modelVisiable}
          onCancel={cancel}
          title="项目"
          onOk={save}
         >
           <Form
            {...layout}
           >
             <Form.Item
              label="项目名称"
             >
                <Input value={name} onChange={(e)=>setEditData({ ...editData,name: e.target.value, })} />
             </Form.Item>

             {
                 item.map((i,k)=>{
                   const { name, weight } = i;
                  return (
                    <Fragment key={k}>
                      <Form.Item
                        label="单行名称"
                      >
                          <Input
                            value={name}
                            onChange={(e)=>editName(e.target.value,k)}
                            style={{width: '60%'}}
                          />
                          <InputNumber
                            style={{width: '20%',marginLeft: '5px'}}
                            min={1}
                            value={weight}
                            onChange={(v) => editLineWeight(v,k)}
                           />
                          <MinusOutlined
                            style={{ marginLeft: '20px' }}
                            onClick={() => deleteLine(k)}
                          />
                      </Form.Item>
                    </Fragment>
                  )
                  
                 })
               }
             <Button type="primary" onClick={addLine} >新增一行</Button>
           </Form>
        </Modal>
      </div>
    </div>
  );
}

export default App;

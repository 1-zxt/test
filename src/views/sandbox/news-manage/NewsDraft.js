import React, { useEffect, useState } from 'react'
import { Table, Button, Modal } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios'

const { confirm } = Modal

export default function NewsDraft(props) {
     const [dataSource, setdataSource] = useState([])

     const { username } = JSON.parse(localStorage.getItem("token"))

     useEffect(() => {
          axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
               const list = res.data
               setdataSource(list)
          })
     }, [username])


     // antd组件库的使用 render
     const columns = [
          {
               title: "ID",
               dataIndex: "id",
               render: (id) => {
                    return <b>{id}</b>
               }
          },
          {
               title: "新闻标题",
               dataIndex: "title",
               render: (title, item) => {
                    return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>

               }
          },
          {
               title: "作者",
               dataIndex: "author",
          },
          {
               title: "分类",
               dataIndex: "category",
               render: (category) => {
                    return category.title
               }
          },
          {
               title: "操作",
               render: (item) => {
                    return <div>
                         <Button danger shape="circle" icon={<DeleteOutlined />}
                              onClick={() => confirmMethod(item)} />

                         <Button type="circle" shape="circle" icon={<EditOutlined />} onClick={() => {
                              props.history.push(`/news-manage/update/${item.id}`)
                         }} />
                         <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => {
                              handleCheck(item.id)
                         }} />

                    </div>
               }
          }
     ];

     const handleCheck = (id) => {
          axios.patch(`/news/${id}`, {
               auditState: 1
          }).then(res => {
               props.history.push('/audit-manage/list')
          })
     }

     //antd引入confirm组件
     const confirmMethod = (item) => {
          confirm({
               title: '您确定要删除吗?',
               icon: <ExclamationCircleOutlined />,
               onOk() {
                    deleteMethod(item);
               },
               onCancel() {
                    console.log('Cancel');
               },
          });
     }

     // 删除函数
     const deleteMethod = (item) => {
          // 当前页面同步状态+后端同步

          setdataSource(dataSource.filter(data => data.id !== item.id))
          axios.delete(`/news/${item.id}`)

     }
     return (
          <div>
               <Table dataSource={dataSource} columns={columns} pagination={{
                    pageSize: 5
               }}
                    rowKey={item => item.id} />
          </div>
     )
}
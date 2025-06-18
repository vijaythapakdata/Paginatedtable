import * as React from 'react';
// import styles from './Pagination.module.scss';
import type { IPaginationProps } from './IPaginationProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import {sp} from '@pnp/sp/presets/all';
import '@pnp/sp/webs';
import '@pnp/sp/items';
import '@pnp/sp/items';
import {Table,Input} from 'antd';
 const Pagination:React.FC<IPaginationProps>=(props)=>{
  const[items,setItems]=React.useState<any[]>([]);
  const[searchText,setSearchText]=React.useState<string>('');

  React.useEffect(()=>{
    sp.setup({
      spfxContext:props.context
    });
   
sp.web.lists.getByTitle(props.ListName).items.select('Title','EmailAddress','Age').get().then((data)=>{
  const _formattedData=data.map((item)=>({
    key:item.Id,
    Title:item.Title,
    EmailAddress:item.EmailAddress,
    Age:parseInt(item.Age)
  }));
  setItems(_formattedData);
})
.catch((err)=>{
  console.log(err);
})

  },[props.context]);

  const handleSearch=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setSearchText(event.target.value);
  }
  const columns=[
    {
      title:'Name',
      dataIndex:'Title',
      key:'Title',
      sorter:(a:any,b:any)=>a.Title.localeCompare(b.Title),
    },
    {
      title:'Email Address',
      dataIndex:'EmailAddress',
      key:'EmailAddress',
      sorter:(a:any,b:any)=>a.EmailAddress.localeCompare(b.Title),
    },
    
    {
title:'Age',
dataIndex:'Age',
key:'Age'
    }
  ]
  const filteredItems=items.filter((item)=>(item?.Title?.toLowerCase()||'').includes(searchText.toLowerCase())||(item?.EmailAddress?.toLowerCase()||'').includes(searchText.toLowerCase()))
  return (
    <>
    <Input
    placeholder='search here'
    value={searchText}
    onChange={handleSearch}
    />
    <Table
    dataSource={filteredItems}
    columns={columns}
    pagination={{pageSize:2}}
    />
    </>
  )
}
export default Pagination ;

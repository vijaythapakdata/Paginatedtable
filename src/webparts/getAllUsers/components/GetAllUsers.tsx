import * as React from 'react';
// import styles from './GetAllUsers.module.scss';
import type { IGetAllUsersProps } from './IGetAllUsersProps';
import {MSGraphClientV3} from '@microsoft/sp-http';
import { DetailsList, PrimaryButton } from '@fluentui/react';

interface IUser{
  displayName:string;
  mail:string;
}
const GetAllUsers:React.FC<IGetAllUsersProps>=(props)=>{
  const [users,setUsers]=React.useState<IUser[]>([]);
const _getAllusers=React.useCallback(()=>{
  props.graphClient.getClient('3')
  .then((msGraphClient:MSGraphClientV3)=>{
    msGraphClient.api('users').version('v1.0')
    .select('displayName,mail')
    .get((err:any,res:any)=>{
      if(err){
        console.error('Error fetching users:', err);
        return;
      }
      const allUsers:IUser[]=res.value.map((result:any)=>({
        displayName:result.displayName,
        mail:result.mail
      }));
      setUsers(allUsers);
    })
  })
}
, [props.graphClient]);
  return(
    <>
    <PrimaryButton onClick={_getAllusers} iconProps={{iconName:'search'}}>Get All Users</PrimaryButton>
    <DetailsList
    items={users}
    />
    </>
  )
}
export default GetAllUsers;
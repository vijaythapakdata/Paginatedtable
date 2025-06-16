import * as React from 'react';
// import styles from './GetProfileInfo.module.scss';
import type { IGetProfileInfoProps } from './IGetProfileInfoProps';
import {GraphError,ResponseType} from "@microsoft/microsoft-graph-client";
import * as MicorsoftGraph from "@microsoft/microsoft-graph-types";
import { Link, Persona, PersonaSize } from '@fluentui/react';

const GetProfileInfo:React.FC<IGetProfileInfoProps>=(props)=>{
  const [name,setName]=React.useState<string|any>('');
  const [email,setEmail]=React.useState<string|any>('');
  const[image,setImage]=React.useState<string|any>('');
  const [phone,setPhone]=React.useState<string|any>('');

  React.useEffect(()=>{
    props.graphClient.api('me')
    .get((err:GraphError,res:MicorsoftGraph.User)=>{
      if(!err&&res){
        setName(res.displayName||'');
        setEmail(res.mail||'');
        setPhone(res.businessPhones?.[0]||'');
      }
    });
    //fetch profile phots
props.graphClient.api('me/photo/$value')
.responseType(ResponseType.BLOB)
.get((err:GraphError,photoResponse:Blob)=>{
  const imageReader=URL.createObjectURL(photoResponse);
  setImage(imageReader);
})
  },[props.graphClient]);
  //render email
  const renderEmail=():React.ReactNode=>{
    return email?<Link href={`mailto:${email}`}>{email}</Link>:<div/>;
  }
   const renderPhone=():React.ReactNode=>{
    return email?<Link href={`tel:${phone}`}>{phone}</Link>:<div/>;
  }
  return(
    <>
    <Persona
    text={name}
    secondaryText={email}
    onRenderSecondaryText={renderEmail}
    tertiaryText={phone}
    onRenderTertiaryText={renderPhone}
    imageUrl={image}
    size={PersonaSize.size100}
    />
    </>
  )
}

export default GetProfileInfo;
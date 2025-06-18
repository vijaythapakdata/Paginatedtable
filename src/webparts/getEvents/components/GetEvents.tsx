import * as React from "react";
// import styles from "./GetEvents.module.scss";
import type { IGetEventsProps } from "./IGetEventsProps";
import "@pnp/graph/users";
import "@pnp/graph/calendars";
import {SPFx,graphfi} from "@pnp/graph";
// import { ContentType } from "@pnp/sp/content-types";
interface IEvent{
  subject:string;
  webLink:string;
  start:{
    dateTime:string
  };
  end:{
    dateTime:string;
  }
}

const GetEvents:React.FC<IGetEventsProps>=(props)=>{
  const  [myevent,setMyEvent]=React.useState<IEvent[]>([]);
  const [loading,setLoading]=React.useState<boolean>(true);
  const getMyEvents=async()=>{
    const graph=graphfi().using(SPFx(props.context));
    
    const rawEvents=await graph.me.calendar.events();
    const cleanEvents:IEvent[]=rawEvents.map(ev=>({
      subject:ev.subject??"No subject",
      webLink:ev.webLink??"No link",
      start:{
        dateTime:ev.start?.dateTime??""
      },
      end:{
        dateTime:ev.end?.dateTime??""
      }
    }));
    setMyEvent(cleanEvents);
    setLoading(false);
    console.log(cleanEvents);
  }
// const createEvent=async()=>{
//   try{
//     const graph=graphfi().me.using(SPFx(props.context));
//     const eventsName=prompt("Enter the event name");
//     if(!eventsName) return;
//     const eventdate:any={
//       subject:eventsName,
//       body:{
//         contentType:"HTML",
//         content:"This is a test event"
//       },
//       start:{
//         dateTime:"2023-10-01T10:00:00",
//         timeZone:"UTC"
//       },
//       end:{
//         dateTime:"2023-10-01T11:00:00",
//         timeZone:"UTC"
//       },
//       location:{
//         displayName:"Test Location"
//       }
    
//     // await graph..add(eventdate);
//     // await graph.events.add(eventdate);

//     }
//   }
//   catch(err){
//     console.error("Error creating event:", err);
//   }
// }
const createEvent=async()=>{
try{
const graph=graphfi().using(SPFx(props.context));
const eventsName=prompt("Enter the event name");
if(!eventsName) return;
const eventdate:any={
  subject: eventsName,
  // body:{
  //   contentType:"HTML",
  //   content:"This is a test event"
  // },
  body:{
    contentType:'html',
    content:'This is a test event'
  },
  start:{
    dateTime:'2025-06-25T12:00:00',
    timeZone:'Pacific Standard Time'
  },
  end:{
    dateTime:'2025-06-25T13:00:00',
    timeZone:'Pacific Standard Time'
  },
  location:{
    displayName:'Test Location'
  }
};
await graph.me.calendar.events.add(eventdate);
getMyEvents();
// await graph.users.getById(props.context.pageContext.user.loginName).calendar.events.add(eventdate);
}
catch(err){
  console.error("Error creating event:", err);
}

}
React.useEffect(()=>{
  getMyEvents();
},[]);
  
return(
  <>
  <div>
    <h2>My Events</h2>
    <button onClick={createEvent}>Create Event</button>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <ul>
        {myevent.map((event, index) => (
          <li key={index}>
            <strong>{event.subject}</strong><br />
            Start: {new Date(event.start.dateTime).toLocaleString()}<br />
            End: {new Date(event.end.dateTime).toLocaleString()}<br />
            <a href={event.webLink} target="_blank" rel="noopener noreferrer">View Event</a>
          </li>
        ))}
      </ul>
    )}
  </div>
  </>
)
}
export default GetEvents;
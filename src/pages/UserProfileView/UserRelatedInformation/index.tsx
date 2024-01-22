import React,{useEffect} from 'react'
import HeaderWithData from '../../../components/HeaderWithData'
import { getVisitors } from '../../../services/audiences'
import { useParams } from 'react-router'


let testDummyData=[
    {
      "title": "Personal Information",
      "_id":"34343",
      "data": [
        {
          "title": "Gender",
          "text": "Female",
          "_id": 75
        },
        {
          "title": "Date of Birth",
          "text": "Jul 04, 1998",
          "_id": 76
        },
        {
          "title": "Martial Status",
          "text": "Married",
          "_id": 77
        },
        {
          "title": "Shipping Address",
          "text": "123 Main Street, Apt 4B, California, USA, 12345",
          "_id": 78
        },
        {
          "title": "First Seen at",
          "text": "12.97194",
          "_id": 79
        },
        {
          "title": "Billing Address",
          "text": "123 Main Street, Apt 4B, California, USA, 12345",
          "_id": 80
        }
      ]
    },
    {
      "title": "Location",
      "_id":"34343",
      "data": [
        {
          "title": "Gender",
          "text": "Female",
          "_id": 75
        },
        {
          "title": "Date of Birth",
          "text": "Jul 04, 1998",
          "_id": 76
        },
        {
          "title": "Martial Status",
          "text": "Married",
          "_id": 77
        },
        {
          "title": "Billing Address",
          "text": "123 Main Street, Apt 4B, California, USA, 12345",
          "_id": 80
        }
      ]
    },
    {
      "title": "Device Properties",
      "_id":"34343",
      "data": [
        {
          "title": "Gender",
          "text": "Female",
          "_id": 75
        },
        {
          "title": "Date of Birth",
          "text": "Jul 04, 1998",
          "_id": 76
        },
        {
          "title": "Martial Status",
          "text": "Married",
          "_id": 77
        },
        
      ]
    },
    {
      "title": "Other",
      "_id":"34343",
      "data": [
        {
          "title": "Gender",
          "text": "Female",
          "_id": 75
        },
        {
          "title": "Date of Birth",
          "text": "Jul 04, 1998",
          "_id": 76
        },
        
      ]
    }
  ]



const UserRelatedInformation = () => {


  return (
    <>
     {testDummyData&&testDummyData.map((el)=><div className='user-required-information-wrapper'>
      <HeaderWithData {...el}/>
    </div>)} 
    </>
  )
}

export default UserRelatedInformation

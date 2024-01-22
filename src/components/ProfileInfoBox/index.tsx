import React from 'react'
import "./index.sass"
import { Badge } from '@attrybtech/attryb-ui'




const ProfileInfoBox = ({title,text,iconVariant,badgesData}:ProfileInfoBoxProps) => {
  
 return (
    <div className='profile-info-box-wrapper'>
      <div className={`profile-box-icon-text-wrapper`}>
       { iconVariant&&<div className={'profile-box-icon-img-wrapper'}>
            <img src={iconVariant?.img} alt="" />
        </div>}
        <p  className='text-sm--md'>{title}</p>
      </div>
     <p className={`text-sm profile-box-user-name ${iconVariant&&`profie-box-icon-variant`}`}>{badgesData?<div style={{display:"flex",gap:"0.25rem"}}>{badgesData?.map((el)=><Badge variant={el.type?"success":"gray"} labelText={el.tag}/>)}</div>:text}</p>
    </div>
  )
}

export default ProfileInfoBox

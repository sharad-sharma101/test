import React, {useEffect, useState} from 'react'
import {getCookieByName} from "../../utils/helpers"
import { USER_BROWSER_STROAGE_KEY } from '../../utils/constants'
import './index.sass'

const ProfileIcon:React.FC = () => {

    const [userInitial, setUserInitial] = useState<string>("")

    useEffect(() => {
        const initial = JSON?.parse(getCookieByName(USER_BROWSER_STROAGE_KEY) || '{"name":""}')?.name
        if(initial){
            setUserInitial(initial[0]?.toUpperCase())
        }
    }, [])
    


  return (
    <div className="profile__icon" >
        <span>{userInitial}</span>
    </div>
  )
}

export default ProfileIcon
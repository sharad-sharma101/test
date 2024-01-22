import {useState , useEffect , useContext} from 'react'
import AppDropDown from '../sidebar-dropdown'
import { getContainers } from '../../services/containers'
import { AuthContext } from '../../auth/AuthContext'

const DropDown = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [userId , setUserId] = useState<string>('')
    const authContext: any = useContext(AuthContext);
    const [domainsNames, setDomainsNames] = useState<any>([])
    const [selectedDomain, setselectedDomain] = useState<any>()
    
    useEffect(() => {
        if (authContext?.userId)
            setUserId(authContext?.userId);
    }, [authContext])   

    useEffect(() => {
        async function getDomainsName(userId : string) {
            const domainNames = await getContainers(`userId=${userId}&isEnabled=${true}`);  
            setDomainsNames(domainNames)
            setselectedDomain(domainNames[0])
        }
        if(userId) {
            getDomainsName(userId);
        }
    }, [userId])
    
    function DropDownFunction (res : any) {
        setselectedDomain(res)
        setIsOpen(!isOpen)
    }
  return (
    <div>
      <AppDropDown isOpen={isOpen} setIsOpen={setIsOpen} selectedElement={selectedDomain} listOfItems={domainsNames} DropDownFunction={DropDownFunction} />
    </div>
  )
}

export default DropDown

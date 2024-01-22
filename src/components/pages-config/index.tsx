import React, {useState, useEffect, ChangeEvent} from 'react'
import { List, ListItem, InputField, FieldLabel, FieldGroup } from "@attrybtech/attryb-ui"
import "./index.sass"
import { objectKeys } from '../../utils/helpers'

 const PagesConfig:React.FC<PagesConfig> = ({page, handlePageChange , setPageChecked , isPageChecked}) => {
   // const [value, setValue] = useState(page.matchingObj?.pattern || "")
   const [value, setValue] = useState(page.matchingObj?.pattern || page.pattern)
   const [checkBoxState, setCheckBoxState] = useState<boolean>(false)
   
   useEffect(() => {
        setCheckBoxState(isPageChecked[page._id]);
    }, [isPageChecked])
   
   function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
      setPageChecked((prevState: PagesState) => ({ ...prevState , [page._id] : event.target.checked }) )      
      setCheckBoxState(event.target.checked) ;
    }
    return (
            <div className="page-field__container" style={{ background: `${checkBoxState ? `var(--color-primary-subdued)` : `var(--color-white-faint)`}`}} >
                <div className='page-CheckBox__wrapper'>
                    <input type="checkbox" checked={checkBoxState} onChange={(event) => handleChange(event) } />
                </div>
                <div>
                    <h6 className="m-large" >{page.name}</h6>
                </div>

                {/* <div className="" >
                    <div>
                        <FieldGroup name="sample-text-field">
                            <InputField
                                name="input-one"
                                state={"default"}
                                placeholder={"Lorem is ipsum..."}
                                preFilledValue={value}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) => {
                                    const val = event?.target?.value
                                    setValue(val)
                                    handlePageChange({...page, pattern:val})
                                }}
                            />
                        </FieldGroup>
                    </div>
                </div> */}

                </div> 
    )
}

export default PagesConfig
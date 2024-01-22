import React, { useEffect, useState } from "react";
import "./index.sass";
import settingIcon from "../../../src/assets/images/setting-icon.svg";
import { Button } from "@attrybtech/attryb-ui";
import ConfigurationAccordion from "../ConfigurationAccordion";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";
import { convertToUTC } from "../../utils/helpers";
import moment from "moment";
import { useAppDispatch , useAppSelector} from "../../app/hooks";
import { setScheduleEndDate , setScheduleEndTime , setScheduleStartDate , setScheduleStartTime } from "../../features/templates/template-slice";
import SingleDayComponent from "./advanced-setting-day-component";
import EndDatePicker from "../EndDatePicker";

const ScheduleComponent = () => {

  const dispatch = useAppDispatch();

  function changeStartDate(str:string){ dispatch(setScheduleStartDate(str))  }
  function changeEndDate(str:string){ dispatch(setScheduleEndDate(str)) }
  function changeStartTime(str:string){ dispatch(setScheduleStartTime(str)) }
  function changeEndTime(str:string){ dispatch(setScheduleEndTime(str))  }

  return (
    <div className="schedule-page-container">
      <ConfigurationAccordion heading="Schedule" subHeading="All times are local times based on visitors time zone" children={ScheduleBody(changeStartDate, changeEndDate, changeStartTime , changeEndTime)} defaultOpen={true}/>
    </div>
  );
};

const ScheduleBody = (changeStartDate:any, changeEndDate:any, changeStartTime:any , changeEndTime:any) => {
  const [advanceSettingOpen, setAdvanceSettingOpen] =useState(false)
  const [disableDate, setDisableDate] = useState(true)
  const {scheduleStartTime , scheduleEndDate , scheduleStartDate , scheduleEndTime} =useAppSelector((store) => store.templateConfigs)
  const wholeStartDate = new Date(`${scheduleStartDate} ${scheduleStartTime}`);
  const wholeEndDate = new Date(`${scheduleEndDate} ${scheduleEndTime}`);

  // Calculate the time difference in milliseconds
  const dateTimeDifference = wholeEndDate.getTime() - wholeStartDate.getTime();
  return (
    <div className="schedule-setting-container">
      <div className="schedule-data-wrapper">
        <div className="schedule-date-container">
          <div className="start-date-container">
            <div className="schedule-start-date">
              <p className="text-md--md">Start Date</p>
              <DatePicker handleChangeEvent={changeStartDate} defaultDate={scheduleStartDate} addMinDate={true}/>
            </div>
            <div className="schedule-start-time">
              <TimePicker handleChangeEvent={changeStartTime} defaultTime={scheduleStartTime} />
            </div>
          </div>
          <div className="end-date-container">
            <div className="schedule-end-date">
              <p className="text-md--md">End Date</p>
              <EndDatePicker handleChangeEvent={changeEndDate} defaultDate={scheduleEndDate} minimumDate={scheduleStartDate} disableDate={disableDate} setDisableDate={setDisableDate} />
            </div>
            <div className={`schedule-end-time ${disableDate && "no-end-time"}`}>
              <TimePicker handleChangeEvent={changeEndTime} defaultTime={scheduleEndTime} dateTimeDifference={dateTimeDifference} />
            </div>
          </div>
        </div>
        <div className="advance-setting">
          { advanceSettingOpen ? 
          <>
          <div className="advanced-setting-body">
            <h1 className="text-xl--sb advanced-setting-heading">Advanced Settings</h1>
            <div className="advanced-setting-days">
              <SingleDayComponent text="S" />
              <SingleDayComponent text="M" />
              <SingleDayComponent text="T" />
              <SingleDayComponent text="W" />
              <SingleDayComponent text="T" />
              <SingleDayComponent text="F" />
              <SingleDayComponent text="S" />
            </div>
          </div>
          <div className="advanced-setting-time">
            <div className="advanced-start-date">
              <h1 className="text-md--md">From</h1>
              <TimePicker handleChangeEvent={changeEndTime} defaultTime={scheduleEndTime}  />
            </div>
            <div className="advanced-end-date">
              <h1 className="text-md--md">To</h1>
              <TimePicker handleChangeEvent={changeEndTime} defaultTime={scheduleEndTime}  />
            </div>
          </div>
          </>
          :
          <div className="advanced-setting-btn" 
          // onClick={()=>setAdvanceSettingOpen(!advanceSettingOpen)} 
          >
            <img src={settingIcon}></img>
            <h1 className="text-sm--sb btn-text">Advanced Settings</h1>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ScheduleComponent;

// @ts-nocheck
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";
import { Button } from "@attrybtech/attryb-ui";
import calenderIcon from "../../assets/CalenderIcon.svg";
import ClickAwayListener from "react-click-away-listener";
import "./index.sass";

type Props = {
  handleChangeEvent: (str: string) => void;
  defaultStartDate ?: '' ,
  defaultEndDate ?: ''
};
const DateRangePickerComponent = ({ handleChangeEvent, defaultStartDate,defaultEndDate }: Props) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [value, setValue] = useState("");

  const currentDate = new Date();
  const formateDefaultStartDate = new Date(defaultStartDate)
  const formateDefaultEndDate = new Date(defaultEndDate)
  // Calculating one month ago from the current date
  const oneMonthAgo = moment().subtract(1, 'months').toDate();
  // Calculating 1st date of current month
  const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // Setting the end date to the current date
  
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const [dateRange, setDateRange] = useState({
    key: "selection",
    startDate: defaultStartDate  ? formateDefaultStartDate : firstDayOfCurrentMonth   ,
    endDate:  defaultEndDate  ? formateDefaultEndDate : currentDate ,
  });

  useEffect(() => {
    getDateString();
  }, [dateRange]);


  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const currentYear = currentDate.getFullYear();

  const getDateString = () => {
    let stringStartDate = dateRange?.startDate
      ? `${moment(dateRange.startDate).format("MMM DD, YYYY")} - `
      : null;
    let stringEndDate = dateRange?.endDate
      ? moment(dateRange.endDate).format("MMM DD, YYYY")
      : null;

    const rangeString = stringStartDate
      ? `${stringStartDate}${stringEndDate}`
      : "";
    setValue(rangeString);
    handleChangeEvent(rangeString);
  };

  const handleClose = () => {
    setOpenCalendar(false);
  };


  return (
    <>
      <ClickAwayListener
        onClickAway={(e) => {
          handleClose();
        }}
      >
        <div>
          <div className="summary_datepicker" id="datepicker">
            <Button
              variant="solid"
              colorScheme="secondary"
              additionalClassName=""
              onClick={() => {
                setOpenCalendar(!openCalendar);
              }}
            >
              <img src={calenderIcon}></img>
              {value || `${formattedDate} - Dec 31, ${currentYear}`}
            </Button>
            {openCalendar && (
              <DateRangePicker
                onChange={(item) => {
                  setDateRange(item.selection);
                }}
                showSelectionPreview={true}
                months={1}
                ranges={[dateRange]}
                maxDate={currentDate}
                direction="horizontal"
                className="summary_datepicker"
              />
            )}
          </div>
        </div>
      </ClickAwayListener>
    </>
  );
};

export default DateRangePickerComponent;

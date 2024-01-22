export const templateGeneralizedFunction =()=>{
  window.attryb = {}
  window.attryb.data_configuration = "data-configuration"
  window.attryb.data_preview_mode = "data-preview-mode"
  window.attryb.data_template_display = "data-template-display"

  // Replace Placeholders of usecases
  window.attryb.replacePlaceholders = (data, template) => {
    const regex = /\${{(.*?)}}/g;
    const replacedStrings = data.map((item) => {
      return template.replace(regex, (match, key) => {
        if (item.compare_at_price === null) {
          item.compare_at_price = "";
        } else if (item.discount === null) {
          item.discount = "";
        }
        if (item.hasOwnProperty(key)) {
          return item[key];
        }
        return match;
      });
    });
    return replacedStrings;
  }


  // Convert DOM elements to string
  window.attryb.convertDomToString = (domObject)=>{
    if (domObject) {
      let serializer = new XMLSerializer();
      let htmlString = serializer.serializeToString(domObject);
      return htmlString;
    }
  }
  
  // Countdown timer (deadline is in MS)
  window.attryb.getRemainingTime = (deadline)=>{
    let now = new Date();
  
    function localTimeToUTC(localTime) {
      let utcTime = new Date(
        localTime.getTime() - localTime.getTimezoneOffset() * 60000
      );
      return utcTime.getTime();
    }
  
    now = localTimeToUTC(now);
    let total = Math.max(0, Math.floor((deadline - now) / 1000)); // T0 ensure the countdown never goes negative
  
    let seconds = total % 60;
    let minutes = Math.floor((total / 60) % 60);
    let hours = Math.floor((total / 3600) % 24);
    let days = Math.floor(total / (3600 * 24));
  
    return {
      total: total,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

}
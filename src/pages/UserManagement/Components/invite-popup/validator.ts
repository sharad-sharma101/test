  export const validateForm = (firstName:string, lastName:string, email:string) => {

    if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === '') {
      alert('All fields are required.');
      return false;
    }
    
    const regex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    return true;
  };


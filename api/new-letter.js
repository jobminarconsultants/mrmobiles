const subscribeForm = document.getElementById('newsletter-form');
const emailInput = document.getElementById('email-input');

subscribeForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const email = emailInput.value;

  // Make a POST request using Axios
  axios.post('http://localhost:8083/subscribe', { email })
    .then(function(response) {
      // Success
    //   console.log(response.data.message);
    subscribeForm.innerHTML+=`<p style="color: white;">${response.data.message}</p>
          `
      emailInput.value = ''; // Clear the email input
    })
    .catch(function(error) {
      // Error
      if (error.response) {
        console.log(error.response.data.message);
        subscribeForm.innerHTML+=`<p style="color: red;">${error.response.data.message}</p>

              `
      } else {
        console.log('An error occurred. Please try again later');
        subscribeForm.innerHTML+=`<p style="color: red;">${error.response.data.message}</p>

              `
      }
    });
});

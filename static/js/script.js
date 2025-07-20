 // Navigation
 function showSection(sectionId) {
     document.querySelectorAll('.section').forEach(section => {
         section.classList.remove('active');
     });
     document.getElementById(sectionId).classList.add('active');

     // Update active nav link
     document.querySelectorAll('nav ul li a').forEach(link => {
         link.classList.remove('active');
         if (link.getAttribute('onclick').includes(sectionId)) {
             link.classList.add('active');
         }
     });
 }

document.addEventListener("DOMContentLoaded", function () {
const hash = window.location.hash;
if (hash) {
    const sectionId = hash.substring(1); // remove the #
    showSection(sectionId); // <-- this is where the function is called
}
});

//  For flash message
function hideFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
      setTimeout(() => {
        message.style.display = 'none';
      }, 2500);
    });
  }
  
  window.onload = hideFlashMessages;
  

 // Search Donors
document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // prevent page reload

    const formData = new FormData(this);

    const response = await fetch('/search_donors', {
        method: 'POST',
        body: formData
    });

    const donors = await response.json();

    const resultsDiv = document.getElementById('donor-results');
    resultsDiv.innerHTML = ''; // clear previous results

    if (donors.length === 0) {
        resultsDiv.innerHTML = '<p>No donors found.</p>';
        return;
    }

    donors.forEach(donor => {
        const donorCard = document.createElement('div');
        donorCard.className = 'donor-card';
        donorCard.innerHTML = `
            <h3>${donor.full_name || 'Name not available'}</h3>
            <p>Age: ${donor.age}</p>
            <p>Blood Group: ${donor.blood_group}</p>
            <p>Location: ${donor.location}</p>
            <p>Contact: ${donor.contact_number || 'Not provided'}</p>
            <p>Availability: ${donor.availability}</p>
        `;
        resultsDiv.appendChild(donorCard);
    });
    
});


 // Google Maps Integration
 let map;
 function initMap(donors = []) {
     map = new google.maps.Map(document.getElementById('map'), {
         center: { lat: 51.505, lng: -0.09 },
         zoom: 13
     });

     donors.forEach(donor => {
         new google.maps.Marker({
             position: { lat: donor.lat, lng: donor.lng },
             map: map,
             title: donor.name
         });
     });
 }

 // Form Validation
 function validateForm(formId) {
     const form = document.getElementById(formId);
     const inputs = form.querySelectorAll('input[required], select[required]');
     let valid = true;

     inputs.forEach(input => {
         if (!input.value) {
             valid = false;
             input.style.borderColor = '#c62828';
             let error = input.nextElementSibling;
             if (!error || !error.classList.contains('error')) {
                 error = document.createElement('span');
                 error.className = 'error';
                 error.textContent = 'This field is required';
                 input.parentNode.appendChild(error);
             }
         } else {
             input.style.borderColor = '#ddd';
             let error = input.nextElementSibling;
             if (error && error.classList.contains('error')) {
                 error.remove();
             }
         }
     });

     return valid;
 }

 // Attach validation to forms
 ['donor-form', 'request-form', 'login-form'].forEach(formId => {
     document.getElementById(formId).addEventListener('submit', function(e) {
         if (!validateForm(formId)) {
             e.preventDefault();
         }
     });
 });
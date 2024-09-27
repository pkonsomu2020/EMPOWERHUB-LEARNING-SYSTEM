(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').css('top', '0px');
        } else {
            $('.sticky-top').css('top', '-100px');
        }
    });


    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

})(jQuery);




document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Signup successful!');
        // Redirect to login or homepage
    } else {
        alert(`Signup failed: ${data.error}`);
    }
});



document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Login successful!');
        // You can store the token in localStorage or sessionStorage
        localStorage.setItem('token', data.token);
        // Redirect to a protected route or homepage
    } else {
        alert(`Login failed: ${data.message}`);
    }
});


// Optional: Handle form submission with JavaScript
document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Send the form data using fetch
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
        if (data.userId) {
            // Optionally redirect or handle successful signup
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});




// Check if the user is logged in using a backend route
fetch('/api/check-login')
    .then(response => response.json())
    .then(data => {
        const userOptions = document.getElementById('user-options');
        
        if (data.loggedIn) {
            // User is logged in, show "My Profile" and "Logout"
            userOptions.innerHTML = `
                <a href="/profile.html" class="nav-item nav-link">My Profile</a>
                <a href="/logout" class="nav-item nav-link">Logout</a>
            `;
        }
    })
    .catch(error => console.error('Error checking login status:', error
));


// MESSAGE DISPLAY IN THE STUDENT_ENROLLMENT FORM
document.getElementById('enrollmentForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from reloading the page

    const formData = new FormData(this); // Get the form data

    // Convert form data to a JSON object
    const formObject = {};
    formData.forEach((value, key) => formObject[key] = value);

    fetch('/enroll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
    .then(response => response.json())
    .then(data => {
        const toastBody = document.getElementById('enrollmentMessage');
        const toastElement = document.getElementById('enrollmentToast');

        if (data.success) {
            toastBody.innerHTML = '<div class="alert alert-success">Enrollment successful!</div>';
        } else {
            toastBody.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
        }

        // Show the toast
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    })
    .catch(error => {
        console.error('Error:', error);
        const toastBody = document.getElementById('enrollmentMessage');
        const toastElement = document.getElementById('enrollmentToast');
        
        toastBody.innerHTML = '<div class="alert alert-danger">Something went wrong. Please try again later.</div>';
        
        // Show the toast
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    });
});
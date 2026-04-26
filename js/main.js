(function () {
    'use strict';

    // Mobile device detection
    const isMobile = {
        Android: function() { return /Android/i.test(navigator.userAgent); },
        BlackBerry: function() { return /BlackBerry/i.test(navigator.userAgent); },
        iOS: function() { return /iPhone|iPad|iPod/i.test(navigator.userAgent); },
        Opera: function() { return /Opera Mini/i.test(navigator.userAgent); },
        Windows: function() { return /IEMobile/i.test(navigator.userAgent); },
        any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
    };

    // Adjust full height sections for non-mobile devices
    const fullHeight = function() {
        if (!isMobile.any()) {
            const setHeight = function() {
                $('.js-fullheight').css('height', $(window).height());
            };
            setHeight();
            $(window).resize(setHeight);
        }
    };

    // Initialize parallax effect
    const parallax = function() {
        if ($.fn.stellar) {
            $(window).stellar();
        }
    };

    // Scroll animations
    const contentWayPoint = function() {
        $('.animate-box').waypoint(function(direction) {
            if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {
                $(this.element).addClass('item-animate');
                setTimeout(function(){
                    $('.animate-box.item-animate').each(function(k){
                        const el = $(this);
                        setTimeout(function () {
                            const effect = el.data('animate-effect');
                            el.addClass(effect ? `${effect} animated-fast` : 'fadeInUp animated-fast');
                            el.removeClass('item-animate');
                        }, k * 100, 'easeInOutExpo');
                    });
                }, 50);
            }
        }, { offset: '85%' });
    };

    // Scroll to top button functionality
    const goToTop = function() {
        $('.js-gotop').on('click', function(event){
            event.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 500, 'easeInOutExpo');
        });

        $(window).scroll(function(){
            if ($(window).scrollTop() > 200) {
                $('.js-top').addClass('active');
            } else {
                $('.js-top').removeClass('active');
            }
        });
    };

    // Pie Chart Animation
    const pieChart = function() {
        if ($.fn.easyPieChart) {
            $('.chart').easyPieChart({
                scaleColor: false,
                lineWidth: 4,
                lineCap: 'butt',
                barColor: '#FF9000',
                trackColor: "#f5f5f5",
                size: 160,
                animate: 1000
            });
        }
    };

    // Activate skills section animation
    const skillsWayPoint = function() {
        if ($('#fh5co-skills').length > 0) {
            $('#fh5co-skills').waypoint(function(direction) {
                if (direction === 'down' && !$(this.element).hasClass('animated')) {
                    setTimeout(pieChart, 400);					
                    $(this.element).addClass('animated');
                }
            }, { offset: '90%' });
        }
    };

    // Hide page loader
    const loaderPage = function() {
        $(".fh5co-loader").fadeOut("slow");
    };

    // Touch event handling for mobile devices
    const touchHandler = function() {
        // Handle touch for .work items
        document.querySelectorAll('.work').forEach(function(item) {
            item.addEventListener('touchstart', function(e) {
                e.preventDefault();
                // Close other touched items
                document.querySelectorAll('.work.touched').forEach(function(other) {
                    if (other !== item) other.classList.remove('touched');
                });
                // Toggle current item
                item.classList.toggle('touched');
            }, { passive: false });
        });

        // Handle touch for .grid-item elements
        document.querySelectorAll('.grid-item').forEach(function(item) {
            item.addEventListener('touchstart', function(e) {
                e.preventDefault();
                // Close other touched items
                document.querySelectorAll('.grid-item.touched').forEach(function(other) {
                    if (other !== item) other.classList.remove('touched');
                });
                // Toggle current item
                item.classList.toggle('touched');
            }, { passive: false });
        });
    };

    // Initialize functions on document ready
    $(function(){
        contentWayPoint();
        goToTop();
        loaderPage();
        fullHeight();
        parallax();
        skillsWayPoint();
        touchHandler();
    });

    // EmailJS and WhatsApp Integration
    document.addEventListener("DOMContentLoaded", function () {
        emailjs.init("tGfN-w7Dq_z1-sP7G"); // Replace with your actual EmailJS Public Key

        const contactForm = document.getElementById("contactForm");
        if (contactForm) {
            contactForm.addEventListener("submit", function (event) {
                event.preventDefault();

                const phone = "1234567890"; // Replace with actual WhatsApp number

                const fname = document.getElementById("fname").value.trim();
                const lname = document.getElementById("lname").value.trim();
                const email = document.getElementById("email").value.trim();
                const subject = document.getElementById("subject").value.trim();
                const message = document.getElementById("message").value.trim();

                if (!fname || !lname || !email || !subject || !message) {
                    document.getElementById("status").innerHTML = "⚠️ Please fill out all fields!";
                    return;
                }

                const whatsappMessage = `📩 *New Contact Form Submission*\n\n👤 *Name:* ${fname} ${lname}\n📧 *Email:* ${email}\n📝 *Subject:* ${subject}\n\n💬 *Message:*\n${message}`;

                const templateParams = { fname, lname, email, subject, message };

                emailjs.send("service_k3bmins", "template_75zp0o6", templateParams)
                    .then(function (response) {
                        document.getElementById("status").innerHTML = "✅ Message sent successfully! Redirecting to WhatsApp...";
                        setTimeout(() => {
                            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
                            contactForm.reset();
                        }, 2000);
                    })
                    .catch(function (error) {
                        document.getElementById("status").innerHTML = "❌ Error sending message. Try again later.";
                        console.error("Email failed:", error);
                    });
            });
        }

        document.addEventListener("DOMContentLoaded", function () {

            // =========================
            // CONTACT FORM TOGGLE
            // =========================
            const btn = document.getElementById("showFormBtn");
            const form = document.getElementById("contactFormContainer");

            if (!btn || !form) {
                console.error("Button or Form not found!");
                return;
            }

            btn.addEventListener("click", function () {
                console.log("CLICK WORKING");

                const isHidden = window.getComputedStyle(form).display === "none";
                form.style.display = isHidden ? "block" : "none";
            });


            // =========================
            // OPTIONAL: SWIPER SAFE INIT
            // =========================
            if (typeof Swiper !== "undefined") {
                new Swiper(".swiper-container", {
                    slidesPerView: 3,
                    centeredSlides: true,
                    loop: true,
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }
                });
            } else {
                console.warn("Swiper not loaded (this is OK if you don't use it)");
            }

        });
        document.querySelectorAll('.swiper-slide').forEach(slide => {
            slide.addEventListener('click', function (e) {
                if (!this.classList.contains('swiper-slide-active')) {
                    e.preventDefault();
                }
            });
        });

        // Apply background images using dataset attribute
        document.querySelectorAll(".blog-bg").forEach(bg => {
            bg.style.backgroundImage = `url(${bg.dataset.bg})`;
        });
    });
})();

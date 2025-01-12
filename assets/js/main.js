(function($) {
  "use strict";

  // Preloader (if the #preloader div exists)
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      const target = $(this.hash);
      if (target.length) {
        let top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (!$('#header').hasClass('header-scrolled')) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  const nav_sections = $('section');
  const main_nav = $('.main-nav, .mobile-nav');
  const main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function() {
    const cur_pos = $(this).scrollTop();

    nav_sections.each(function() {
      const top = $(this).offset().top - main_nav_height,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
    });
  });

  // jQuery counterUp (used in Why Us section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Portfolio isotope and filter
  $(window).on('load', function() {
    const portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item'
    });
    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });
  });

  // Initiate venobox (lightbox feature used in portfolio)
  $(document).ready(function() {
    $('.venobox').venobox();
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });


  // Add the CSV fetch and parsing logic here
  async function fetchCSVData() {
    try {
      const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTGFypKKaBXxRgUX3Vip2YzseORYRUACHHLeq3UTmL2_AZ2NJYK2MFzJdbgZ7kmnRZ3eCnDPy6fylC3/pub?output=csv');
      if (!response.ok) {
        throw new Error('Failed to fetch CSV');
      }
      const data = await response.text();
      parseCSVData(data);
    } catch (error) {
      console.error('Error loading CSV:', error);
    }
  }

  function parseCSVData(csvData) {
    const rows = csvData.split('\n');
    let additionalInfoCount = 1; // Track additional info entries (additional-info1, additional-info2, etc.)

    rows.forEach(row => {
      const columns = row.split(',');

      // Ignore empty rows or rows without valid data
      if (columns.length < 2) return;

      const className = columns[0].trim();
      let textValue = columns[1].trim().replace(/\"/g, ''); // Remove any quotes around the text

      // Update HTML elements based on class names
      switch (className) {
        case 'regular-price':
          document.getElementById('regular-price').textContent = textValue;
          break;
        case 'sale-label':
          document.getElementById('sale-label').textContent = textValue;
          break;
        case 'sale-price':
          document.getElementById('sale-price').textContent = textValue;
          break;
        case 'hst':
          document.getElementById('hst').textContent = textValue;
          break;
        case 'validity':
          document.getElementById('validity').textContent = textValue;
          break;
        case 'in-class':
          document.getElementById('in-class').textContent = textValue;
          break;
        case 'course-name':
          document.getElementById('course-name').textContent = textValue;
          break;
        case 'additional-info':
          const additionalInfoElement = document.getElementById(`additional-info${additionalInfoCount}`);
          if (additionalInfoElement) {
            additionalInfoElement.textContent = textValue;
          }
          additionalInfoCount++;
          break;
      }
    });
  }

  // Ensure the CSV data is loaded after the DOM is ready
  $(document).ready(function() {
    fetchCSVData(); // Call the fetch function to load the data
  });

})(jQuery);

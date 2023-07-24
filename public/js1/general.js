

$(document).ready(function() {
    $("a[href='#']").click(function(e) { e.preventDefault() })
    if ($(window).width() > 1025) {

        new WOW().init();


    }

    
    $(".filterId").click(function(){
        $("body").addClass("filterActive");
      });
  
      $(".closeImg").click(function(){
          $("body").removeClass("filterActive"); 
      })
  


    $('.featuredListings').owlCarousel({
        loop:true,
        margin:30,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav:true
            },
            768:{
                items:2,
                nav:true, 
            },
            1000:{
                items:3,
                nav:true,
                loop:false
            }
        }
    })

    // $('.banner-carousel').owlCarousel({
    //     loop:true,
    //     margin:0,
    //     nav:true,
    //     items:1,
    //     animateOut: 'fadeOut'
   
    // })
    $('.position-select').select2();

    
    $(".menu_toggle").click(function () {
        $("body").addClass("menuOpen")
    })


    $(".close_menu").click(function () {
        $("body").removeClass("menuOpen")
    })


    $(".forgotPwLink").click(function(){
        $("#signIn").hide()
        $("#forgotPassword").show()
    })

    $(".signUpBtn").click(function(){
        $("#signIn").hide()
        $("#signUp").show()
    })

    $(".signinBtn").click(function(){
        $("#signIn").show()
        $("#signUp").hide()
    })


$(".filterTabBox  .titleOuter").click(function(){
    $(this).closest(".filterOuter").find(".slide-tab").slideToggle()
})


        /*mobile menu end here*/
        setSmallHeader();

        $(window).scroll(function () {
    
         
            setSmallHeader();
        });


      
        $(function() {
            $(".advanced-btn").on("click", function(a) {
              $(".advanced-search-div").addClass("advancedSearchOpen");
              a.stopPropagation()
            });
            $(document).on("click", function(a) {
              if (!$(a.target).is(".advanced-search-div, .advanced-search-div *") ) {
                $(".advanced-search-div").removeClass("advancedSearchOpen");
              }
            });
          });

      
      

    

})
$(window).load(function() {


})


function setSmallHeader() {
    /*small header on scroll*/

    if ($(window).scrollTop() > 0) {
        $("body").addClass("small-header");
    } else {
        $("body").removeClass("small-header");
    }
}


$(document).ready(function(){
	
	

	$("#min_price,#max_price,#min_price_one,#max_price_one").on('change', function () {

	

	  var min_price_range = parseInt($("#min_price, #min_price_one").val());

	  var max_price_range = parseInt($("#max_price, #max_price_one").val());

	  if (min_price_range > max_price_range) {
		$('#max_price, #max_price_one').val(min_price_range);
	  }

	  $("#slider-range, #slider-range-one").slider({
		values: [min_price_range, max_price_range]
	  });
	  
	});


	$("#min_price,#max_price,#min_price_one,#max_price_one").on("paste keyup", function () {                                        

	

	  var min_price_range = parseInt($("#min_price, #min_price_one").val());

	  var max_price_range = parseInt($("#max_price, #max_price_one").val());
	  
	  if(min_price_range == max_price_range){

			max_price_range = min_price_range + 100;
			
			$("#min_price, #min_price_one").val(min_price_range);		
			$("#max_price, #max_price_one").val(max_price_range);
	  }

	  $("#slider-range, #slider-range-one").slider({
		values: [min_price_range, max_price_range]
	  });

	});


	$(function () {
	  $("#slider-range, #slider-range-one").slider({
		range: true,
		orientation: "horizontal",
		min: 0,
		max: 8000,
		values: [0, 8000],
		step: 100,

		slide: function (event, ui) {
		  if (ui.values[0] == ui.values[1]) {
			  return false;
		  }
		  
		  $("#min_price, #min_price_one").val(ui.values[0]);
		  $("#max_price, #max_price_one").val(ui.values[1]);
		}
	  });

	  $("#min_price, #min_price_one").val($("#slider-range, #slider-range-one").slider("values", 0));
	  $("#max_price, #max_price_one").val($("#slider-range, #slider-range-one").slider("values", 1));

	});

	$("#slider-range,#slider-range-one").click(function () {

	  var min_price = $('#min_price, #min_price_one').val();
	  var max_price = $('#max_price, #max_price_one').val();

	  $("#searchResults, #searchResults_one").text("Here List of products will be shown which are cost between " + min_price  +" "+ "and" + " "+ max_price + ".");
	});

});
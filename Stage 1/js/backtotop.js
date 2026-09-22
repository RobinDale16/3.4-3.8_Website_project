// Get the button
let mybutton = document.getElementById("myBtn");
// Setup function to control my button scroll
window.onscroll = function() {scrollFunction()};

// When the end user scrolls down 400px from the top of the web page, show the button
//condition statement used to control display of button. Less than 400px hide button (display none).
function scrollFunction(){
	console.log("Scrolled")
	if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
		mybutton.style.display = "block";
	} else {
		mybutton.style.display = "none";
	}
}

//When the end user clicks on the button scroll to the top of the web page
function TopFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0; //Value for top scroll restart position
}

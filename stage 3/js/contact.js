// WorldNose | contact.js
// Checks the contact / feedback form before it "sends" and shows a thank you message.
// NOTE: this is a prototype. There is no server behind it yet, so nothing is emailed.
// Later I could connect it to a form service or a PHP file.

let form = document.getElementById("contactForm");
let thanks = document.getElementById("thanks");

// each field: the input, and the error message shown under it
let checks = [
  { input: document.getElementById("c-name"),  error: document.getElementById("err-name"),  message: "Please tell us your name." },
  { input: document.getElementById("c-email"), error: document.getElementById("err-email"), message: "Please enter an email like you@email.com." },
  { input: document.getElementById("c-msg"),   error: document.getElementById("err-msg"),   message: "Please write a short message (at least 10 characters)." }
];

function fieldIsValid(check){
  let value = check.input.value.trim();
  if (check.input.id === "c-email"){ return check.input.checkValidity() && value !== ""; }   // built-in email check
  if (check.input.id === "c-msg"){ return value.length >= 10; }
  return value !== "";
}

function showError(check, isBad){
  check.error.textContent = isBad ? check.message : "";
  check.input.setAttribute("aria-invalid", isBad);
}

// clear an error as soon as the person fixes it
checks.forEach(function(check){
  check.input.addEventListener("input", function(){
    if (fieldIsValid(check)){ showError(check, false); }
  });
});

form.addEventListener("submit", function(event){
  event.preventDefault();
  let firstBad = null;

  checks.forEach(function(check){
    let bad = !fieldIsValid(check);
    showError(check, bad);
    if (bad && !firstBad){ firstBad = check.input; }
  });

  if (firstBad){
    firstBad.focus();      // jump to the first problem so keyboard and screen reader users find it
    return;
  }

  document.getElementById("thanks-name").textContent = checks[0].input.value.trim();
  form.hidden = true;
  thanks.hidden = false;
  thanks.focus();
});

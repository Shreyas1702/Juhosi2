const btn = document.getElementById("passbtn");

btn.addEventListener("click", () => {});

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function validateForm() {
  let phone = document.getElementById("phone").value;
  let npassword = document.getElementById("password").value;
  let cpassword = document.getElementById("cpassword").value;
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (cpassword === npassword) {
    if (phone.match(phoneno)) {
      return true;
    } else {
      alert("Enter a valid phone number");
      return false;
    }
  } else {
    alert("Passwords does'nt match");
    return false;
  }
}

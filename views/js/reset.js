const form = document.getElementById("ResetForm");
const error = document.getElementById("error");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const token = document.getElementById("token").value;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (password.value !== confirmPassword.value)
    return (error.innerText = "Please make sure the passwords match.");

  try {
    const request = await fetch(`https://recipeandme.online/auth/reset/${token}`, {
      headers: {
        "Authorization": token,
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
          password: password.value
      })
    });
    const requestData = await request.json();
    password.value = '';
    confirmPassword.value = '';
    return error.innerText = requestData;
  } catch (err) {
    if (err) return error.innerText = "Sorry something went wrong."
  }
});

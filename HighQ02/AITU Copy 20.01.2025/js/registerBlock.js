const registerButton = document.querySelector(".register-button");
const registerTestButton = document.querySelector(".register-test-button");
const registerBlock = document.querySelector(".register-block");
const registerInfo = document.querySelector(".register-info")
const closeRegisterButton = document.querySelector(".close-register-button");
const navigationBlockRegister = document.querySelector(".navigation-block");
const body = document.querySelector("body")

function hideRegister() {
    body.style.position = ""
    registerBlock.style.display = "none";
    registerInfo.style.visibility = "hidden"
    navigationBlockRegister.style.position = "fixed";
}

registerButton.addEventListener("click", () => {
    body.style.position = "fixed"
    registerBlock.style.display = "block";
    registerInfo.style.visibility = "visible"
    navigationBlockRegister.style.position = "absolute";
});

registerTestButton.addEventListener("click", () => {
    body.style.position = "fixed"
    registerBlock.style.display = "block";
    registerInfo.style.visibility = "visible"
    navigationBlockRegister.style.position = "absolute";
});

closeRegisterButton.addEventListener("click", hideRegister);

window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        hideRegister();
    }
});
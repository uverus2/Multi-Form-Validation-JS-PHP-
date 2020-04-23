// Function to create general elements
const createNewElement = (el, appendTo, innerText, className) => {
    const element = document.createElement(`${el}`);

    if (className) {
        element.classList.add(`${className}`);
    }
    if (innerText) {
        element.innerHTML = innerText;
    }
    appendTo.append(element);
};

// Function to create inputs
const inputAppend = (type, name, appendTo) => {
    const input = document.createElement(`input`);
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    appendTo.append(input);
};

// Function to create input wrapper
const inputWrap = (appendTo, labelText, type, name, validationText) => {
    const inputWrapper = document.createElement(`div`);
    inputWrapper.classList.add("inputWrap");

    createNewElement("label", inputWrapper, labelText);

    const innerInput = document.createElement(`div`);
    innerInput.classList.add("innerInput");
    inputWrapper.append(innerInput);

    inputAppend(type, name, innerInput);
    createNewElement("p", innerInput, validationText, "error");

    appendTo.append(inputWrapper);
};

// Function to create remove button
const removeButton = (appendTo) => {
    const removeButton = document.createElement(`button`);
    removeButton.classList.add(`remove`);
    removeButton.innerHTML = "Remove";

    removeButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.target.parentNode.parentNode.remove();
    });

    appendTo.append(removeButton);
};

// Creates the form
const EmptyForm = (id) => {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("formSection");

    const form = document.createElement("form");
    form.setAttribute("id", id);
    form.setAttribute("method", "POST");
    form.setAttribute("action", "");

    wrapperDiv.append(form);

    createNewElement("h2", form, "Contact");
    removeButton(form);
    createNewElement("hr", form);

    inputWrap(form, "Name", "text", "name", "Field must have a value");
    inputWrap(form, "Phone Number", "number", "phone", "Not a valid phone number. It must be 10 digits long");
    inputWrap(form, "Email", "email", "email", "Not a valid email address. Format must be email@yahoo.com");

    const formSections = document.querySelector(".formSections");
    formSections.append(wrapperDiv);
    return form;
};

// Show Hide error messages
const showHideError = (element, toggle) => {
    const toggleValue = toggle ? "block" : "none";
    element.parentNode.querySelector("p").style.display = toggleValue;
};

// Id counter for the forms
let idCounter = 1;

// Validator class that will be used on Validate Click
class Validator {
    constructor(form) {
        this.form = form;
    }
    name(name) {
        const checkName = /^[a-zA-Z\s]*$/;

        if (name.value.match(checkName) && name.value.length > 0) {
            console.log(true);
            showHideError(name, false);
        } else {
            showHideError(name, true);
        }
    }

    phoneNumber(number) {
        const checkPhone = /^\d{10}$/;
        if (number.value.match(checkPhone)) {
            showHideError(number, false);
        } else {
            showHideError(number, true);
        }
    }

    email(email) {
        const checkEmail = /\S+@\S+\.\S+/;
        if (email.value.match(checkEmail)) {
            showHideError(email, false);
        } else {
            showHideError(email, true);
        }
    }

    validate() {
        this.name(this.form.name);
        this.phoneNumber(this.form.phone);
        this.email(this.form.email);
    }

    submitForm() {
        alert("Submited")
        this.form.submit();
    }


}

// Form Class
class Form {
    constructor() {
        this.formID = "from-";
        this.form = "";
    }
    createForm() {
        const createdForm = EmptyForm(this.formID + (idCounter += 1));
        this.form = createdForm;
    }
}

// Add a new contact on click
document.getElementById("newContact").addEventListener("click", () => {
    const form = new Form();
    form.createForm();
});


// Validate all forms
document.getElementById("validate").addEventListener("click", () => {
    Array.from(document.querySelectorAll("form")).map(i => {
        const validator = new Validator(i);
        validator.validate();
    });
});

const findInputElement = (form, value) => form.querySelector(`input[name='${value}']`);
const clearAllErrors = () => {
    Array.from(document.querySelectorAll("form .error")).map(i => {
        i.style.display = "none";
    });
};

// Submit all forms
document.getElementById("submit").addEventListener("click", async() => {
    try {
        let dataToSubmit = [];
        Array.from(document.querySelectorAll("form")).map(i => {
            const dataArray = [i.id, i.name.value, i.phone.value, i.email.value];
            dataToSubmit.push(dataArray);
        });
        console.log(dataToSubmit)

        const data = await fetch("main.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSubmit)
        });
        const decoded = await data.json();

        if (decoded.errors) {
            clearAllErrors();
            decoded.errors.map(i => {
                const form = document.getElementById(`${i[0]}`);
                if (i.includes("name")) {
                    const nameField = findInputElement(form, "name");
                    showHideError(nameField, true);
                }
                if (i.includes("phone")) {
                    const nameField = findInputElement(form, "phone");
                    showHideError(nameField, true);
                }
                if (i.includes("email")) {
                    const nameField = findInputElement(form, "email");
                    showHideError(nameField, true);
                }
            });
        } else {
            clearAllErrors();
        }

    } catch (e) {
        console.log(e)
    }


});
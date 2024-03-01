document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("button").addEventListener("click", function () {
        const inputs = document.querySelectorAll("input");
        const selects = document.querySelectorAll("select");
        const formData = {};

        inputs.forEach((input, index) => {
            if (input.name) {
                formData[input.name] = input.value;
            } else {
                formData[`input${index}`] = input.value;
            }
        });

        selects.forEach((select, index) => {
            if (select.name) {
                formData[select.name] = select.value;
            } else {
                formData[`select${index}`] = select.value;
            }
        });
        fetch('/send-object', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {

                console.log('200:', data);
            })
            .catch((error) => {
                console.error('404:', error);
            });
    });
});


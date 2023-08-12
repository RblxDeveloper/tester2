document.addEventListener("DOMContentLoaded", function () {
    var redeemBtn = document.getElementById('redeemBtn');
    var message = document.getElementById('message');
    var prizeDisplay = document.getElementById('prize');

    var validCodes = {
        "1221": "20 Robux",
        "12345": "Surprise 2"
        // Add more codes and prizes as needed
    };

    const GIST_ID = "063e86c807635b4c391c7df541ea8357"; // Replace with your Gist ID

    redeemBtn.addEventListener("click", async function () {
        var scInput = document.getElementById('scInput').value;
        var passwordInput = document.getElementById('passwordInput').value;

        if (!scInput || !passwordInput) {
            setMessage("Please fill in the required fields", "red");
            clearPrize();
        } else if (validCodes.hasOwnProperty(scInput)) {
            try {
                const gistData = await getGistData(GIST_ID);
                const redemptionStatus = JSON.parse(gistData.files["redeemedCodes.json"].content);

                if (isCodeRedeemed(redemptionStatus, scInput)) {
                    setMessage("Code has already been redeemed.", "red");
                    clearPrize();
                } else {
                    redemptionStatus[scInput] = true;
                    await updateGistData(GIST_ID, JSON.stringify(redemptionStatus));

                    setMessage(`Code redeemed successfully! You've got ${validCodes[scInput]}`, "green");
                }
            } catch (error) {
                setMessage("An error occurred.", "red");
                console.error(error);
            }
        } else {
            setMessage("Code is invalid.", "red");
            clearPrize();
        }
    });

    async function getGistData(gistId) {
        const response = await fetch(`https://api.github.com/gists/${gistId}`);
        return await response.json();
    }

    async function updateGistData(gistId, content) {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            body: JSON.stringify({ files: { "redeemedCodes.json": { content } } })
        });

        return response.status === 200;
    }

    function setMessage(text, color) {
        message.textContent = text;
        message.style.color = color;
    }

    function clearPrize() {
        prizeDisplay.textContent = "";
    }

    function isCodeRedeemed(redemptionStatus, code) {
        return redemptionStatus.hasOwnProperty(code) && redemptionStatus[code] === true;
    }
});
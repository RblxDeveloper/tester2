const firebaseConfig = {
    apiKey: "AIzaSyAcINU2KIYxsV2WZVTTaZ3tnIXESVOSsWQ",
    authDomain: "dsplayz.firebaseapp.com",
    databaseURL: "https://dsplayz-default-rtdb.firebaseio.com/",
    projectId: "dsplayz",
    storageBucket: "dsplayz.appspot.com",
    messagingSenderId: "565599758200",
    appId: "1:565599758200:web:4f09f33c2565b5d2528a8d",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the Realtime Database
const database = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
    const redeemBtn = document.getElementById('redeemBtn');
    const message = document.getElementById('message');
    const prizeDisplay = document.getElementById('prize');

    const validCodes = {
        "1221": "20 Robux",
        "12345": "50 Robux"
        // Add more codes and prizes as needed
    };

    redeemBtn.addEventListener("click", async function () {
        const scInput = document.getElementById('scInput').value;

        if (!scInput) {
            setMessage("Please enter a code.", "red");
            clearPrize();
        } else if (validCodes.hasOwnProperty(scInput)) {
            try {
                const redemptionStatus = await checkCodeRedemption(scInput);

                if (redemptionStatus) {
                    setMessage("Code has already been redeemed.", "red");
                    clearPrize();
                } else {
                    await redeemCode(scInput);
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

    async function checkCodeRedemption(code) {
        const snapshot = await database.ref('redeemedCodes').child(code).once('value');
        return snapshot.val() === true;
    }

    async function redeemCode(code) {
        await database.ref('redeemedCodes').child(code).set(true);
    }

    function setMessage(text, color) {
        message.textContent = text;
        message.style.color = color;
    }

    function clearPrize() {
        prizeDisplay.textContent = "";
    }
});
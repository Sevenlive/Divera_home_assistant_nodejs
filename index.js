const axios = require("axios");
require("dotenv").config();
const diveraToken = process.env.DIVERA_TOKEN;
const haToken = process.env.HA_TOKEN;
const haUrl = process.env.HA_URL;
const poolingInterval = 20000; // 20 seconds in milliseconds
const alertRange = 360; // Sends to HA if Alert is not older than 5 minutes

async function fetchData() {
  try {
    const response = await axios.get(
      "https://app.divera247.com/api/v2/alarms?accesskey=" + diveraToken
    );
    const responseData = response.data;
    if (responseData.data.items.length === 0) {
      console.log("Keine Alarme in der letzten Zeit.");
      sendToHomeAssistant(false);
      return;
    }
    let lastAlert = Object.entries(responseData.data.items).pop()[1];
    if (isWithinAlertRange(lastAlert.date)) {
        sendToHomeAssistant(true);
      console.log("Neuer Alarm!");
    }
    else
    {
      console.log("Der Alarm ist alt");
      sendToHomeAssistant(false);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the function initially and then in a repeating interval
fetchData();
setInterval(fetchData, poolingInterval);



function isWithinAlertRange(timestamp) {
    // Get the current Unix timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);
  
    // Check if the provided timestamp is within the alertRange
    return currentTimestamp - timestamp <= alertRange;
  }

function sendToHomeAssistant(status)
{
    return;
}

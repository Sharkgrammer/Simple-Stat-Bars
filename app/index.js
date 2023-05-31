import * as document from "document";
import * as clock from "./simple/clock";
import * as activity from "./simple/activity";
import * as hrm from "./simple/hrm";

const batteryRect = document.getElementById("batteryRect");

function showBatteryLevel(power) {
    const defaultY = 4;
    const maxBat = 45;

    let batteryLevel = power.battery;
    let isCharging = power.charging;

    if (isCharging) {
        batteryRect.style.fill = "#00FF00";
    } else {
        batteryRect.style.fill = batteryLevel > 20 ? "#ffffff" : "#FF0000";
    }

    let adjustedBat = Math.floor((batteryLevel / 100) * maxBat);

    batteryRect.height = adjustedBat;
    batteryRect.y = (defaultY + maxBat - adjustedBat)
}

/**
 * Datetime code
 */

const timeElem = document.getElementById("timeElem");
const dateElem = document.getElementById("dateElem");


function clockCallback(data) {
    timeElem.text = data.time;
    dateElem.text = data.date;

    showBatteryLevel(data.power);
}

clock.initialize("minutes", "shortDate", clockCallback);

const steps = document.getElementById("steps");
const stepsText = document.getElementById("stepsText");

const distance = document.getElementById("distance");
const distanceText = document.getElementById("distanceText");

const azm = document.getElementById("azm");
const azmText = document.getElementById("azmText");

const calories = document.getElementById("calories");
const caloriesText = document.getElementById("caloriesText");

const floors = document.getElementById("floors");
const floorsText = document.getElementById("floorsText");

function activityCallback(data) {
    stepsText.text = data.steps.pretty;
    setRectBounds(data.steps.raw / data.steps.goal, steps, stepsText, true);

    distanceText.text = data.distance.pretty;
    setRectBounds(data.distance.raw / (data.distance.goal / 1000), distance, distanceText, true);

    azmText.text = data.activeMinutes.pretty;
    setRectBounds(data.activeMinutes.raw / data.activeMinutes.goal, azm, azmText);

    caloriesText.text = data.calories.pretty;
    setRectBounds(data.calories.raw / data.calories.goal, calories, caloriesText);

    floorsText.text = data.elevationGain.pretty;
    setRectBounds(data.elevationGain.raw / data.elevationGain.goal, floors, floorsText);
}

activity.initialize("seconds", activityCallback);


const heartRect = document.getElementById("heart");
const heartText = document.getElementById("heartText");

function hrmCallback(data) {
    let hr = data.bpm;
    if (hr === null) hr = "--";

    if (heartText !== null) heartText.text = hr;

    if (hr === "--") {
        return
    }

    setRectBounds(hr / 220, heartRect, heartText);
}

hrm.initialize(hrmCallback);

/**
 * Rect code
 */

let maxRectHeight, yOffset;

function init(heightPercent, yPercent) {
    let screen = document.getElementById('screen');

    maxRectHeight = screen.height * heightPercent;
    yOffset = screen.height * yPercent;
}

init(0.45, 0.35);

function setRectBounds(percent, rect, text, extraSpace = false) {
    if (percent > 1 && !timeHidden && !extraSpace) {
        percent = 1;
    } else if (percent > 1.45) {
        percent = 1.45;
    }

    let height = maxRectHeight * percent;
    let y = yOffset + (maxRectHeight - height);
    rect.height = height;
    rect.y = y;

    text.y = y - 5;
}

/**
 * Animation code
 */

const screen = document.getElementById("screen");
const clickable = document.getElementById("clickable");

let timeHidden = false;

clickable.addEventListener("click", (evt) => {
    if (timeHidden) {
        activityCallback(activity.forceStats());
        screen.animate("disable");
    } else {
        screen.animate("enable");
        activityCallback(activity.forceStats());
    }
    timeHidden = !timeHidden;
});
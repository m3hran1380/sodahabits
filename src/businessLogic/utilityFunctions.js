import { actualScreenHeight, actualScreenWidth } from "../styles/generalStyle";


export const calculateAdjustedDimensions = (width, height) => {
    let adjustedHeight, adjustedWidth;
    const widthRatio = actualScreenWidth / width;
    const heightRatio = actualScreenHeight / height;
    
    if (widthRatio > heightRatio) {
        adjustedWidth =  width * heightRatio;   
        adjustedHeight =  height * heightRatio;   
    }
    else {
        adjustedWidth =  width * widthRatio;   
        adjustedHeight =  height * widthRatio;   
    }
    return [adjustedWidth, adjustedHeight];
}


export const formatDate = (dateObject) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const suffixes = ["th", "st", "nd", "rd"];
    const dayOfWeek = days[dateObject.getDay()];
    const dayOfMonth = dateObject.getDate();
    let suffix = suffixes[dayOfMonth % 10] || "th";
    if (dayOfMonth >= 11 && dayOfMonth <= 13) {
        suffix = "th";
    }
    return `${dayOfWeek} ${dayOfMonth}${suffix}`;
}


export const getTime = (dateObject) => {
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const time = hours + ':' + minutes;
    return time;
}
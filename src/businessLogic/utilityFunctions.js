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
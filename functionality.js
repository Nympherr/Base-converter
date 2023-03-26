

let input = document.querySelector("#input");
let convert = document.querySelector("#convert");
let output = document.querySelector("#output");
let reset = document.querySelector("#reset");
let base_from = document.querySelector("#base_from");
let base_to = document.querySelector("#base_to");
let lettersInvolved = false;
let minusSign = false;

const letterValues = {
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17,
    'I': 18, 'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25,
    'Q': 26, 'R': 27, 'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33,
    'Y': 34,'Z': 35
  };

const letterValues2 = {
    10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F',
    16: 'G', 17: 'H', 18: 'I', 19: 'J', 20: 'K', 21: 'L',
    22: 'M', 23: 'N', 24: 'O', 25: 'P', 26: 'Q', 27: 'R',
    28: 'S', 29: 'T', 30: 'U', 31: 'V', 32: 'W', 33: 'X',
    34: 'Y', 35: 'Z'
  };

const pattern = /[a-zA-Z]/;


reset.addEventListener("click", function(){
    input.value = "";
    output.value = "";
    base_from.value = 10;
    base_to.value = 2;
    lettersInvolved = false;
});

convert.addEventListener("click",function() {

    //Checks if input has any symbols besides numbers

    if(input.value[0] == "-"){
        input.value = input.value.slice(1);
        minusSign = true;
    }

    let input_value;
    if(pattern.test(input.value)){
        lettersInvolved = true;
        input.value = input.value.toUpperCase();
        input_value = convertFromLetters();
    }
    else{
        input_value = parseFloat(input.value);
    }

    // checks if input was valid

    if(!isNaN(input_value)){

        let integerPart = bigDecimal.floor(input_value);
        let floatPart =  bigDecimal.subtract(input_value,integerPart);

        // When input does not contain any letters/characters

        if(lettersInvolved == false){

            // Checks if input's base is higher than the one selected

            let checkValidity = input_value.toString().replace(/\./g, "").split("").map(Number);
            for(let l = 0; l < checkValidity.length;l++){
                if(checkValidity[l] > base_from.value){
                    output.value = "Select higher base!";
                    return ;
                }
            }

            // Checks if input is a float number

            if(floatPart == 0){
                let sum = getBase10(integerPart,base_from.value);
                let finalResult = convertUpTo36(sum, base_to.value);
                if(minusSign == true){
                    output.value = "-" + finalResult;
                } 
                else{
                    output.value = finalResult;
                }

            }

            // Input is a float number

            else{

                // Converts to a base larger than 10 (with letters instead of numbers)

                if(base_to.value > 10){
                    floatPart = getBase10Fractional(floatPart,base_from.value);
                    floatPart = convertUpTo36Fractional(floatPart,base_to.value);
                    let sum = getBase10(integerPart,base_from.value);
                    let finalResult = convertUpTo36(sum, base_to.value); 
                    finalResult = finalResult + "." + floatPart;
                    if(minusSign == true){
                        output.value = "-" + finalResult;
                    }
                    else{
                        output.value = finalResult;
                    }
                }

                // Converts to a 2-10 base where only numbers are allowed

                else{
                    floatPart = getBase10Fractional(floatPart,base_from.value);
                    floatPart = convertFromBase10Fractional(floatPart,base_to.value);
                    let sum = getBase10(integerPart,base_from.value);
                    let finalResult = convertFromBase10(sum, base_to.value);
                    finalResult = bigDecimal.add(finalResult, floatPart);
                    if(minusSign == true){
                        output.value = -1 * finalResult;
                    }
                    else{
                        output.value = finalResult;
                    }
                }
            }
        }

        // If input contained letters (f.e. AAA.C153)

        else{

            // Input is not a floating number

            if(floatPart == 0){
                    let finalResult = convertUpTo36(integerPart,base_to.value);
                    if(minusSign == true){
                        output.value = "-" + finalResult;
                    }
                    else{
                        output.value = finalResult;
                    }
                    lettersInvolved = false;
            }

            // Input is a floating number

            else{

                // Checks if user wants to convert to a base larger than 10

                if(base_to.value > 10){
                    floatPart = convertUpTo36Fractional(floatPart,base_to.value);
                    let finalResult = convertUpTo36(integerPart,base_to.value);
                    finalResult = finalResult + "." + floatPart;
                    if(minusSign == true){
                        output.value = "-" + finalResult;
                    }
                    else{
                        output.value = finalResult;
                    }
                    lettersInvolved = false;

                }

                // Convert to a 2-10 base

                else{
                    floatPart = convertFromBase10Fractional(floatPart,base_to.value);
                    let finalResult = convertFromBase10(integerPart, base_to.value);
                    finalResult = bigDecimal.add(finalResult, floatPart);
                    if(minusSign == true){
                        output.value = -1 * finalResult;
                    }
                    else{
                        output.value = finalResult;
                    }
                    lettersInvolved = false;
                }
            }
        }
    }

    // If input was not valid

    else{
        output.value = "Error!"
    }
    if(minusSign == true){
        input.value = "-" + input.value;
        minusSign = false;
    }
});

function convertFromLetters(){

    let number = 0;

    if(input.value.includes(".")){
        number = convertLetterWithFloat();
    }

    else{
        number = convertLetterWithoutFloat();
    }
    return number;
}

function convertLetterWithFloat(){

    let wholeNumber = input.value.split(".");
    let integerPart = wholeNumber[0].split("");
    let floatPart = wholeNumber[1].split("");

    let sumInteger = 0;
    let sumFloat = 0;

    // Converts numbers to corresponding ASCII values

    for(let i = 0; i < integerPart.length;i++){
        if (/[A-Z]/.test(integerPart[i])) {
            integerPart[i] = letterValues[integerPart[i]];
        }
    }

    for(let j = 0; j < floatPart.length;j++){
        if (/[A-Z]/.test(floatPart[j])) {
            floatPart[j] = letterValues[floatPart[j]];
        }
    }

    // Checks if input's base is larger than the one user selected

    for(let d = 0; d < integerPart.length; d++){
        if(Number(integerPart[d]) >= parseInt(base_from.value)){
            return;
        }
    }
    for(let c = 0; c < floatPart.length; c++){
        if(Number(floatPart[c]) >= parseInt(base_from.value)){
            return;
        }
    }

    // Adds integer and float numbers respectively

    let indexInteger = 0;
    let indexFloat = -1;

    for(let j = integerPart.length - 1; j >= 0; j--){
        sumInteger += parseInt(bigDecimal.multiply(Number(integerPart[j]),Math.pow(parseInt(base_from.value), indexInteger)));
            indexInteger++;
    }
    for(let x = 0; x < floatPart.length; x++){
        sumFloat += parseFloat(bigDecimal.multiply(Number(floatPart[x]), Math.pow(parseInt(base_from.value), indexFloat)));
            indexFloat--;
    }

    sumFloat = sumFloat.toString().replace(/^0\./, "");
    let result = sumInteger.toString() + "." + sumFloat.toString();
    return parseFloat(result);

};

function convertLetterWithoutFloat(){

    let container = input.value.split("");
    let result = 0;
    for(let i = 0; i < container.length;i++){
        if (/[A-Z]/.test(container[i])) {
            container[i] = letterValues[container[i]];
        }
    }
    for(let g = 0; g < container.length; g++){
        if(Number(container[g]) >= parseInt(base_from.value)){

            return;
        }
    }
    let index = 0;
    for(let j = container.length - 1; j >= 0; j--){
        if(container[j] != "."){
            result += Number(container[j]) * Math.pow(parseInt(base_from.value), index);
            index++;
        }
    }
    return result;
};

function getBase10(number,base_from){

    let base_value = parseFloat(base_from);
    let number_array = number.toString().split("").reverse().map(Number);
    let sum = 0;

    for(let i = 0; i < number_array.length;i++){
        sum += number_array[i] * Math.pow(base_value, i);
    }
    return sum;
};

function convertFromBase10(number,base_to){

    let quotient = parseInt(number);
    let remainder;
    let baseToValue = parseInt(base_to);
    let result = "";

    do {
        remainder = quotient % baseToValue;
        result += remainder.toString();
        quotient = Math.floor(quotient / baseToValue);
    } while (quotient != 0);

    let finalResult = result.split("").reverse().join("");
    finalResult = parseInt(finalResult);
    return finalResult;
};

function getBase10Fractional(number,base_from){

    let value = parseFloat(base_from);
    let result = 0;
    let realNumber = number.toString();
    realNumber = realNumber.slice(2);
    realNumber = realNumber.split("").map(Number);
    let power = -1;

    for(let i = 0; i < realNumber.length;i++){
        result += realNumber[i] * Math.pow(value, power);
        power--;
    }
    return result;
};

function convertFromBase10Fractional(number,base_to){

    let value = parseFloat(base_to)
    let result = "";
    let remainder = number;
    let calculation;
    let integerPart;
    let maxIterations = 17;
    do{
        calculation = bigDecimal.multiply(remainder, value);
        integerPart = bigDecimal.floor(calculation);
        result += integerPart.toString();
        remainder = bigDecimal.subtract(calculation, integerPart);
        maxIterations--;
    }while(remainder != 0 && maxIterations > 0);

    result = "0." + result;
    result = parseFloat(result);
    return result;
};

function convertUpTo36(number,base_to){

    let baseToValue = parseInt(base_to);
    let remainder = 0;
    let result = "";
    let quotient = number;

    do {
        remainder = quotient % baseToValue;
        if(remainder > 9 ){
            remainder = letterValues2[remainder].toString();
            result += remainder;
        }
        else{
            result += remainder.toString();
        }
        quotient = Math.floor(quotient / baseToValue);
    } while (quotient != 0);

    result = result.split("").reverse().join("");
    return result;
};

function convertUpTo36Fractional(number,base_to){

    let value = parseFloat(base_to)
    let result = "";
    let remainder = number;
    let calculation;
    let integerPart;
    let maxIterations = 17;
    do{
        calculation = bigDecimal.multiply(remainder, value);
        integerPart = bigDecimal.floor(calculation);
        if(integerPart > 9){
            result += letterValues2[integerPart].toString();
        }
        else{
            result += integerPart.toString();
        }

        remainder = bigDecimal.subtract(calculation, integerPart);
        maxIterations--;
    }while(remainder != 0 && maxIterations > 0);

    return result;
};
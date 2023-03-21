

let input = document.querySelector("#input");
let convert = document.querySelector("#convert");
let output = document.querySelector("#output");
let reset = document.querySelector("#reset");
let base_from = document.querySelector("#base_from");
let base_to = document.querySelector("#base_to");
let lettersInvolved = false;

const letterValues = {
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17,
    'I': 18, 'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25,
    'Q': 26, 'R': 27, 'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33,
    'Y': 34,'Z': 35
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

    let input_value;

    // KOLKAS SU RAIDEM GERAI VARO. Konvertuoja i base 10 ( nuo 36)

    if(pattern.test(input.value)){
        lettersInvolved = true;
        input.value = input.value.toUpperCase();
        let test = convertFromLetters();
        input_value = test;
        console.log(input_value);
    }
    else{
        input_value = parseFloat(input.value);
    }

    if(!isNaN(input_value)){

        let integerPart = bigDecimal.floor(input_value);
        let floatPart =  bigDecimal.subtract(input_value,integerPart);

        if(lettersInvolved == false){

            let checkValidity = input_value.toString().replace(/\./g, "").split("").map(Number);
            let checkValidity2 = input_value.toString().replace(/\./g, "");
            console.log(checkValidity2 + " hey");

            for(let l = 0; l < checkValidity.length;l++){
                if(checkValidity[l] > base_from.value){
                    output.value = "Select higher base!";
                    return ;
                }
            }
            if(floatPart == 0){
                let sum = getBase10(integerPart,base_from.value);
                let finalResult = convertFromBase10(sum, base_to.value); 
                output.value = finalResult;
            }
            else{
                floatPart = getBase10Fractional(floatPart,base_from.value);
                floatPart = convertFromBase10Fractional(floatPart,base_to.value);
                let sum = getBase10(integerPart,base_from.value);
                let finalResult = convertFromBase10(sum, base_to.value);
                finalResult = bigDecimal.add(finalResult, floatPart);
                output.value = finalResult;
            }
        }
        else{
            if(floatPart == 0){
                let finalResult = convertFromBase10(integerPart, base_to.value);
                output.value = finalResult;
                lettersInvolved = false;
            }
            else{
                floatPart = convertFromBase10Fractional(floatPart,base_to.value);
                let finalResult = convertFromBase10(integerPart, base_to.value);
                finalResult = bigDecimal.add(finalResult, floatPart);
                output.value = finalResult;
                lettersInvolved = false;
            }

        }
    }
    else{
        output.value = "Only numbers are allowed!"
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

    for(let d = 0; d < integerPart.length; d++){
        if(Number(integerPart[d]) >= parseInt(base_from.value)){
            output.value = "Incorrect parameters!";
            return;
        }
    }
    for(let c = 0; c < floatPart.length; c++){
        if(Number(floatPart[c]) >= parseInt(base_from.value)){
            output.value = "Incorrect parameters!";
            return;
        }
    }

    let indexInteger = 0;
    let indexFloat = -1;

    for(let j = integerPart.length - 1; j >= 0; j--){
        sumInteger += Number(integerPart[j]) * Math.pow(parseInt(base_from.value), indexInteger);
            indexInteger++;
    }
    for(let x = 0; x < floatPart.length; x++){
        sumFloat += Number(floatPart[x]) * Math.pow(parseInt(base_from.value), indexFloat);
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
            output.value = "Incorrect parameters!";
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
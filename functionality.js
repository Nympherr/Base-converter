

let input = document.querySelector("#input");
let convert = document.querySelector("#convert");
let output = document.querySelector("#output");
let reset = document.querySelector("#reset");
let base_from = document.querySelector("#base_from");
let base_to = document.querySelector("#base_to");

const letterValues = {
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17,
    'I': 18, 'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25,
    'Q': 26, 'R': 27, 'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33,
    'Y': 34,'Z': 35
  };


reset.addEventListener("click", function(){
    input.value = "";
    output.value = "";
    base_from.value = 10;
    base_to.value = 2;
});

convert.addEventListener("click",function() {

    if(parseInt(base_from.value) > 10){
        input.value = input.value.toUpperCase();
        letterConverter();
    }

    let input_value = parseFloat(input.value);

    if(!isNaN(input_value)){

        let integerPart = bigDecimal.floor(input_value);
        let floatPart =  bigDecimal.subtract(input_value,integerPart);

        if(floatPart == 0){
            let sum = getBase10(input_value,base_from.value);
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
        output.value = "Only numbers are allowed!"
    }
});

function letterConverter(){
    let container = input.value.split("");
    let sum = 0;
    for(let i = 0; i < container.length;i++){
        if (/[A-Z]/.test(container[i])) {
            container[i] = letterValues[container[i]];
        }
    }
    
    let index = 0;
    for(let j = container.length - 1; j >= 0; j--){
        if(container[j] != "."){
            sum += Number(container[j]) * Math.pow(parseInt(base_from.value), index);
            index++;
        }
    }
    console.log(sum);

}

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
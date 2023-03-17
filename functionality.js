let input = document.querySelector("#input");
let convert = document.querySelector("#convert");
let output = document.querySelector("#output");
let reset = document.querySelector("#reset");
let base_from = document.querySelector("#base_from");
let base_to = document.querySelector("#base_to");

reset.addEventListener("click", function(){
    input.value = "";
    output.value = "";
    base_from.value = 10;
    base_to.value = 2;
});

convert.addEventListener("click",function() {
    let input_value = parseFloat(input.value);
    let sum;
    let finalResult;

    if(!isNaN(input_value)){
        sum = base10Integer(input_value,base_from.value);
        finalResult = otherSystemInteger(sum, base_to.value);
        output.value = finalResult;
    }
    else{
        output.value = "Only numbers are allowed!"
    }
});

function base10Integer(number,base_from){

    let base_value = parseFloat(base_from);
    let number_array = number.toString().split("").reverse().map(Number);
    let sum = 0;
    for(let i = 0; i < number_array.length;i++){
        sum += number_array[i] * Math.pow(base_value, i);
    }
    return sum;
};

function otherSystemInteger(number,base_to){
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
}

function integerConvert(){
    console.log("hey");
}
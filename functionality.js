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
    if(!isNaN(input_value)){
        output.value = input_value;
    }
    else{
        output.value = "Only numbers are allowed!"
    }
});
let handleKeyInput = (event) => {
    let code = event.code;
    if (code.startsWith("Numpad")) {
        let strip = code.replace("Numpad", "");

        if (!isNaN(strip)) {
            handleNumberInput(strip);
            return;
        }

        switch(strip) {
            case "Decimal":
                handleNumberInput(".");
                break;
            case "Enter":
                handleSpecialInput("=");
                break;
            case "Add":
                handleOperatorInput("+");
                break;
            case "Subtract":
                handleOperatorInput("-");
                break;
            case "Multiply":
                handleOperatorInput("*");
                break;
            case "Divide":
                handleOperatorInput("/");
                break;
        }
    }
}

let isNumberAFloat = (number) => {
    return ((number % 1) !== 0);
}

let setInputText = (text) => {
    textInput.value = text.toString();

    if (text.length < 13) {
        textInput.style.fontSize = "64px";
    }
    else if (text.length < 17) {
        textInput.style.fontSize = "48px";
    }
    else if (text.length < 26) {
        textInput.style.fontSize = "32px";
    }
    else if (text.length < 51) {
        textInput.style.fontSize = "16px";
    }
    else if (text.length >= 51) {
        textInput.style.fontSize = "8px";
    }
}

let clearInput = () => {
    setInputText("");
    operand1 = null;
    operator = null;
    operand2 = null;
}

let deleteLastInput = () => {
    if (operand2 !== null) {
        if (operand2.length > 1) {
            operand2 = operand2.substring(0, operand2.length - 1);
            setInputText(`${operand1} ${operator} ${operand2}`);
        }
        else {
            operand2 = null;
            setInputText(`${operand1} ${operator}`);
        }
    }
    else if (operator !== null) {
        operand2 = null;
        operator = null;
        setInputText(`${operand1}`);
    }
    else if (operand1 !== null) {
        if (operand1.length > 1) {
            operand1 = operand1.substring(0, operand1.length - 1);
            setInputText(`${operand1}`);
        }
        else {
            clearInput();
        }
    }
    else {
        clearInput();
    }
}

let doMath = () => {
    if (operand1 == null || operator == null || operand2 == null) return;

    if (operand1 == "-" || operand2 == "-") return;

    if (operand2 == "0") {
        clearInput();
        setInputText("sneaky devil :(");
        return;
    }

    operand1 = Number(operand1);
    operand2 = Number(operand2);

    switch(operator) {
        case "+":
            operand1 += operand2;
            operator = null;
            operand2 = null;
            break;
        case "-":
            operand1 -= operand2;
            operator = null;
            operand2 = null;
            break;
        case "*":
            operand1 *= operand2;
            operator = null;
            operand2 = null;
            break;
        case "/":
            operand1 /= operand2;
            operator = null;
            operand2 = null;
            break;
        default:
            console.error(`Invalid operator => ${operator}`);
            break;
    }

    if (isNumberAFloat(operand1)) {
        operand1 = operand1.toFixed(2);
    }

    setInputText(operand1);
}

let handleNumberInput = (number) => {
    if (operand1 == null) {
        operand1 = number;
        setInputText(number);
    }
    else if (operator == null) {
        if (number == "." && isNumberAFloat(operand1)) return;
        operand1 += number;
        setInputText(operand1);
    }
    else if (operand2 == null) {
        operand2 = number;
        setInputText(`${operand1} ${operator} ${operand2}`);
    }
    else {
        if (number == "." && isNumberAFloat(operand2)) return;
        operand2 += number;
        setInputText(`${operand1} ${operator} ${operand2}`);
    }
}

let handleOperatorInput = (operatorInput) => {
    if (operand1 == null) return;

    if (operator == null) {
        operator = operatorInput;
        setInputText(`${operand1} ${operator}`);
    }
    else {
        doMath();
        operator = operatorInput;
        setInputText(`${operand1} ${operator}`);
    }
}

let handleSpecialInput = (specialkey) => {
    if (specialkey === "=") {
         if (operand1 == null && operator == null && operand2 == null) return;
         doMath();
    }
    else if (specialkey === "+-") {
        if (operand2 != null) {
            operand2 = operand2.toString();

            if (operand2.startsWith("-")) {
                operand2 = operand2.substring(1, operand2.length);
            }
            else {
                operand2 = `-${operand2}`;
            }
            setInputText(`${operand1} ${operator} ${operand2}`);
        }
        else if (operand2 == null && operator !== null) {
            operand2 = "-";
            setInputText(`${operand1} ${operator} ${operand2}`);
        }
        else if (operand1 !== null && operator == null) {
            operand1 = operand1.toString();

            if (operand1.startsWith("-")) {
                operand1 = operand1.substring(1, operand1.length);
            }
            else {
                operand1 = `-${operand1}`;
            }
            setInputText(`${operand1}`);
        }
    }
}

let calcBtnClicked = (event) => {
    let data = event.target.dataset;

    for (let key in data) {
        let value = data[key];

        if (key === "number") {
            handleNumberInput(value);
            break;
        }
        else if (key === "operator") {
            handleOperatorInput(value);
            break;
        }   
        else if (key === "special") {
            handleSpecialInput(value);
            break;
        }
    }
}

let operand1 = null;
let operator = null;
let operand2 = null;

let textInput = document.querySelector("#textInput");

let clearBtn = document.querySelector("#clearBtn");
clearBtn.addEventListener('click', clearInput);

let deleteBtn = document.querySelector("#deleteBtn");
deleteBtn.addEventListener('click', deleteLastInput);

let calcBtns = document.querySelectorAll("#calcBtns");
calcBtns.forEach(btn => btn.addEventListener('click', (event) => {
    calcBtnClicked(event);
}));

document.addEventListener('keyup', handleKeyInput);

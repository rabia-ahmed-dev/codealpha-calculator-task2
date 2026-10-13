// Selecting display elements
const previousOperandText = document.getElementById('previous-operand');
const currentOperandText = document.getElementById('current-operand');

const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const equalsButton = document.getElementById('equals');

let currentInput = '0';
let previousInput = '';
let operation = null;
let resetScreen = false;

// Function to update the screen display
function updateDisplay() {
    currentOperandText.innerText = currentInput;
    if (operation != null) {
        previousOperandText.innerText = `${previousInput} ${operation}`;
    } else {
        previousOperandText.innerText = '';
    }
}

// Append number or decimal point
function appendNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

// Handle operator clicks (+, -, *, /, %)
function chooseOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        compute();
    }
    operation = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

// Perform calculation logic
function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clearAll();
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = (prev * current) / 100;
            break;
        default:
            return;
    }

    currentInput = computation.toString();
    operation = null;
    previousInput = '';
    resetScreen = true;
    updateDisplay();
}

// Clear screen function (AC)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    updateDisplay();
}

// Delete last character (DEL)
function deleteNumber() {
    if (resetScreen) return;
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Event Listeners for UI buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.getAttribute('data-value'));
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperator(button.getAttribute('data-op'));
    });
});

equalsButton.addEventListener('click', () => {
    compute();
});

clearButton.addEventListener('click', () => {
    clearAll();
});

deleteButton.addEventListener('click', () => {
    deleteNumber();
});

// Bonus: Full Keyboard Support
window.addEventListener('keydown', e => {
    if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
        appendNumber(e.key);
    }
    if (e.key === '+' || e.key === '-' || e.key === '*') {
        chooseOperator(e.key);
    }
    if (e.key === '/') {
        e.preventDefault();
        chooseOperator('/');
    }
    if (e.key === 'Enter' || e.key === '=') {
        compute();
    }
    if (e.key === 'Backspace') {
        deleteNumber();
    }
    if (e.key === 'Escape') {
        clearAll();
    }
});
const entry_screen = document.querySelector('#screen');
const equation_preview = document.querySelector('#equation-preview');

const mc = document.querySelector('#MC');
const mr = document.querySelector('#MR');
const mplus = document.querySelector('#Mplus');
const mminus = document.querySelector('#Mminus');
const ms = document.querySelector('#MS');

const percent = document.querySelector('#percent');
const denominator = document.querySelector('#denominator');
const square = document.querySelector('#square');
const squareroot = document.querySelector('#squareroot');

const plus_minus = document.querySelector('#plus-minus');
const decimal = document.querySelector('#point');

const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('#equals');

const ce = document.querySelector('#CE');
const c = document.querySelector('#C');
const backspace = document.querySelector('#backspace');
const numbers = document.querySelectorAll('.numbers');

let screen_text = '';
let preview_text = '';
let result = 0;
let memory = null;
let isAnyOperatorPressed = false;
let equation = {num1: null, operator: null, num2: null};

const switchables = [
    mplus,
    mminus,
    ms,
    percent,
    denominator,
    square,
    squareroot,
    divide,
    multiply,
    subtract,
    add,
    plus_minus,
    decimal
];
function toggle_mcmr (bool) {
    if (bool) {
        mc.removeAttribute('disabled');
        mr.removeAttribute('disabled');
    } else {
        mc.setAttribute('disabled', '');
        mr.setAttribute('disabled', '');
    }
}
let areSwitchablesOn = true;
function toggle_switchables (bool, memory) {
    if (!bool) {
        for (elem of switchables) {elem.setAttribute('disabled', '');}
        toggle_mcmr(false);
    } else if (bool & memory == null) {
        for (elem of switchables) {elem.removeAttribute('disabled');}
        toggle_mcmr(false);
    } else if (bool & memory != null) {
        for (elem of switchables) {elem.removeAttribute('disabled');}
        toggle_mcmr(true);
    } else {
        console.error('toggle_switchables function returned an exception');
    }
    areSwitchablesOn = bool;
}

let reset_screen = false;
function update_main(reset, char) {
    preview_text = equation_preview.textContent;
    if (reset || entry_screen.textContent == '0') {
        entry_screen.textContent = char;
        if (char == '.') {
            entry_screen.textContent = '0.';
        }
    } else if (preview_text.includes('=')) {
        entry_screen.textContent = char;
        update_preview('off');
    } else if (!reset) {
        entry_screen.textContent += char;
    } else {
        console.error('update_main function returned an exception');
    }
    reset_screen = false;
}

function update_preview(turn, string = null) {
    if (turn == 'off') {
        equation_preview.style.opacity = '0%';
        equation_preview.textContent = 'none';
    } else if (turn == 'on' & string != null) {
        equation_preview.textContent = string;
        equation_preview.style.opacity = '100%';
    } else {
        console.error('update_preview function returned an exception');
    }
}
function solve(eq) {
    if (eq.operator == '+') {return parseFloat(eq.num1) + parseFloat(eq.num2);}
    else if (eq.operator == '-') {return parseFloat(eq.num1) - parseFloat(eq.num2);}
    else if (eq.operator == '×') {return parseFloat(eq.num1) * parseFloat(eq.num2);}
    else if (eq.operator == '÷') {
        if (eq.num2 == 0) {
            if (eq.num1 == 0) {return '0÷0';}
            else {return 'n÷0';}
        } else {return parseFloat(eq.num1) / parseFloat(eq.num2);}
    } else {
        console.error("solve() exception: equation.operator isn't matched with chosen parameters");
    }
}

// MEMORY CLEAR
mc.addEventListener('click', function() {
    memory = null;
    toggle_mcmr(false);
});
// MEMORY RECALL
mr.addEventListener('click', function() {
    preview_text = equation_preview.textContent;
    if (preview_text.includes('=')){
        update_preview('off');
    }
    update_main(true, memory);
    equation.num2 = memory;
    reset_screen = true;
    // isAnyOperatorPressed = true;
    // isAnyOperatorPressed = false;
});
// MEMORY PLUS
mplus.addEventListener('click', function() {
    if (memory != null) {memory += parseFloat(entry_screen.textContent);}
    else {
        memory = parseFloat(entry_screen.textContent);
        toggle_mcmr(true);
    }
});
// MEMORY MINUS
mminus.addEventListener('click', function() {
    if (memory != null) {memory -= parseFloat(entry_screen.textContent);}
    else {
        memory = parseFloat(entry_screen.textContent) * -1;
        toggle_mcmr(true);
    }
});
// MEMORY STORE
ms.addEventListener('click', function() {
    memory = parseFloat(entry_screen.textContent);
    toggle_mcmr(true);
    reset_screen = true;
});

// PERCENT
percent.addEventListener('click', function() {
    entry_screen.textContent *= 0.01;
});
// DENOMINATOR
denominator.addEventListener('click', function() {
    entry_screen.textContent = 1 / entry_screen.textContent;
});
// SQUARE
square.addEventListener('click', function() {
    entry_screen.textContent *= entry_screen.textContent;
    if (entry_screen.textContent == Infinity) {
        update_main(true, 'Overflow');
        toggle_switchables(false, memory);
        toggle_mcmr(false);
        reset_screen = true;
    }
});
// SQUAREROOT
squareroot.addEventListener('click', function() {
    entry_screen.textContent = Math.sqrt(entry_screen.textContent);
});

// PLUS MINUS
plus_minus.addEventListener('click', function () {
    screen_text = entry_screen.textContent;
    if (!screen_text.startsWith('-') & screen_text != '0') {
        entry_screen.textContent = '-' + screen_text;
    } else if (screen_text.startsWith('-')) {
        entry_screen.textContent = screen_text.slice(1);
    }
});
// DECIMAL POINT
decimal.addEventListener('click', function() {
    screen_text = entry_screen.textContent;
    if (!screen_text.includes('.') & !reset_screen) {
        update_main(reset_screen, '.');
    }
});

// OPERATORS
for (o of operators) {
    o.addEventListener('click', function(elem) {
        preview_text = equation_preview.textContent;
        const operatorCheck = preview_text.includes('+') || preview_text.includes('-') || preview_text.includes('×') || preview_text.includes('÷');
        if (!isAnyOperatorPressed & operatorCheck) {
            result = solve(equation);
            switch (result) {
                case 'n÷0':
                    toggle_switchables(false, memory);
                    update_preview('on', equation.num1 + ' ' + equation.operator + ' ' + equation.num2 + ' ' + elem.target.textContent);
                    update_main(true, 'Cannot divide by zero');
                    reset_screen = true;
                    break;
                case '0÷0':
                    toggle_switchables(false, memory);
                    update_preview('on', equation.num1 + ' ' + equation.operator + ' ' + equation.num2 + ' ' + elem.target.textContent);
                    update_main(true, 'Result is undefined');
                    reset_screen = true;
                    break;
                default:
                    equation.num1 = result;
                    equation.operator = elem.target.textContent;
                    update_preview('on', equation.num1 + ' ' + equation.operator);
            }
            isAnyOperatorPressed = true;
        } else {
            equation.num1 = entry_screen.textContent;
            equation.operator = elem.target.textContent;
            equation.num2 = entry_screen.textContent;
            update_preview('on', equation.num1 + ' ' + equation.operator);
            isAnyOperatorPressed = true;
        }
    });
}
// EQUALS
equals.addEventListener('click', function() {
    preview_text = equation_preview.textContent;
    result = solve(equation);
    const operatorCheck = preview_text.includes('+') || preview_text.includes('-') || preview_text.includes('×') || preview_text.includes('÷');
    if (!areSwitchablesOn) {
        equation.num1 = null;
        equation.operator = null;
        equation.num2 = null;
        toggle_switchables(true, memory);
        update_preview('off');
        update_main(true, '0')
    } else if (result == 'n÷0') {
        toggle_switchables(false, memory);
        update_preview('on', equation.num1 + ' ÷');
        update_main(true, 'Cannot divide by zero');
        reset_screen = true;
    } else if (result == '0÷0') {
        toggle_switchables(false, memory);
        update_preview('on', equation.num1 + ' ÷');
        update_main(true, 'Result is undefined');
        reset_screen = true;
    } else if (preview_text == 'none' || preview_text.includes('=') & !operatorCheck) {
        equation.num1 = entry_screen.textContent;
        update_preview('on', equation.num1 + ' =');
    } else {
        if (!isAnyOperatorPressed) {
            equation.num2 = entry_screen.textContent;
            result = solve(equation);
        }
        update_preview('on', equation.num1 + ' ' + equation.operator + ' ' + equation.num2 + ' =')
        update_main(true, result);
        equation.num1 = result;
    }
    isAnyOperatorPressed = true;
});

// CLEAR ENTRY
ce.addEventListener('click', function() {
    if (!areSwitchablesOn) {
        equation.num1 = null;
        equation.operator = null;
        equation.num2 = null;
        toggle_switchables(true, memory);
        update_preview('off');
    }
    update_main(true, '0');
});
// CLEAR
c.addEventListener('click', function() {
    if (!areSwitchablesOn) {toggle_switchables(true, memory);}
    equation.num1 = null;
    equation.operator = null;
    equation.num2 = null;
    update_preview('off');
    update_main(true, '0');
});
// BACKSPACE
backspace.addEventListener('click', function() {
    screen_text = entry_screen.textContent;
    if (!areSwitchablesOn) {
        equation.num1 = null;
        equation.operator = null;
        equation.num2 = null;
        toggle_switchables(true, memory);
        update_preview('off');
        update_main(true, '0');
    } else if (screen_text != '0' & screen_text.length != 1) {
        entry_screen.textContent = screen_text.slice(0, -1);
    } else if (screen_text.startsWith('-') || screen_text.length == 1) {
        update_main(true, '0');
    }
});
// NUMBERS
for (n of numbers) {
    n.addEventListener('click', function(elem) {
        preview_text = equation_preview.textContent;
        if (!areSwitchablesOn) {
            equation.num1 = null;
            equation.operator = null;
            equation.num2 = null;
            toggle_switchables(true, memory);
            update_preview('off');
        } else if (isAnyOperatorPressed) {
            reset_screen = true;
            isAnyOperatorPressed = false;
            equation.num2 = elem.target.textContent;
            if (preview_text.includes('=')) {
                equation.num1 = null;
                equation.operator = null;
                equation.num2 = null;
                update_preview('off');
            }
        }
        update_main(reset_screen, elem.target.textContent);
    });
}
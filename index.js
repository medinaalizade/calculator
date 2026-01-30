document.addEventListener("DOMContentLoaded", () => {
    
    const screen = document.getElementById("calculator_screen");
    const buttons = document.querySelectorAll(".btn");
    const calculatorBody = document.getElementById("calculator_body");
    const modeToggle = document.getElementById("mode_toggle");

    let expression = "";
    let isResult = false; 

    if (modeToggle) {
        modeToggle.addEventListener("click", () => {
            calculatorBody.classList.toggle("advanced");
            modeToggle.textContent = calculatorBody.classList.contains("advanced") 
                ? "Simple Mode" 
                : "Advanced Mode";
        });
    }

    function updateScreen(value) {
        screen.textContent = value || "0";
    }

    const mathTools = {
        sin: (x) => Math.sin(x * Math.PI / 180), 
        cos: (x) => Math.cos(x * Math.PI / 180),
        tan: (x) => Math.tan(x * Math.PI / 180),
        fact: (n) => {
            if (n < 0) return "Error"; 
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) result *= i;
            return result;
        }
    };

    function handleInput(value) {
        const operators = ["+", "-", "×", "÷", "*", "/", ".", "^"];
        const lastChar = expression.slice(-1);

        if (value === "AC" || value === "Escape") {
            expression = "";
            isResult = false;
            updateScreen("0");
            return;
        }

        if (value === "DEL" || value === "Backspace") {
            expression = expression.slice(0, -1);
            isResult = false;
            updateScreen(expression);
            return;
        }

        if (value === "=" || value === "Enter") {
            calculateResult();
            return;
        }

        if (isResult) {
            if (!operators.includes(value)) expression = "";
            isResult = false;
        }

        if (["sin", "cos", "tan", "log", "ln", "√"].includes(value)) {
            if (/[0-9)]/.test(lastChar)) expression += "×";
            
            expression += value + "("; 
            updateScreen(expression);
            return;
        }

        if (value === "|x|") {
            if (/[0-9)]/.test(lastChar)) expression += "×";
            expression += "abs("; 
            updateScreen(expression); 
            return; 
        }
        if (value === "x²") { expression += "^2"; updateScreen(expression); return; }
        if (value === "x^y") { expression += "^"; updateScreen(expression); return; }

        if (operators.includes(value) && operators.includes(lastChar) && value !== "-") {
            return;
        }

        expression += value;
        updateScreen(expression);
    }

    function calculateResult() {
        if (!expression) return;

        try {
            let prepared = expression
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/\^/g, "**")
                .replace(/π/g, "Math.PI")
                .replace(/e/g, "Math.E")
                .replace(/√/g, "Math.sqrt")
                .replace(/log/g, "Math.log10")
                .replace(/ln/g, "Math.log")
                .replace(/abs/g, "Math.abs");

            while (prepared.includes("!")) {
                prepared = prepared.replace(/(\d+|\([^)]+\))!/g, "fact($1)");
            }

            const openBrackets = (prepared.match(/\(/g) || []).length;
            const closeBrackets = (prepared.match(/\)/g) || []).length;
            if (openBrackets > closeBrackets) {
                prepared += ")".repeat(openBrackets - closeBrackets);
            }

            const func = new Function("sin", "cos", "tan", "fact", "return " + prepared);
            
            const result = func(mathTools.sin, mathTools.cos, mathTools.tan, mathTools.fact);
            
            if (!isFinite(result) || isNaN(result)) {
                updateScreen("Error");
            } else {
                // Round to 10 decimals to fix floating point math
                const rounded = parseFloat(result.toFixed(10));
                expression = rounded.toString();
                updateScreen(expression);
                isResult = true;
            }
        } catch (error) {
            console.error(error); // Helpful for debugging
            updateScreen("Error");
            expression = "";
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => handleInput(button.textContent));
    });

    document.addEventListener("keydown", (event) => {
        const key = event.key;
        if (key.length > 1 && !["Backspace", "Enter", "Escape"].includes(key)) return;

        if (/[0-9]/.test(key)) handleInput(key);
        else if (key === "+") handleInput("+");
        else if (key === "-") handleInput("-");
        else if (key === "*") handleInput("×");
        else if (key === "/") { event.preventDefault(); handleInput("÷"); }
        else if (key === ".") handleInput(".");
        else if (key === "(") handleInput("(");
        else if (key === ")") handleInput(")");
        else if (key === "^") handleInput("^");
        else if (key === "!") handleInput("!");
        else if (key === "Enter" || key === "=") { event.preventDefault(); handleInput("="); }
        else if (key === "Backspace") handleInput("DEL");
        else if (key === "Escape") handleInput("AC");
    });

    updateScreen("0");
});
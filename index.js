const screen = document.getElementById("calculator_screen");
const buttons = document.querySelectorAll(".btn");

let expression = "";

function updateScreen(value) {
  screen.textContent = value || "0";
}

updateScreen("0");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "AC") {
      expression = "";
      updateScreen("0");
      return;
    }

    if (value === "=") {
      try {
        const prepared = expression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/%/g, "/100");

        const result = eval(prepared);
        expression = result.toString();
        updateScreen(expression);
      } catch {
        updateScreen("Error");
        expression = "";
      }
      return;
    }

    const lastChar = expression.slice(-1);
    const operators = ["+", "-", "×", "÷", "."];

    if (operators.includes(value) && operators.includes(lastChar)) {
      return;
    }

    expression += value;
    updateScreen(expression);
  });
});

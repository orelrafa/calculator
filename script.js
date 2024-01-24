// built on and improved with the help of Tyler Potts video, stackoverflow and youtube comments for the purpose of learning about the subject:
// https://www.youtube.com/watch?v=_x8mNUBhLSk

const keys = document.querySelectorAll(".key");
console.log(keys);
const display_input = document.querySelector(".display .input");
const display_output = document.querySelector(".display .output");
console.log(display_input);
console.log(display_output);
let input = "";
for (let key of keys) {
  const value = key.dataset.key;

  key.addEventListener("click", () => {
    if (value == "clear") {
      input = "";
      display_input.innerHTML = "";
      display_output.innerHTML = "";
    } else if (value == "backspace") {
      input = input.slice(0, -1);
      display_input.innerHTML = CleanInput(input);
    } else if (value == "=") {
      let result = eval(PrepareInput(input)); //very unsafe in a more serious app
      display_output.innerHTML = CleanOutput(result);
    } else if (value == "brackets") {
      if (
        input.indexOf("(") == -1 ||
        (input.indexOf(")") != -1 &&
          input.indexOf("(") != -1 &&
          input.lastIndexOf("(") < input.lastIndexOf(")"))
      ) {
        input += "(";
      } else if (
        (input.indexOf("(") != -1 && input.indexOf(")") == -1) ||
        (input.indexOf("(") != -1 &&
          input.indexOf(")") != -1 &&
          input.lastIndexOf("(") > input.indexOf(")"))
      ) {
        input += ")";
      }
      display_input.innerHTML = CleanInput(input);
    } else {
      if (ValidateInput(value)) {
        input += value;
        display_input.innerHTML = CleanInput(input);
      }
    }
  });
}

function CleanInput(input) {
  let input_array = input.split("");
  let input_array_length = input_array.length;
  for (let i = 0; i < input_array_length; i++) {
    if (input_array[i] == "*") {
      input_array[i] = ` <span class="operator">x</span> `;
    } else if (input_array[i] == "/") {
      input_array[i] = ` <span class="operator">÷</span> `;
    } else if (input_array[i] == "+") {
      input_array[i] = ` <span class="operator">+</span> `;
    } else if (input_array[i] == "-") {
      input_array[i] = ` <span class="operator">-</span> `;
    } else if (input_array[i] == "(") {
      input_array[i] = `<span class="brackets">(</span>`;
    } else if (input_array[i] == ")") {
      input_array[i] = `<span class="brackets">)</span>`;
    } else if (input_array[i] == "%") {
      input_array[i] = `<span class="percent">%</span>`;
    }
  }

  return input_array.join("");
}

function CleanOutput(output) {
  let output_string = output.toString();
  let decimal = output_string.split(".")[1];
  output_string = output_string.split(".")[0];
  let output_array = output_string.split("");
  if (output_array.length > 3) {
    for (let i = output_array.length - 3; i > 0; i -= 3) {
      output_array.splice(i, 0, ",");
    }
  }
  if (decimal) {
    output_array.push(".");
    output_array.push(decimal);
  }
  return output_array.join("");
}

function ValidateInput(value) {
  let last_input = input.slice(-1);
  let operators = ["+", "-", "*", "/"];
  if (value == "." && last_input == ".") {
    return false;
  }
  if (value == "%" && last_input == "%") {
    return false;
  }
  if (operators.includes(value)) {
    if (operators.includes(last_input)) return false;
  } else {
    return true;
  }

  return true;
}

//credit to welson9922
function PrepareInput(input) {
  let preparedInput = input.replace(/%/g, "/100");
  let tokens = preparedInput.match(/(\d+\.\d+|\d+|\S)/g) || [];
  for (let i = 0; i < tokens.length; i++) {
    if (
      !isNaN(tokens[i]) &&
      tokens[i][0] === "0" &&
      tokens[i].length > 1 &&
      tokens[i][1] !== "."
    ) {
      tokens[i] = tokens[i].replace(/^0+/, "");
    }
  }
  return tokens.join("");
}
/*
Explanations for the regular expressions in welson's code:

/%/g

    / and / are delimiters indicating the start and end of the regular expression.
    % is the literal character '%' that the regular expression is matching.
    g is a flag that stands for global, meaning it replaces all occurrences in the input string, not just the first one.

So, /%/g matches all occurrences of '%' in the input string.


/(\d+\.\d+|\d+|\S)/g

    / and / are delimiters.

    ( and ) are used for grouping.

    \d matches any digit (0-9).

    + means "one or more" of the preceding element.

    \. matches the literal dot character.

    \S matches any non-whitespace character.

    | is an OR operator.

    (\d+\.\d+|\d+|\S) is a group that matches either:
        \d+\.\d+: one or more digits, followed by a dot, and then one or more digits (matching decimal numbers).
        \d+: one or more digits (matching integers).
        \S: any non-whitespace character.

    g is the global flag, allowing the match method to find all matches in the input string.

So, the regular expression /(\d+\.\d+|\d+|\S)/g is used to find all numeric tokens (both integers and decimals) as well as non-whitespace character tokens in the input string.
*/

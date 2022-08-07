var solverBtn = document.getElementById("solver-button");
var solverState = document.getElementById("solver-state");
var isSolverEnabled = false;

function updateSolver() {
    isSolverEnabled = localStorage.getItem("isSolverEnabled") === "true";
    console.log("Is Solver Enabled? " + isSolverEnabled);
    if (isSolverEnabled) {
        solverBtn.src = "images/button-on.png";
        solverState.style.color = "#00ff00";
        solverState.innerText = "on";
    } else {
        solverBtn.src = "images/button-off.png";
        solverState.style.color = "#ff0000";
        solverState.innerText = "off";
    }
}

function toggleSolver() {
    isSolverEnabled = !(localStorage.getItem("isSolverEnabled") === "true");
    localStorage.setItem("isSolverEnabled", isSolverEnabled);
    updateSolver();
}

solverBtn.addEventListener("click", toggleSolver);
updateSolver();

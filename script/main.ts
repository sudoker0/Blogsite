var oldInp: {[name: string]: string} = {}

document.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("keydown", (_) => oldInp[inp.id] = inp.value)
    inp.addEventListener("input", (_) => inp.value = inp.validity.valid ? inp.value : oldInp[inp.id])
});
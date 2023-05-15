function appendCheckboxes(form, names) {
    for (const name of names) {
        const checkbox = document.createElement("input")
        const label = document.createElement("label")
        
        checkbox.type = "checkbox"
        checkbox.value = name
        label.innerText = name

        form.appendChild(checkbox)
        form.appendChild(label)
    }
}


function appendRanges(form, names) {
    for (const name of names) {
        const container = document.createElement("div")
        const range = document.createElement("input")
        const pValue = document.createElement("p")
        const label = document.createElement("label")
        
        range.type = "range"
        label.innerText = name

        range.addEventListener("input", () => {
            pValue.innerText = range.value
        })
    
        container.appendChild(pValue)
        container.appendChild(range)
        container.appendChild(label)

        form.appendChild(container)
    }
}


export { appendCheckboxes, appendRanges }
function showCapElement() {
    const capElement = document.getElementById('cap');
    const uncapElement = document.getElementById('uncap');
    if (capElement) {
        capElement.style.display = 'block';
        uncapElement.style.display = 'none';
    } else {
        console.log("Element with id 'cap' not found.");
    }
}

    window.addEventListener('keydown', function(event) {
    if (event.key === 'x') {
        showCapElement();
    }
});
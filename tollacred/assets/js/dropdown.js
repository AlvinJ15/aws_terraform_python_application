document.addEventListener('DOMContentLoaded', function () {
    const selectBox = document.querySelector('.select-box');
    const searchTagsInput = document.querySelector('.search-tags');
    const clearButton = document.querySelector('.clear');
    const options = document.querySelector('.options');

    selectBox.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the click event from reaching the document
        toggleOptions();
    });

    document.addEventListener('click', function () {
        options.style.display = 'none';
    });

    searchTagsInput.addEventListener('input', function () {
        filterOptions(searchTagsInput.value);
    });

    clearButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the click event from reaching the document
        clearSelection();
    });

    function toggleOptions() {
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    }

    function filterOptions(value) {
        const optionElements = document.querySelectorAll('.option');
        optionElements.forEach(function (option) {
            const optionText = option.textContent.toLowerCase();
            const isMatch = optionText.includes(value.toLowerCase());
            option.style.display = isMatch ? 'block' : 'none';
        });

        const noResultMessage = document.querySelector('.result-message');
        noResultMessage.style.display = optionElements.length === 0 ? 'block' : 'none';
    }

    function clearSelection() {
        const selectedOptions = document.querySelector('.selected-options');
        selectedOptions.innerHTML = '';
        const dropdown = document.querySelector('.custom-select');
        dropdown.classList.remove('open');
    }
});


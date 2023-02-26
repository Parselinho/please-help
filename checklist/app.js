
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registrar');
    const input = form.querySelector('input');
    const mainDiv = document.querySelector('.main');
    const ul = document.querySelector('#invitedList');
  
  
  
    const div = document.createElement('div');
    const filterLabel = document.createElement('label');
    const filterCheckBox = document.createElement('input');
  
    filterLabel.textContent = 'Hide those who haven\'t responded';
    filterCheckBox.type = 'checkbox';
    div.append(filterLabel, filterCheckBox);
    mainDiv.insertBefore(div, ul);
    filterCheckBox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        const lis = ul.children;
        if (isChecked) {
            for (let i = 0; i < lis.length; i++) {
                let li = lis[i]
                let liChild = li.children[1];
                console.log(liChild);
                if (li.className === 'responded') {
                    li.style.display = '';
                    liChild.style.display = 'none';
                } else {
                    li.style.display = 'none';
                    liChild.style.display = '';
                }
            }
        } else {
            for (let i = 0; i < lis.length; i++) {
                let li = lis[i]
                let liChild = li.children[1];
                li.style.display = '';
                liChild.style.display = '';
            }
        }
    })
    function createLI() {
        function createElement(elementName, prop, value) {
            const element = document.createElement(elementName);
            element[prop] = value;
            return element;
        }
  
        const li = document.createElement('li');
        const span = createElement('span', 'textContent', input.value)
        const removeButton = createElement('button', 'textContent', 'remove');
        const editButton = createElement('button', 'textContent', 'edit');
        const label = createElement('label', 'textContent', 'Confirm');
        const checkbox = createElement('input', 'type', 'checkbox');
        storageNames();
        label.append(checkbox);
        li.append(span, label, editButton, removeButton);
        return li;
    }
  
    function storageNames() {
        const storedNames = localStorage.getItem('names');
        let namesArr = storedNames ? JSON.parse(storedNames) : [];
        namesArr.push(input.value);
        localStorage.setItem('names', JSON.stringify(namesArr));
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (checkDuplicate() === true) {
            alert('fuck you we have this name');
        } else if (input.value === '') {
            alert('Enter Name')
        } else {
        const li = createLI();
        ul.append(li);
        input.value = '';
        }
    })
  
    function checkDuplicate() {
        let li = ul.children;
        for (let i =0; i < li.length; i++) {
            if (input.value === li[i].firstChild.textContent) {
                return true;
            } else 
            return false;
        }
    }
    ul.addEventListener('change', (e) => {
        const checkbox = e.target;
        const newLi = checkbox.parentNode.parentNode;
        const label = checkbox.parentNode;
        if (checkbox.checked) {
            newLi.className = 'responded';
            label.textContent = 'Confirmed';
            label.append(checkbox)
        } else {
            newLi.className = '';
            label.textContent = 'Confirm';
            label.append(checkbox)
        }
    })
    ul.addEventListener('click', (e) => {
        const li = e.target.parentNode;
        const ul = li.parentNode;
        const button = e.target;
        const action = button.textContent;
        const nameActions = {
            remove: () => {
                ul.removeChild(li); 
            },
            edit: () => {
                const span = li.querySelector(':first-child');
                const liInput = document.createElement('input');
                liInput.type = 'text';
                liInput.value = span.textContent;
                li.insertBefore(liInput, span)
                li.removeChild(span);
                button.textContent = 'save';
            },
            save: () => {
                const liInput = li.firstElementChild;
                const span = document.createElement('span');
                span.textContent = liInput.value;
                li.insertBefore(span, liInput);
                li.removeChild(liInput);
                button.textContent = 'edit';
            }
        };
        if (nameActions.hasOwnProperty(action)) {
            nameActions[action]();
        }
    });
  });
  
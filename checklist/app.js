
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


    // log the input value to new Li (created <li>), create label and checkbox aswell
    createStorageList()
    
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
        label.append(checkbox);
        // checkbox.addEventListener('change', () => {
        //     label.textContent = checkbox.checked ? 'Confirmed' : 'Confirm';
        //     label.append(checkbox);
        //   });
        li.append(span, label, editButton, removeButton);
        return li;
    }

    function getLocalGuestList() {
        const guests = localStorage.getItem('guestList');
        if (guests) {
          return JSON.parse(guests);
        }
        return [];
      }
      
      //create initial list from local storage
      function createStorageList() {
        const guestList = getLocalGuestList();
        guestList.forEach(name => {
          const li = createLI(name)
          ul.appendChild(li);
        });
      }
      //Remove guest from local storage
      function removeGuestFromStorageList(localGuest) {
        const guestList = getLocalGuestList();
        const newList = guestList.filter(guest => guest != localGuest)
        localStorage.setItem('guestList', JSON.stringify(newList));
      }

// add conditional for empty strings, duplicate names, numbers name
// also add another textcontent to checkbox before checking it
    form.addEventListener('submit', (e) => {
        const guestList = getLocalGuestList();
        e.preventDefault();
        const text = input.value;
        guestList.push(text)
            localStorage.setItem('guestList', JSON.stringify(guestList));
        if (checkDuplicate() === true) {
            alert('We have this name');
        } else if (input.value === '') {
            alert('Enter Name')
        } else {
            // guestList.push(text)
            // localStorage.setItem('guestList', JSON.stringify(guestList));
            const li = createLI(text);
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
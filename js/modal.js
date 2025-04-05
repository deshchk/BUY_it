import { isValidURL, notify } from "./utility.js"

const modalHtml = obj => {return `
    <div class="modal-guts">
        <div class="modal-name-and-amount">
            <input type="text" class="modal-name" placeholder="item name" aria-label="item's name" value='${
                obj ? obj.name : ''
            }'>
                <span class="modal-amount-x">x</span>
            <input type="number" class="modal-amount" placeholder="1" min="1" max="999" maxlength="4" aria-label="item's amount" value="${
                obj ? obj.amount : ''
            }">
        </div>
        <input type="text" class="modal-note" placeholder="description" aria-label="item's description" value="${
            obj ? obj.note : ''
        }">
        <div class="modal-priority-and-tags">
            <input type="text" class="modal-tags" placeholder="tags (coma , separated)" aria-label="item's tags" value="${
                obj ? obj.tags : ''
            }">
            <select id="modal-priority" aria-label="item's priority" value="${obj ? obj.priority : ''}" required>
                <option value="" ${obj ? '' : 'selected'} disabled>priority</option>
                <option value="1" ${obj && obj.priority === '1' ? 'selected' : ''}>normal</option>
                <option value="2" ${obj && obj.priority === '2' ? 'selected' : ''}>high</option>
                <option value="3" ${obj && obj.priority === '3' ? 'selected' : ''}>highest</option>
            </select>
        </div>
        <input type="url" id="modal-url" placeholder="https://example-shop.com" aria-label="item's url" value="${
                obj ? obj.url : ''
        }">
            <button type="button" aria-label="done" id="modal-done">
                <span class="material-symbols-outlined">
                    done
                </span>
            </button>
    </div>
`}

// OPENING the MODAL
export function openModal(obj) {
    const dialog = document.createElement('dialog')
    dialog.id = 'item-modal'
        if (obj) {
            dialog.innerHTML = modalHtml(obj)
            dialog.dataset.uuid = obj.uuid
        } else {
            dialog.innerHTML = modalHtml()
        }
    document.body.appendChild(dialog)

    document.querySelector('#item-modal').showModal()
    if (obj) {
	    document.querySelector('.modal-name').blur()
    } else {
        document.querySelector('.modal-name').focus()
    }
}

// ADDING THE ITEM
export function addItemTo(targetList) {
	const name = document.querySelector('#item-modal .modal-name').value
	const amount = document.querySelector('#item-modal .modal-amount').value
	const note = document.querySelector('#item-modal .modal-note').value
    const tags = document.querySelector('#item-modal .modal-tags').value.trim().replace(/\s\#/g, ', ')
	const priority = document.querySelector('#item-modal #modal-priority').value
	const url = document.querySelector('#item-modal #modal-url').value

	// DOES THIS NAME ALREADY EXIST?
	const existingNames = array => {
		document.querySelectorAll(`#${targetList.list} .item-name`).forEach(node => {
			return array.push(node.innerText.toLowerCase())
		})
		return array
	}

	// IF EXISTS – DONT'T ADD but NOTIFY
	if (existingNames([]).includes((name).toLowerCase())) {
		notify('This name already exists')
	} else if (url && !isValidURL(url)) {
        notify('Provided link is invalid')
    } else if (name !== '') {
		targetList.addItem(name, (amount || 1), note, tags, (priority || 1), url)
	}
}

// EDITING an ITEM
export function editItemIn(targetList, itemID) {
    targetList.listData.forEach(obj => {
        if (Object.values(obj).includes(itemID)) {
            openModal(obj)
        }
    })
}






// DEPLOY HELP MODAL
export function help() {
    const dialog = document.createElement('dialog')
    dialog.id = 'help-modal'
    dialog.innerHTML = `
        <img src="./img/icon/android-chrome-192x192.png" alt="BUY_it logo" class="logo-img">
        <small class="help-version">v1.2</small>

        <div class="item-functions">
            <p>
                <b>1.</b> Clicking on an item <em>checks&nbsp;it</em>. Another click unchecks.
            </p>
            <img src="./img/item-check.png" alt="an example picture of a checked item">
            
            <p>
                <b>2.</b> You can <em>edit</em> and <em>delete</em> items. Just swipe them to&nbsp;the&nbsp;side (or&nbsp;use Shift&nbsp;+&nbsp;scroll) to&nbsp;reveal the functions.
            </p>
            <img src="./img/item-functions.png" alt="an example picture of available item functions">

            <p>
                <b>3.</b> <em>Filter</em> and show only the items you want to see using <em>tags</em>, <em>checking</em> and their <em>priority</em>.
            </p>
            <img src="./img/filters-example.png" alt="an example picture of filtering items">
        </div>

        <small class="help-author">
            Author: <a href="https://deszczak.work" target="_blank" >Daniel Leszczak</a>
            <br>
            <span class="help-feedback">I'd love to hear your feedback :)</span>
        </small>
    `

    document.body.appendChild(dialog)

    document.querySelector('#help-modal').showModal()
    document.activeElement.blur()
}

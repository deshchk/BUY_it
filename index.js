import List from "./js/List.js"
import { help, openModal, addItemTo, editItemIn } from "./js/modal.js"
import { showFiltered, parentItemID } from "./js/utility.js"

let modalOpen = false
let helpOpen = false
let newItem = true
let currentTag


// –––––––––––––––––––––––––––––––––––––––– FUNCTIONS ––––––––––––––––––––––––––––––––––––––––––


// RENDER the LISTS
function render() {
	const isData = (!!localStorage.getItem('list'))
	if (isData || modalOpen) {
		document.querySelector(`#list`).innerHTML = list.getListHTML()
	}
	if (!isData) {
		document.querySelector(`#list`).innerHTML = `
			<div class="nothing">There are no items yet <span>🛒</span></div>
		`
	}

showFiltered(currentTag)
	document.querySelector('#current-tag').innerText = currentTag ? currentTag : '...'
modalOpen = false
helpOpen = false
}

// TOGGLE MODAL
function toggleModal() {
	if (!modalOpen && newItem) { 
		openModal()
		modalOpen = !modalOpen
	} else if (newItem) {
		document.querySelector('#item-modal').close()
		document.querySelector('#item-modal').remove()
		render()
	}
}

// TOGGLE HELP MODAL
function toggleHelp() {
	if (!helpOpen) { 
		help()
		helpOpen = !helpOpen
	} else {
		document.querySelector('#help-modal').close()
		document.querySelector('#help-modal').remove()
		render()
	}
}


// –––––––––––––––––––––––––––––––––––––––– LISTENERS ––––––––––––––––––––––––––––––––––––––––––

// GLOBAL ––– RELOAD on _DOUBLECLICK_TITLE_
document.addEventListener('dblclick', e => {
	if (e.target === document.querySelector('h1')) {
		location.reload()
	}
})


// M O D A L   E V E N T S   L I S T E N E R S
	// MODAL ––– OPENING and CLOSING on _CLICK_
	document.addEventListener('click', e => {
		if (e.target === document.body || 
			e.target === document.querySelector('main') || 
			e.target === document.querySelector('.nothing') || 
			e.target.contains(document.querySelector('.nothing')) ||
			e.target === document.querySelector('#add-item') || 
			e.target.parentElement === document.querySelector('#add-item') ||
			e.target === document.querySelector('#item-modal')) {

			toggleModal()
		}
	})
	// MODAL ––– OPENING, ADDING and CLOSING on _ENTER_
	document.addEventListener('keydown', e => {
		if (modalOpen && newItem && e.key === 'Enter' && 
		   (document.querySelector('#modal-priority') !== document.activeElement)) {
			addItemTo(list)
			toggleModal()
		} else if (!modalOpen && e.key === 'Enter') {
			toggleModal()
		}	
	})
	// MODAL ––– CLOSING on _ESCAPE_
	document.addEventListener('keydown', e => {
		if (modalOpen && e.key === 'Escape') {
			newItem = true
			toggleModal()
		}
	})

	// MODAL ––– ADDING ITEM on _CLICK_DONE_
	document.addEventListener('click', e => {
		const done = document.querySelector('#modal-done')
		
		if (modalOpen && newItem && (e.target === done || e.target.parentElement === done)) {
			addItemTo(list)
			toggleModal()
		}
	})

	// H E L P
	// HELP MODAL ––– OPENING and CLOSING on _CLICK_
	document.addEventListener('click', e => {
		if (e.target === document.querySelector('#help') || 
			e.target.parentElement === document.querySelector('#help') ||
			e.target === document.querySelector('#help-modal')) {

			toggleHelp()
		}
	})



// F I L T E R I N G
	// FILTER PRIORITY
	document.addEventListener('change', e => {
		if (e.target === document.querySelector('#filter-priority')) {
			if (e.target.value < 1) {
				document.querySelector('#filter-priority').selectedIndex = 0
			}
			showFiltered(currentTag)
		}
	})

	// FILTER CHECKED
	document.addEventListener('change', e => {
		if (e.target === document.querySelector('#filter-check')) {
			if (e.target.value < 1) {
				document.querySelector('#filter-check').selectedIndex = 0
			}
			showFiltered(currentTag)
		}
	})

	// RESET FILTERING ON _CLICK_TITLE_
	document.addEventListener('click', e => {
		if (e.target === document.querySelector('h1.title')) {
			if (document.querySelector('#filter-priority').value > 0 || currentTag || document.querySelector('#filter-check').value > 0) {
				document.querySelector('#filter-priority').selectedIndex = 0
				document.querySelector('#filter-check').selectedIndex = 0
				currentTag = false
				render()
			}
		}
	})

	// FILTER TAGS
	document.addEventListener('click', e => {
		if (e.target.classList.contains('item-tag')) {
			if (currentTag === e.target.innerText) {
				showFiltered(currentTag)
			} else {
				currentTag = e.target.innerText
				document.querySelector('#current-tag').innerText = currentTag ? currentTag : '...'
				document.querySelector('#filter-priority').selectedIndex = 0
				document.querySelector('#filter-check').selectedIndex = 0
				showFiltered(currentTag)
			}
		}
	})



// I T E M   E V E N T S   L I S T E N E R S
	// REMOVE ITEM on _CLICK_REMOVE_
	document.addEventListener('click', e => {
		if (e.target.classList.contains('remove-item') || 
			e.target.parentElement?.classList.contains('remove-item')) {

			const itemID = e.target.parentElement.id === '' ? 
			e.target.parentElement.parentElement.id : e.target.parentElement.id

			list.removeItem(itemID)
			render()
		}
	})
	// REMOVE ITEM on _DOUBLECLICK_SEE_
	document.addEventListener('dblclick', e => {
		if (e.target.className === 'see-item') {
			const itemID = e.target.parentElement.id

			list.removeItem(itemID)
			render()
		}
	})

	// EDIT ITEM on _CLICK_EDIT_
	document.addEventListener('click', e => {
		if (e.target.classList.contains('edit-item') || 
			e.target.parentElement?.classList.contains('edit-item')) {

			
			newItem = false

			editItemIn(list, parentItemID(e))
			modalOpen = !modalOpen
		}
	})
	// EDIT ITEM ––– APPLYING CHANGES and CLOSING EDIT MODAL on _CLICK_
	document.addEventListener('click', e => {
		const done = document.querySelector('#modal-done')

		if (e.target === document.querySelector('#item-modal')) {
			newItem = true
			toggleModal()
		}
		if (!newItem && (e.target === done || e.target.parentElement === done)) {
			const uuid = document.querySelector('#item-modal').dataset.uuid

			list.editItem(uuid)
			newItem = true
			toggleModal()
		}
	})

	// CHECK ITEM on _CLICK_
	document.addEventListener('click', e => {
		if (e.target.classList.contains('list-item') || e.target.classList.contains('see-item') || 
			e.target.classList.contains('item-about') || e.target.classList.contains('item-name-and-amount') || 
			e.target.classList.contains('item-name') || e.target.classList.contains('item-amount') || 
			e.target.classList.contains('item-note')) {

			list.checkItem(parentItemID(e))
			render()
		}
	})



// –––––––––––––––––––––––––––––––––––––––– INIT ––––––––––––––––––––––––––––––––––––––––––


// SERVICE WORKER
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
	  navigator.serviceWorker.register('./sw.js').then(function(registration) {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope)
	  }, function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err)
	  })
	})
  }

const list = new List('list')
render()
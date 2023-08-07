// DEPLOY NOTIFICATION
export function notify(text) {
	const div = document.createElement('div')
	div.classList.add('notification', 'alert')
	div.textContent = text
	document.querySelector('body').appendChild(div)

	setTimeout(() => {
		document.querySelectorAll('.notification.alert').forEach(notification => {
			notification.remove()
		})
	}, 2500)
}



// FILTER THE LIST
export function showFiltered(tag) {
	const allItems = document.querySelectorAll('.list-item')

	const priority = Number(document.querySelector('#filter-priority').value)
	const checked = Number(document.querySelector('#filter-check').value)

	const isHigh = el => el.querySelector('.item-name-and-amount').classList.contains('priority-2')
	const isHighest = el => el.querySelector('.item-name-and-amount').classList.contains('priority-3')
	const isNormal = el => !isHigh(el) && !isHighest(el)

	const isTagged = el => Array.from(el.querySelectorAll('.item-tag')).some(node => node.innerText === tag)

	const isChecked = el => el.classList.contains('checked')

	const isFiltered = () => Array.from(allItems).filter(item => {
		if (checked === 1) {
			if (priority === 1) {
				return tag ? isNormal(item) && isTagged(item) && isChecked(item) : isNormal(item) && isChecked(item)
			} else if (priority === 2) {
				return tag ? isHigh(item) && isTagged(item) && isChecked(item) : isHigh(item) && isChecked(item)
			} else if (priority === 3) {
				return tag ? isHighest(item) && isTagged(item) && isChecked(item) : isHighest(item) && isChecked(item)
			} else {
				return tag ? isTagged(item) && isChecked(item) : isChecked(item)
			}
		} else if (checked === 2) {
			if (priority === 1) {
				return tag ? isNormal(item) && isTagged(item) && !isChecked(item) : isNormal(item) && !isChecked(item)
			} else if (priority === 2) {
				return tag ? isHigh(item) && isTagged(item) && !isChecked(item) : isHigh(item) && !isChecked(item)
			} else if (priority === 3) {
				return tag ? isHighest(item) && isTagged(item) && !isChecked(item) : isHighest(item) && !isChecked(item)
			} else {
				return tag ? isTagged(item) && !isChecked(item) : !isChecked(item)
			}
		} else {
			if (priority === 1) {
				return tag ? isNormal(item) && isTagged(item) : isNormal(item)
			} else if (priority === 2) {
				return tag ? isHigh(item) && isTagged(item) : isHigh(item)
			} else if (priority === 3) {
				return tag ? isHighest(item) && isTagged(item) : isHighest(item)
			} else {
				return tag ? isTagged(item) : true
			}
		}
	})

	allItems.forEach(item => {
		Array.from(isFiltered()).includes(item) ? item.style.display = 'flex' : item.style.display = 'none'
	})
}



// CHECK IF x IS A VALID URL
export const isValidURL = string => {
	try { 
		return Boolean(new URL(string)); 
	}
	catch(e){ 
		return false; 
	}
}



// FIND ITEM'S ID DIGGING THROUGH an ELEMENT'S PARENTS
export const parentItemID = e => {
	let target = e.target
	while (target && !target.id) { target = target.parentElement }
	return target ? target.id : e.target.id
}
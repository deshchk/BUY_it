import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid/+esm'
import { isValidURL, notify } from './utility.js'
import ListItem from './ListItem.js'

export default class List {
	constructor(list) {
		this.list = list
		this.listData = JSON.parse(localStorage.getItem(this.list)) || []
	}

	getListHTML() {
		const listHtml = this.listData.map(itemData => {
			return new ListItem(itemData).getHTML()
		}).join('')
		return listHtml
	}

	checkItem(itemID) {
		this.listData.forEach(obj => {
			if (Object.values(obj).includes(itemID)) {
				this.listData[this.listData.indexOf(obj)].isChecked = !obj.isChecked
			}
		})
		localStorage.setItem(this.list, JSON.stringify(this.listData))
	}

	addItem(name, amount, note, tags, priority, url) {
		this.listData.push({
			uuid: uuidv4(),
			name: name,
			amount: amount,
			note: note,
			tags: tags.replace(/#/g, ""),
			priority: priority,
			url: url,
			isChecked: false
		})
		localStorage.setItem(this.list, JSON.stringify(this.listData))
	}

	removeItem(itemID) {
		this.listData.forEach(obj => {
			if (Object.values(obj).includes(itemID)) {
				localStorage.setItem(this.list, JSON.stringify(this.listData.toSpliced(this.listData.indexOf(obj), 1)))
			}
		})
		this.listData = JSON.parse(localStorage.getItem(this.list))
	}

	editItem(itemID) {
		this.listData.forEach(obj => {
			if (Object.values(obj).includes(itemID)) {
				const name = document.querySelector('#item-modal .modal-name').value
				const amount = document.querySelector('#item-modal .modal-amount').value
				const note = document.querySelector('#item-modal .modal-note').value
				const tags = document.querySelector('#item-modal .modal-tags').value.trim().replace(/\s\#/g, ', ')
				const priority = document.querySelector('#item-modal #modal-priority').value
				const url = document.querySelector('#item-modal #modal-url').value

				// DOES THIS NAME ALREADY EXIST?
				const existingNames = array => {
					this.listData.forEach(obj => {
						return array.push(obj.name.toLowerCase())
					})
					return array.filter(name => name !== obj.name.toLowerCase())
				}

				// IF EXISTS – DONT'T ADD but NOTIFY
				if (existingNames([]).includes((name).toLowerCase())) {
					notify('This name is already on the list')
					console.log(existingNames([]))
				} else if (url && !isValidURL(url)) {
					notify('Provided link is invalid')
				} else if (name !== '') {
					this.listData[this.listData.indexOf(obj)] = {
						uuid: itemID,
						name: name,
						amount: amount || 1,
						note: note,
						tags: tags.replace(/#/g, ""),
						priority: priority || 1,
						url: url,
						isChecked: obj.isChecked
					}
				}
			}
		})
		localStorage.setItem(this.list, JSON.stringify(this.listData))
	}
}
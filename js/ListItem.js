export default class ListItem {
	constructor(data) {
		Object.assign(this, data)
	}

	getHTML() {
		const { uuid, name, amount, note, tags, priority, url, isChecked } = this

		return `
			<li class="list-item scroll-inline ${isChecked ? 'checked' : ''}" id="${uuid}">
				<div class="see-item">
					<div class="item-about">
						<div class="item-name-and-amount ${priority > 1 ? `priority-${priority}` : ''}">
							<span class="item-name">${name}</span>
							${amount > 1 ?
								`<span class="item-amount"> ${amount}</span>` : ''
							}
						</div>
						${note ?
							`<span class="item-note">${note}</span>` : ''
						} 
						${tags ?
							`<div class="item-tags">
								${
									tags.split(',').map(tag => {
										return `<span class="item-tag">${tag.trim().replace(/\s+/g, '_')}</span>`
									}).join(' ')
								}
							</div>` : ''
						}
					</div>
					${url ?
						`<a href="${url}" target="_blank" class="item-function item-link">
							<span class="material-icon">
								link
							</span>
						</a>` : ''
					}
				</div>
				<div class="item-function edit-item">
					<span class="material-icon">
						help
					</span>
				</div>
				<div class="item-function remove-item">
					<span class="material-icon">
						delete
					</span>
				</div>
			</li>
		`
	}
}
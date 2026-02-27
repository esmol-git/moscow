// Подключение функционала "Чертоги Фрилансера"
import { addTouchAttr, bodyLockStatus, bodyLockToggle, FLS } from "@js/common/functions.js"

import './menu.scss'

export function menuInit() {
	document.addEventListener("click", function (e) {
		// Клик по бургеру — открыть/закрыть
		if (bodyLockStatus && e.target.closest('[data-fls-menu]')) {
			bodyLockToggle()
			document.documentElement.toggleAttribute("data-fls-menu-open")
			return
		}
		// Клик вне меню (оверлей или снаружи) — закрыть
		if (document.documentElement.hasAttribute("data-fls-menu-open") && bodyLockStatus) {
			if (!e.target.closest('.menu__body') && !e.target.closest('[data-fls-menu]')) {
				bodyLockToggle()
				document.documentElement.removeAttribute("data-fls-menu-open")
			}
		}
	})
}

document.querySelector('[data-fls-menu]') ?
	window.addEventListener('load', menuInit) : null

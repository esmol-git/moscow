// Подключение функционала "Чертоги Фрилансера"
import { addTouchAttr, addLoadedAttr, isMobile, FLS } from "@js/common/functions.js"
// Плавная прокрутка по якорям и подсветка пункта меню при скролле
import "@components/effects/scrollto/scrollto.js"
import "@components/effects/watcher/watcher.js"
// Параллакс и эффект ripple на кнопках
import "@components/effects/parallax/parallax.js"
import "@components/effects/ripple/ripple.js"

// Селект города в хедере: значение из main[data-city], при смене — переход по data-url-{city}
function initHeaderCitySelect() {
	const select = document.querySelector('[data-fls-city-select]')
	const main = document.querySelector('main[data-city]')
	if (!select) return
	if (main) select.value = main.dataset.city
	select.addEventListener('change', () => {
		const city = select.value
		const key = 'url' + city.charAt(0).toUpperCase() + city.slice(1)
		const url = select.dataset[key]
		if (url && url !== '#') window.location.href = url
	})
}
initHeaderCitySelect()

// Динамический год в футере
function initFooterYear() {
	document.querySelectorAll('.footer__year').forEach((el) => {
		el.textContent = new Date().getFullYear()
	})
}
initFooterYear()

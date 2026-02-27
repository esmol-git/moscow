// Форма заявки и маска телефона
import '@components/forms/form/form.js'
import '@components/forms/input/plugins/mask.js'
// FAQ — спойлеры
import '@components/layout/spollers/spollers.js'
// Счётчики при скролле
import '@components/layout/digcounter/digcounter.js'

// Слайдер в герое (смена фраз) и слайдер объектов
import Swiper from 'swiper'
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules'
import '@components/layout/slider/slider.scss'

function initHeroSlider() {
	const el = document.querySelector('[data-fls-hero-slider]')
	if (!el) return
	new Swiper(el, {
		modules: [Autoplay, EffectFade, Pagination],
		effect: 'fade',
		fadeEffect: { crossFade: true },
		slidesPerView: 1,
		spaceBetween: 0,
		speed: 600,
		loop: true,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
		},
		pagination: {
			el: el.querySelector('.hero__slider-pagination'),
			clickable: true,
		},
	})
}

window.addEventListener('load', initHeroSlider)

// Табы в hero: Покупка / Аренда / Ипотека
function initHeroTabs() {
	const block = document.querySelector('[data-fls-hero-tabs]')
	if (!block) return
	const buttons = block.querySelectorAll('.hero__tab-btn')
	const panels = block.querySelectorAll('.hero__tab-panel')
	buttons.forEach((btn, i) => {
		btn.addEventListener('click', () => {
			buttons.forEach((b, j) => {
				b.classList.toggle('hero__tab-btn--active', j === i)
				b.setAttribute('aria-selected', j === i)
			})
			panels.forEach((p, j) => {
				const active = j === i
				p.classList.toggle('hero__tab-panel--active', active)
				p.hidden = !active
			})
		})
	})
}
window.addEventListener('load', initHeroTabs)

// Кнопка «Наверх»: показ после скролла, клик — плавный скролл вверх
function initToTop() {
	const btn = document.querySelector('[data-fls-to-top]')
	if (!btn) return
	const showAfter = 900 // показывать кнопку «Наверх» после прокрутки 900px
	function updateVisibility() {
		btn.classList.toggle('page__to-top--visible', window.scrollY > showAfter)
	}
	updateVisibility()
	window.addEventListener('scroll', updateVisibility, { passive: true })
	btn.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	})
}
initToTop()

// Каталог объектов: переключатель «Плитки» / «Слайдер»
function initObjectsView() {
	const section = document.querySelector('.objects')
	const wrap = document.querySelector('[data-fls-objects-view]')
	if (!section || !wrap) return
	const buttons = wrap.querySelectorAll('.objects__view-btn')
	const gridBlock = document.querySelector('[data-objects-content="grid"]')
	const sliderBlock = document.querySelector('[data-objects-content="slider"]')
	buttons.forEach((btn) => {
		btn.addEventListener('click', () => {
			const view = btn.dataset.objectsView
			section.classList.toggle('--slider-view', view === 'slider')
			buttons.forEach((b) => {
				const active = b === btn
				b.classList.toggle('objects__view-btn--active', active)
				b.setAttribute('aria-selected', active)
			})
			if (gridBlock) gridBlock.hidden = view === 'slider'
			if (sliderBlock) sliderBlock.hidden = view !== 'slider'
		})
	})
	// Изначально слайдер скрыт
	if (sliderBlock) sliderBlock.hidden = true
}
initObjectsView()

// Слайдер объектов (карточки)
function initObjectsSlider() {
	const el = document.querySelector('[data-fls-objects-slider]')
	if (!el) return
	new Swiper(el, {
		modules: [Navigation, Pagination],
		slidesPerView: 1,
		spaceBetween: 16,
		speed: 400,
		loop: true,
		breakpoints: {
			480: { slidesPerView: 2, spaceBetween: 20 },
			768: { slidesPerView: 2, spaceBetween: 24 },
			992: { slidesPerView: 3, spaceBetween: 24 },
		},
		pagination: {
			el: el.querySelector('.objects__slider-pagination'),
			clickable: true,
		},
		navigation: {
			prevEl: el.querySelector('.objects__slider-prev'),
			nextEl: el.querySelector('.objects__slider-next'),
		},
	})
}
window.addEventListener('load', initObjectsSlider)

// Фикс мерцания: один раз показанные секции остаются видимыми (класс reveal-done)
document.addEventListener('watcherCallback', (e) => {
	const { entry } = e.detail || {}
	if (!entry?.isIntersecting) return
	const el = entry.target
	if (el?.classList?.contains('reveal')) el.classList.add('reveal-done')
})

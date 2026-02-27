// Подключение функционала "Чертоги фрилансера
import { gotoBlock, FLS } from "@js/common/functions.js";
// Подключение функционала модуля форм
import { formValidate } from "../_functions.js";

import './form.scss'

function formInit() {
	// Отправка форм
	function formSubmit() {
		const forms = document.forms;
		if (forms.length) {
			for (const form of forms) {
				// Убираем встроенную валидацию
				!form.hasAttribute('data-fls-form-novalidate') ? form.setAttribute('novalidate', true) : null
				// Событие отправки
				form.addEventListener('submit', function (e) {
					const form = e.target;
					formSubmitAction(form, e);
				});
				// Событие очистки
				form.addEventListener('reset', function (e) {
					const form = e.target;
					formValidate.formClean(form);
				});
			}
		}
		async function formSubmitAction(form, e) {
			const error = formValidate.getErrors(form)
			if (error === 0) {
				if (form.dataset.flsForm === 'ajax') { // Если режим ajax
					e.preventDefault();
					const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
					const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
					const formData = new FormData(form);
					form.classList.add('--sending');
					const response = await fetch(formAction, {
						method: formMethod,
						body: formData
					});
					if (response.ok) {
						let responseResult = await response.json()
						form.classList.remove('--sending')
						formSent(form, responseResult)
					} else {
						FLS("_FLS_FORM_AJAX_ERR")
						form.classList.remove('--sending')
					}
				} else if (form.dataset.flsForm === 'dev') {	// Если режим разработки
					e.preventDefault()
					formSent(form)
				}
			} else {
				e.preventDefault();
				if (form.querySelector('.--form-error') && form.hasAttribute('data-fls-form-gotoerr')) {
					const formGoToErrorClass = form.dataset.flsFormGotoerr ? form.dataset.flsFormGotoerr : '.--form-error';
					gotoBlock(formGoToErrorClass);
				}
			}
		}
		// Действия после отправки формы
		function formSent(form, responseResult = ``) {
			document.dispatchEvent(new CustomEvent("formSent", {
				detail: { form: form }
			}));
			// Очищаем форму
			formValidate.formClean(form);
			// Показываем попап «Заявка принята»
			if (window.flsPopup) {
				const isFormInPopup = form.closest('[data-fls-popup]');
				if (isFormInPopup) {
					const popupEl = form.closest('[data-fls-popup]');
					const popupName = popupEl.getAttribute('data-fls-popup');
					window.flsPopup.close(popupName);
					// Задержка 550ms: bodyUnlock() выставляет bodyLockStatus = true через 500ms,
					// open() срабатывает только при bodyLockStatus === true
					setTimeout(() => window.flsPopup.open('popup-success'), 550);
				} else {
					window.flsPopup.open('popup-success');
				}
			}
			FLS(`_FLS_FORM_SEND`);
		}
	}
	// Работа с полями формы.
	function formFieldsInit() {
		document.body.addEventListener("focusin", function (e) {
			const targetElement = e.target;
			if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
				if (!targetElement.hasAttribute('data-fls-form-nofocus')) {
					targetElement.classList.add('--form-focus');
					targetElement.parentElement.classList.add('--form-focus');
				}
				targetElement.hasAttribute('data-fls-form-validatenow') ? formValidate.removeError(targetElement) : null;
			}
		});
		document.body.addEventListener("focusout", function (e) {
			const targetElement = e.target;
			if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
				if (!targetElement.hasAttribute('data-fls-form-nofocus')) {
					targetElement.classList.remove('--form-focus');
					targetElement.parentElement.classList.remove('--form-focus');
				}
				// Мгновенная валидация
				targetElement.hasAttribute('data-fls-form-validatenow') ? formValidate.validateInput(targetElement) : null;
			}
		});
	}
	formSubmit()
	formFieldsInit()

	// Сброс валидации при закрытии модального окна
	document.addEventListener('afterPopupClose', (e) => {
		const popupEl = e.detail?.popup?.previousOpen?.element
		if (!popupEl) return
		const form = popupEl.querySelector('form[data-fls-form]')
		if (form) formValidate.formClean(form)
	})
}
document.querySelector('[data-fls-form]') ?
	window.addEventListener('load', formInit) : null

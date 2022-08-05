//< " ПОДКЛЮЧЕНИЕ JS КОМПОНЕНТОВ " >=============================================================================================================>//
function scrollHeader() {
	const header = document.querySelector('.header');

	const callback = function (entries, observer) {
		if (entries[0].isIntersecting) {
			header.classList.remove('_scroll');
		} else {
			header.classList.add('_scroll');
		}
	};

	const headerObserver = new IntersectionObserver(callback);
	headerObserver.observe(header);
}
scrollHeader(); // ДОБАВЛЕНИЕ ХЕДЕРУ КЛАСС ПРИ СКРОЛЛЕ

new Swiper(".manager-slider", {
	slidesPerView: 1,
	spaceBetween: 60,
	grabCursor: true,
	loop: true,
	speed: 1200,
	autoHeight: true,

	autoplay: {
		delay: 3500,
	},

	navigation: {
		nextEl: ".manager-slider__arrow_next",
		prevEl: ".manager-slider__arrow_prev",
	},

	pagination: {
		el: ".manager-slider__pagination",
		clickable: true,
	},

	breakpoints: {
		767.8: {},
	}
});

; // НАСТРОЙКИ СЛАЙДЕРА

const spollersArray = document.querySelectorAll('[data-spollers]');

if (spollersArray.length > 0) {
	// Получение обычных спойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных спойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение спойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация спойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}; // СПОЙЛЕРЫ

const myPopup = function () {
	const openBtns = document.querySelectorAll(".popup-open");
	const wrappers = document.querySelectorAll(".popup-item");
	let popupData;

	if (openBtns.length > 0) {
		openBtns.forEach(open => {
			open.addEventListener("click", function () {
				popupData = this.getAttribute("data-popup");

				function selectPopup(popupData) {
					wrappers.forEach(wrap => {
						if (wrap.classList.contains(popupData)) {
							wrap.classList.add("_active");
							document.body.classList.add("_lock-scroll");
						}
					});
				}
				selectPopup(popupData)
			});
		});

		function closePopup() {
			const closeBtns = document.querySelectorAll(".popup-close");
			const wrapper = document.querySelectorAll(".popup-item");

			closeBtns.forEach(closeBtn => {
				closeBtn.addEventListener("click", function () {
					wrapper.forEach(wrap => {
						wrap.classList.remove("_active");
						document.body.classList.remove("_lock-scroll");
					});
				});
			});

			wrapper.forEach(wrap => {
				wrap.addEventListener("click", function (e) {
					const elementTarget = e.target;

					if (!elementTarget.closest(".popup-item__body")) {
						wrap.classList.remove("_active");
						document.body.classList.remove("_lock-scroll");
					}
				});
			});
		}
		closePopup()
	}
}
myPopup(); // ПОПАПЫ

//< " СКРИПТЫ " >=============================================================================================================>//

new WOW({
	mobile: false,
	offset: 200,
}).init();

let isMobile = {
	Android: function () { return navigator.userAgent.match(/Android/i); },
	BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
	any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

if (isMobile.any()) {
	document.body.classList.add("_touch");

	function subMenu() {
		const links = document.querySelectorAll("[data-sub-menu]")

		links.forEach(link => {
			link.addEventListener("click", function (e) {
				if (window.innerWidth > 992.2) {
					e.preventDefault();
					this.parentElement.classList.toggle("_active");
				}
			});

			document.addEventListener("click", function (e) {
				const elementTarget = e.target;

				if (!elementTarget.closest(".menu__list-item")) {
					link.parentElement.classList.remove("_active");
				}
			});
		});
	}
	subMenu()
} else {
	document.body.classList.add("_pc");
}

//< " СКРИПТЫ " >=============================================================================================================>//

function actionsHeader() {

	function menuBurger() {
		const open = document.getElementById("menu-open");
		const menuWrap = document.querySelector(".menu__wrapper");
		const menuInner = document.querySelector(".menu__inner");

		if (open && menuWrap && menuInner) {
			open.addEventListener("click", function () {
				menuWrap.classList.add("_active");
				menuInner.classList.add("_active");
				document.body.classList.add("_lock-scroll");
			})

			const close = document.getElementById("menu-close");

			document.addEventListener("click", function (e) {
				const elementTarget = e.target;

				if (elementTarget === close || elementTarget === menuWrap) {
					menuWrap.classList.remove("_active");
					menuInner.classList.remove("_active");
					document.body.classList.remove("_lock-scroll");
				}
			});
		}
	}
	menuBurger()

	function showPassword() {
		const passwordContainer = document.querySelectorAll(".popup-field__password .popup-field__item");

		passwordContainer.forEach(password => {
			password.addEventListener("click", function (e) {
				const elementTarget = e.target;

				if (elementTarget.closest(".popup-field__password-show")) {
					if (elementTarget.closest(".popup-field__password .popup-field__item").querySelector(".popup-field__input").getAttribute("type") === ("password")) {
						elementTarget.closest(".popup-field__password .popup-field__item").querySelector(".popup-field__input").setAttribute("type", "text");
						elementTarget.closest(".popup-field__password .popup-field__item").querySelector(".popup-field__password-show").classList.add("_active");
					} else {
						elementTarget.closest(".popup-field__password .popup-field__item").querySelector(".popup-field__input").setAttribute("type", "password");
						elementTarget.closest(".popup-field__password .popup-field__item").querySelector(".popup-field__password-show").classList.remove("_active");
					}
				}
			});
		});
	}
	showPassword()

}
actionsHeader()

//< " СКРИПТЫ " >=============================================================================================================>//

function actionsPage() {

	function product() {

		function addFavorite() {
			document.addEventListener("click", function (e) {
				const elementTarget = e.target;

				if (elementTarget.closest(".product-favorite")) {
					elementTarget.classList.toggle("_active");
				}

			})
		}
		addFavorite()

		function showProduct() {
			const btn = document.querySelector(".popular__show-more");

			if (btn) {
				btn.addEventListener("click", function () {
					async function getProducts() {
						if (!btn.classList.contains('_active')) {

							btn.classList.add('_active');
							const file = "./json/products.json";

							let response = await fetch(file, {
								method: "GET"
							});

							if (response.ok) {
								let result = await response.json();
								loadProducts(result);
								btn.classList.remove('_active');
								btn.remove();
							}
						}
					}
					getProducts()
				});
			}
		}
		showProduct()

	}
	product()

}
actionsPage()

//< " СКРИПТЫ " >=============================================================================================================>//

function loadProducts(data) {

	const productsItems = document.querySelector('.popular__column');

	data.products.forEach(item => {
		const productId = item.id;
		const productImage = item.image;
		const productTitle = item.title;
		const productSubTitle = item.subtitle;
		const productText = item.text;
		const productFolder = item.folder;
		const productButton = item.button;
		const animationDelay = item.animationDelay;

		let template = `
			<article class="product-column__card wow animate__animated animate__fadeIn" data-wow-delay="${animationDelay}" data-wow-duration="2s" data-pid="${productId}">
			<div class="product-column__header product-column-header">
				<div class="product-column-header__image">
					<img src="img/page/popular/${productImage}" alt="popular-${productId}">
				</div>
				<div class="product-column-header__text-block">
					<h3 class="product-column-header__title">
						${productTitle}
					</h3>
					<p class="product-column-header__sub-title">
						${productSubTitle}
					</p>
				</div>
			</div>
			<p class="product-column__text">
				${productText}
			</p>
			<div class="product-column__actions product-column-actions">
				<div class="product-column-actions__items">
					<button
						class="product-column-actions__favorite product-column-actions__item product-favorite _icon-favorites"></button>
					<a class="product-column-actions__folder product-column-actions__item _icon-folder"
						href="${productFolder}"></a>
				</div>
				<a class="product-column-actions__btn btn" href="${productButton}">
					Visit
				</a>
			</div>
		</article>
		`

		productsItems.insertAdjacentHTML("beforeEnd", template);
	});
}
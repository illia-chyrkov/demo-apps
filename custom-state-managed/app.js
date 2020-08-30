// Store
const store = {
	state: {
		cart: []
	},
	actions: {
		cartPlus({ state }, payload) {
            let product = state.cart.findIndex(i => i.id == payload.id)

            if (product > -1) state.cart[product].count += 1
            else state.cart.push({ ...payload, count: 1 })

            return {
                ...state
            }
		},
		cartMinus({ state }, payload) {
            let product = state.cart.findIndex(i => i.id == payload.id)

            if (product > -1) {
                if (state.cart[product].count > 1) state.cart[product].count -= 1
                else state.cart = state.cart.filter((i, id) => id != product)
            }

            return {
                ...state
            }
		},
		cartRemove({ state }, payload) {
            return {
                ...state,
                cart: state.cart.filter(i => i.id != payload.id)
            }
		}
	},
	listeners: [],
	dispatch(action, ...payload) {
		this.state = this.actions[action]({ ...this }, ...payload)
		this.listeners.forEach(i => {
			if (i.action == action) i.listener({ ...this.state })
		})
	},
	on(action, listener) {
		if (Array.isArray(action.split(' ')) && listener) {
			action.split(' ').forEach(action => {
				this.listeners.push({ action, listener })
			})
		} else if (action && listener) this.listeners.push({ action, listener })
    },
    off(action, listener) {
        if (Array.isArray(action.split(' ')) && listener) {
			action.split(' ').forEach(action => {
				this.listeners = this.listeners.filter(i => i.action != action || i.listener != listener)
			})
        } else if (action && listener) this.listeners = this.listeners.filter(i => i.action != action || i.listener != listener)
    }
}

// Product
$('.catalog__item-minus').click(function(e) {
	e.preventDefault()
	let $product = $(this).closest('.catalog__item')

	if (+$product.find('.catalog__item-count').text() > 0) {
		$product
			.find('.catalog__item-count')
			.text(+$product.find('.catalog__item-count').text() - 1)

        store.dispatch('cartMinus', { id: $product.data('id') })
	}
})

$('.catalog__item-plus').click(function(e) {
	e.preventDefault()
	let $product = $(this).closest('.catalog__item')

	$product
		.find('.catalog__item-count')
		.text(+$product.find('.catalog__item-count').text() + 1)

    store.dispatch('cartPlus', {
        id: $product.data('id'),
        name: $product.find('.catalog__item-title').text()
    })
})

store.on('cartPlus cartMinus cartRemove', state => {
    $('.catalog__item').each(function() {
        $(this).find('.catalog__item-count').text('0')
        state.cart.forEach(product => {
            if ($(this).data('id') == product.id) {
                $(this).find('.catalog__item-count').text(product.count)
            }
        })
    })
})

// Cart
$('.cart__item-minus').click(cartMinus)
$('.cart__item-plus').click(cartPlus)
$('.cart__item-remove').click(cartRemove)

store.on('cartPlus cartMinus cartRemove', state => {
    // Перерисовка корзины
    $('.cart__item').remove()
    state.cart.forEach(({ id, name, count }) => {
		$product = $(`
        <li data-id="${id}" class="cart__item">
            <p><span class="cart__item-name">${name}</span> | <span class="cart__item-count">${count}</span> штук</p>
            <button class="btn cart__item-minus">-</button>
            <button class="btn cart__item-plus">+</button>
            <button class="btn cart__item-remove">x</button>
        </li>
        `)
		$('.cart__list').append($product)
		$product.find('.cart__item-minus').click(cartMinus)
		$product.find('.cart__item-plus').click(cartPlus)
		$product.find('.cart__item-remove').click(cartRemove)
    })

    // Количество товаров
	let count = 0
	$('.cart__item-count').each(function() {
		count += +$(this).text()
	})
	$('.cart__count span').text(count)
})

function cartMinus(e) {
	e.preventDefault()
	let $product = $(this).closest('.cart__item')

	if (+$product.find('.cart__item-count').text() > 1) {
		$product
			.find('.cart__item-count')
			.text(+$product.find('.cart__item-count').text() - 1)
	} else $product.remove()

    store.dispatch('cartMinus', { id: $product.data('id') })
}

function cartPlus(e) {
	e.preventDefault()
	let $product = $(this).closest('.cart__item')

	$product
		.find('.cart__item-count')
        .text(+$product.find('.cart__item-count').text() + 1)
        
     store.dispatch('cartPlus', { id: $product.data('id') })
}

function cartRemove(e) {
	e.preventDefault()
	let $product = $(this).closest('.cart__item')

    store.dispatch('cartRemove', { id: $product.data('id') })
	$product.remove()
}

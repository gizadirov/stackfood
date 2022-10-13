import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            cart_list: []
        }
    },
    mutations: {
        init(state) {
            let cart_list = localStorage.getItem('cart_list');

            if (cart_list) {
                this.replaceState(
                    Object.assign(state, { cart_list: JSON.parse(cart_list) })
                );
            }
        },
        add_to_cart(state, product) {
            state.cart_list.push(product);
        },
        edit_in_cart(state, product) {
            let productIndex = state.cart_list.findIndex((product_) => product_.store_id == product.store_id);
            if (productIndex != -1) {
                state.cart_list[productIndex] = product;
            }
        },
        dec_product_from_cart(state, store_id) {
            let productIndex = state.cart_list.findIndex((product) => product.store_id == store_id)
            if (productIndex != -1) {
                let product = state.cart_list[productIndex];
                product.quantity--;
                if (product.quantity == 0) {
                    state.cart_list.splice(productIndex, 1);
                }
            }
        }
    }
})

store.subscribe((mutation, state) => {
    localStorage.setItem('cart_list', JSON.stringify(state.cart_list));
});

export default store;
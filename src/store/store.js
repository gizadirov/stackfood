import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            cart_list: []
        }
    },
    mutations: {
        init(state) {
            let cart_state = localStorage.getItem('store');

            if (cart_state) {
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem('store')))
                );
            }
        },
        add_to_cart(state, product) {
            state.cart_list.push(product);
        }
    }
})

store.subscribe((mutation, state) => {
    localStorage.setItem('store', JSON.stringify(state));
});

export default store;
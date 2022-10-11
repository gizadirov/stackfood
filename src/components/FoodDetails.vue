<template>
    <div class="modal fade" id="foodDetails" tabindex="-1" role="dialog" :aria-labelledby="title" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content" v-if="product">
                <div class="modal-header">
                    <h3 class="modal-title">{{ product.name }}</h3>
                    <button title="Close (Esc)" type="button" class="btn-close"></button>
                </div>
                <div class="modal-body content">
                    <h5>Quantity</h5>
                    <div class="numbers-row">
                        <input type="text" :value="product.quantity" class="qty2 form-control">
                        <div class="inc button_inc" @click="addQuantity">+</div>
                        <div class="dec button_inc" @click="decQuantity">-</div>
                    </div>
                    <!--Choise options-->
                    <div v-for="choice_option in product.choice_options" :key="choice_option.name">
                        <h5 v-if="product.variations.length">{{ choice_option.title }}</h5>
                        <ul class="clearfix">
                            <li v-for="option in choice_option.options" :key="option">
                                <label class="container_radio">
                                    {{ option }}<span>${{ optionPrice(option) }}</span>
                                    <input type="radio" :value="option" :name="choice_option.name" :checked="choice_option.choice == option">
                                    <span class="checkmark"></span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    <!--Add-ons-->
                    <h5 v-if="product.add_ons.length">Addons</h5>
                    <div class="mb-3">
                        <div class="add_ons" v-for="add_ons, index in product.add_ons" :key="add_ons.id">
                            <div class="row">
                                <label class="col container_check">
                                    {{ add_ons.name }}
                                    <input type="checkbox" @change.prevent="changeAddOns(index)" v-model="product.add_ons[index].choice">
                                    <span class="checkmark"></span>
                                </label>
                                <div v-if="product.add_ons[index].choice" class="col numbers-row w-25">
                                    <input type="text" :value="product.add_ons[index].choice_count" class="qty2 form-control">
                                    <div class="inc button_inc" @click="addAddOns(index)">+</div>
                                    <div class="dec button_inc" @click="decAddOns(index)">-</div>
                                </div>
                                <div class="col text-end">
                                    <span>+ ${{ add_ons.price }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h5>Total Amount: <span class="text-primary">${{ totalAmount }}</span></h5>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary">Add cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { Modal } from 'bootstrap'

    export default {
        data() {
            return {
                el: undefined,
                modalInstance: undefined,
                product: null,
            }
        },
        mounted() {
            let modalId = "foodDetails";
            this.el = document.getElementById(modalId);
            this.modalInstance = new Modal(this.el);

            var app = this;

            this.el.addEventListener("hidden.bs.modal", function () {
                app.$emit("onclose", modalId);
            });
        },
        computed: {
            totalAmount() {
                //NB!!!
                return this.product.quantity * this.product.price
            }
        },
        methods: {
            optionPrice(option) {
                let variation = this.product.variations.find((v) => v.type === option);
                return variation.price;
            },
            open(product) {
                this.product = Object.assign({}, product);
                this.product.quantity = 1;
                this.product.choice_options.forEach((co) => { co.choice = co.options[0] });
                this.product.add_ons.forEach((ao) => { ao.choice_count = 0; ao.choice = false })
                //discounts
                //NB!
                this.modalInstance.show();
            },
            close() {
                this.modalInstance.hide();
            },
            addQuantity() {
                this.product.quantity++;
            },
            decQuantity() {
                if (this.product.quantity > 1) {
                    this.product.quantity--;
                }
            },
            addAddOns(index) {
                this.product.add_ons[index].choice_count++;
            },
            decAddOns(index) {
                if (this.product.add_ons[index].choice_count > 0) {
                    this.product.add_ons[index].choice_count--;
                }
                if (this.product.add_ons[index].choice_count == 0) {
                    this.product.add_ons[index].choice = false;
                }
            },
            changeAddOns(index) {
                let isChoice = this.product.add_ons[index].choice;
                if (isChoice) {
                    this.product.add_ons[index].choice_count = 1;
                } else {
                    this.product.add_ons[index].choice_count = 0;


                }
            }
            

        }
    }
</script>
<style>
    .modal-header {
        background-color: #f6f6f6;
        padding: 18px 20px 15px 20px;
    }

        .modal-header h3 {
            font-size: 18px;
            font-size: 1.125rem;
            font-weight: 500;
        }

    ul {
        padding: 0;
        margin: 0 0 20px 0;
        list-style: none;
    }

        ul li span {
            float: right;
        }

    .add_ons {
        margin-left: 10px;
    }
</style>
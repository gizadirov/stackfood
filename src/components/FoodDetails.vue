<template>
    <div class="modal fade" id="foodDetails" tabindex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content" v-if="product">
                <div class="modal-header">
                    <h3 class="modal-title">{{ product.name }}</h3>
                    <button title="Close (Esc)" type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body content">
                    <h5>Quantity</h5>
                    <div class="numbers-row">
                        <input type="text" :value="quantity" class="qty2 form-control">
                        <div class="inc button_inc" @click="addQuantity">+</div>
                        <div class="dec button_inc" @click="decQuantity">-</div>
                    </div>
                    <!--Choise options-->
                    <div v-for="choice_option, index1 in product.choice_options" :key="choice_option.name">
                        <h5>{{ choice_option.title }}</h5>
                        <ul class="clearfix">
                            <li v-for="option, index2 in choice_option.options" :key="option">
                                <label class="container_radio">
                                    {{ option.type }}<span><span v-if="index1 != 0">+</span>${{ option.discounted_price }}</span>
                                    <input type="radio" @change="changeOption(index1, index2)" :name="choice_option.name+'choiceOptions'" :checked="choices[index1] == index2">
                                    <span class="checkmark"></span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    <!--Add-ons-->
                    <h5 v-if="product.add_ons.length">Addons</h5>
                    <div class="mb-3">
                        <div class="add_ons" v-for="add_on, index in product.add_ons" :key="add_on.id">
                            <div class="row">
                                <label class="col container_check">
                                    {{ add_on.name }}
                                    <input type="checkbox" @change="changeAddOns(index)" :checked="add_ons[index]">
                                    <span class="checkmark"></span>
                                </label>
                                <div v-if="add_ons[index]" class="col numbers-row w-25">
                                    <input type="text" :value="add_ons[index]" class="qty2 form-control">
                                    <div class="inc button_inc" @click="addAddOns(index)">+</div>
                                    <div class="dec button_inc" @click="decAddOns(index)">-</div>
                                </div>
                                <div class="col text-end">
                                    <span v-if="add_ons[index]">
                                        <strong>+ ${{ totalAddonPrice(index) }}</strong>
                                    </span>
                                    <span v-else>+ ${{ add_on.price }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h5>Total Amount: ${{ totalAmount }}</h5>
                    <div class="modal-footer">
                        <div class="row small-gutters w-100">
                            <div class="col-md-4">
                                <button type="reset" @click="close()" class="btn_1 outline full-width mb-mobile">Cancel</button>
                            </div>
                            <div class="col-md-8">
                                <button @click="addToCart" type="reset" class="btn_1 full-width">Add to cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { Modal } from 'bootstrap'
    import _ from 'lodash'

    const get_discount_value = (price, discount, discount_type) => {
        if (discount_type == "percent") {
            return (price - price * discount / 100.0).toFixed(2);
        } else if (discount_type == "amount") {
            return price - discount;
        } else {
            return price;
        }
    }

    export default {
        data() {
            return {
                el: undefined,
                modalInstance: undefined,
                product: null,
                choices: [],
                hasChoice: false,
                hasAddons: false,
                add_ons: [],
                quantity: 1,

            }
        },
        mounted() {
            let modalId = "foodDetails";
            this.el = document.getElementById(modalId);
            this.modalInstance = new Modal(this.el);

            var app = this;

            this.el.addEventListener("hidden.bs.modal", function () {
                app.afterClose();
            });
        },
        computed: {
            totalAmount() {
                let totalPrice = 0;
                if (this.hasChoice) {
                    for (let i = 0; i < this.choices.length; i++) {

                        let variationIndex = this.choices[i];
                        if (i == 0) {
                            totalPrice = this.product.variations[variationIndex].discounted_price * this.quantity;
                            break;
                        }
                        totalPrice += this.product.variations[variationIndex].discounted_price * this.quantity;
                    }
                } else {
                    totalPrice += this.product.discounted_price * this.quantity;
                }

                for (let i = 0; i < this.add_ons.length; i++) {
                    let quantity = this.add_ons[i];
                    totalPrice += this.product.add_ons[i].price * quantity;
                }

                return totalPrice;
            }
        },
        methods: {
            open(product) {
                let product_ = _.cloneDeep(product);

                product_.discounted_price = get_discount_value(product_.price, product_.discount, product_.discount_type);

                product_.variations.forEach((variation) => {
                    variation.discounted_price = get_discount_value(variation.price, product_.discount, product_.discount_type);
                })

                this.hasChoice = product_.choice_options.length > 0;
                if (this.hasChoice) {
                    this.choices.length = product_.choice_options.length;
                    this.choices.fill(0);
                }

                product_.choice_options.forEach((choice_option) => {
                    choice_option.options = choice_option.options.map((option) => {
                        let variationIndex = product_.variations.findIndex((variation) => variation.type == option);
                        let variation = Object.assign({}, product_.variations[variationIndex]);
                        variation.index = variationIndex;
                        return variation;
                    })
                });

                this.hasAddons = product_.add_ons.length > 0;
                if (this.hasAddons) {
                    this.add_ons.length = product_.add_ons.length;
                    this.add_ons.fill(0);
                }
                console.log(product)
                this.product = product_;

                this.modalInstance.show();
            },
            close() {
                this.modalInstance.hide();
            },
            afterClose() {
                //clean model
                this.product = null;
                this.choices = [];
                this.hasChoice = false;
                this.hasAddons = false;
                this.add_ons = [];
                this.quantity = 1;
            },
            addQuantity() {
                this.quantity++;
            },
            decQuantity() {
                if (this.quantity > 1) {
                    this.quantity--;
                }
            },
            changeOption(index1, index2) {
                this.choices[index1] = index2;
            },
            addAddOns(index) {
                this.add_ons[index]++;
            },
            decAddOns(index) {
                let quantity = this.add_ons[index];

                if (quantity > 0) {
                    this.add_ons[index]--;
                }
            },
            totalAddonPrice(index) {
                return this.product.add_ons[index].price * this.add_ons[index];
            },
            changeAddOns(index) {
                let quantity = this.add_ons[index];
                if (quantity) {
                    this.add_ons[index] = 0;
                } else {
                    this.add_ons[index] = 1;
                }
            },
            addToCart() {
                let app = this;
                let cart_object = {};
                cart_object.id = this.product.id;
                cart_object.price = this.product.price;
                cart_object.discounted_price = this.totalAmount;
                cart_object.quantity = this.quantity;
                cart_object.variation = this.choices.map((choice, index) => {
                    let variationIndex = app.product.choice_options[index].options[choice].index;
                    return app.product.variations[variationIndex];
                });
                cart_object.add_on_ids = this.add_ons.map((quantity, index) => {
                    return {
                        "id": app.product.add_ons[index].id,
                        "quantity": quantity
                    };
                });
                cart_object.product = this.product;

                this.$store.commit('add_to_cart', cart_object);

                this.close();
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
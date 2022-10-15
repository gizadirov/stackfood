<template>
    <div class="modal fade" id="foodDetails" tabindex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content" v-if="productData.product">
                <div class="modal-header">
                    <h3 class="modal-title">{{ productData.product.name }}</h3>
                    <button title="Close (Esc)" type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body content">
                    <h5>Quantity</h5>
                    <div class="numbers-row">
                        <input type="text" :value="model.quantity" disabled="disabled" class="qty2 form-control">
                        <div class="inc button_inc" @click="addQuantity">+</div>
                        <div class="dec button_inc" @click="decQuantity">-</div>
                    </div>
                    <!--Choise options-->
                    <div v-if="productData.choiceOptions.length">
                        <div class="mb-3" v-for="choice_option, index1 in productData.choiceOptions" :key="choice_option.name">
                            <h5>{{ choice_option.title }}</h5>
                            <ul class="clearfix">
                                <li v-for="option, index2 in choice_option.options" :key="option.name">
                                    <label class="container_radio">
                                        {{ option.type }}
                                        <span v-if="model.chooseOptions[index1] == index2">
                                            <strong><span v-show="index1" class="float-none">+ </span>${{ getFormattedPrice(totalOptionPrice(option)) }}</strong>
                                        </span>
                                        <span v-else><span v-show="index1" class="float-none">+ </span>${{ getFormattedPrice(totalOptionPrice(option)) }}</span>
                                        <input type="radio" @change="changeOption(index1, index2)" :name="choice_option.name+'choiceOptions'" :checked="model.chooseOptions[index1] == index2">
                                        <span class="checkmark"></span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--Add-ons-->
                    <div class="mb-3" v-if="productData.addons.length">
                        <h5>Addons</h5>
                        <div class="mb-3">
                            <div class="add_ons" v-for="add_on, index in productData.addons" :key="add_on.id">
                                <div class="row">
                                    <label class="col container_check">
                                        {{ add_on.name }}
                                        <input type="checkbox" @change="changeAddOns(index)" :checked="model.chooseAddons[index]">
                                        <span class="checkmark"></span>
                                    </label>
                                    <div v-if="model.chooseAddons[index]" class="col numbers-row w-25">
                                        <input type="text" :value="model.chooseAddons[index]" disabled="disabled" class="qty2 form-control">
                                        <div class="inc button_inc" @click="addAddOns(index)">+</div>
                                        <div class="dec button_inc" @click="decAddOns(index)">-</div>
                                    </div>
                                    <div class="col text-end">
                                        <span v-if="model.chooseAddons[index]">
                                            <strong>+ ${{ getFormattedPrice(totalAddonPrice(index)) }}</strong>
                                        </span>
                                        <span v-else>+ ${{ getFormattedPrice(productData.addons[index].price) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h5 class="mb-3">Total Amount: ${{ getFormattedPrice(totalAmount) }}</h5>
                    <div class="modal-footer">
                        <div class="row small-gutters w-100">
                            <div class="col-md-4">
                                <button type="reset" @click="close()" class="btn_1 outline full-width mb-mobile">Cancel</button>
                            </div>
                            <div class="col-md-8">
                                <button @click="addToCart" type="reset" class="btn_1 full-width"><span v-if="isEdit">Update cart</span><span v-else>Add to cart</span></button>
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

    const get_discount_amount = (price, discount, discount_type) => {
        if (discount_type == "percent") {
            return price * discount / 100.0
        } else if (discount_type == "amount") {
            return discount;
        } else {
            return 0;
        }
    };

    export default {
        data() {
            return {
                box: { el: undefined, modalInstance: undefined },
                productData: {
                    product: null,
                    choiceOptions: null,
                    addons: null,
                    price: null,
                    discountedPrice: null,
                    discountAmount: null,
                },
                model: {
                    chooseOptions: undefined,
                    chooseAddons: undefined,
                    quantity: undefined,
                    storeId: undefined
                },
                isEdit: false
            }
        },
        mounted() {

            let modalId = "foodDetails";
            this.box.el = document.getElementById(modalId);
            this.box.modalInstance = new Modal(this.box.el);

            var app = this;
            this.box.el.addEventListener("hidden.bs.modal", function () {
                app.afterClose();
            });
        },
        computed: {
            totalAmount() {
                let app = this;

                let totalPrice = 0;

                if (this.model.chooseOptions.length) {
                    this.model.chooseOptions.forEach((chooseOption, index) => {
                        let chooseOption_ = app.productData.choiceOptions[index].options[chooseOption];
                        totalPrice += (chooseOption_.price - chooseOption_.discount_amount) * app.model.quantity;
                    });
                } else {
                    totalPrice += this.productData.discountedPrice * this.model.quantity;
                }

                if (this.model.chooseAddons.length) {
                    this.model.chooseAddons.forEach((chooseAddon, index) => {
                        let chooseAddon_ = app.productData.addons[index];
                        totalPrice += chooseAddon_.price * chooseAddon;
                    });
                }

                return totalPrice;
            }
        },
        methods: {
            initProductData(product) {
                this.productData.price = product.price;
                this.productData.discountAmount = get_discount_amount(product.price, product.discount, product.discount_type);
                this.productData.discountedPrice = product.price - this.productData.discountAmount;

                //variations
                let choiceOptions = this.productData.choiceOptions = [];

                product.choice_options.forEach((choiceOption) => {
                    let choiceOption_ = {
                        title: choiceOption.title,
                        name: choiceOption.name,
                        options: []
                    };
                    choiceOption.options.forEach((option) => {
                        let variation_ = product.variations.find((variation) => variation.type == option);
                        let option_ = {
                            type: option,
                            price: variation_.price,
                            discount_amount: get_discount_amount(variation_.price, product.discount, product.discount_type)
                        }
                        choiceOption_.options.push(option_);
                    });
                    choiceOptions.push(choiceOption_);
                });

                //addons
                let addons = this.productData.addons = [];

                product.add_ons.forEach((addon) => {
                    addons.push(Object.assign({}, addon));
                });

                this.productData.product = product;
            },
            initModel(productInCart) {
                if (productInCart) {
                    this.model.storeId = productInCart.store_id;
                    this.model.quantity = productInCart.quantity;

                    let app = this;

                    //variations
                    this.model.chooseOptions = productInCart.variation.map((variation, index) => {
                        return app.productData.choiceOptions[index].options.findIndex((option) => option.type == variation.type);
                    });

                    //addons
                    this.model.chooseAddons = [];
                    this.model.chooseAddons.length = this.productData.addons.length;
                    this.model.chooseAddons.fill(0);

                    productInCart.add_on_ids.map((addOnIds) => {
                        let addonIndex = app.productData.addons.findIndex((addons) => addons.id == addOnIds.id);
                        this.model.chooseAddons[addonIndex] = addOnIds.quantity;
                    });
                } else {
                    this.model.storeId = Date.now();
                    this.model.quantity = 1;

                    //variations
                    this.model.chooseOptions = [];
                    this.model.chooseOptions.length = this.productData.choiceOptions.length;
                    this.model.chooseOptions.fill(0);

                    //addons
                    this.model.chooseAddons = [];
                    this.model.chooseAddons.length = this.productData.addons.length;
                    this.model.chooseAddons.fill(0);
                }
            },
            open(product) {
                this.initProductData(product);
                this.initModel();
                this.box.modalInstance.show();
            },
            edit(cartProduct) {
                this.isEdit = true;
                this.initProductData(cartProduct.product);
                this.initModel(cartProduct);
                this.box.modalInstance.show();
            },
            close() {
                this.box.modalInstance.hide();
            },
            afterClose() {
                //clean
                this.productData = {
                    product: null,
                    choiceOptions: null,
                    addons: null,
                    price: null,
                    discountedPrice: null,
                    discountAmount: null
                };
                this.model = {
                    chooseOptions: undefined,
                    chooseAddons: undefined,
                    quantity: undefined,
                    storeId: undefined
                };
                this.isEdit = false;
            },
            addQuantity() {
                this.model.quantity++;
            },
            decQuantity() {
                if (this.model.quantity > 1) {
                    this.model.quantity--;
                }
            },
            changeOption(index1, index2) {
                this.model.chooseOptions[index1] = index2;
            },
            addAddOns(index) {
                this.model.chooseAddons[index]++;
            },
            decAddOns(index) {
                let quantity = this.model.chooseAddons[index];
                if (quantity > 0) {
                    this.model.chooseAddons[index]--;
                }
            },
            totalAddonPrice(index) {
                return this.productData.addons[index].price * this.model.chooseAddons[index];
            },
            totalOptionPrice(option) {
                return (option.price - option.discount_amount) * this.model.quantity;
            },
            changeAddOns(index) {
                let quantity = this.model.chooseAddons[index];
                if (quantity) {
                    this.model.chooseAddons[index] = 0;
                } else {
                    this.model.chooseAddons[index] = 1;
                }
            },
            getFormattedPrice(price) {
                return price.toFixed(2);
            },
            addToCart() {
                let app = this;

                let cartObject = {};

                cartObject.id = this.productData.product.id;
                cartObject.price = this.productData.price;
                cartObject.discounted_price = this.productData.discountedPrice;
                cartObject.discount_amount = this.productData.discountAmount;
                cartObject.quantity = this.model.quantity;
                cartObject.store_id = this.model.storeId;
                cartObject.product = this.productData.product;

                //variations
                cartObject.variation = this.model.chooseOptions.map((choice_option, index) => {
                    let option = app.productData.choiceOptions[index].options[choice_option];
                    return {
                        title: app.productData.choiceOptions[index].title,
                        type: option.type,
                        price: option.price,
                        discount_amount: option.discount_amount
                    };
                });

                //addons
                cartObject.add_on_ids = this.model.chooseAddons.map((quantity, index) => {
                    return {
                        id: app.productData.addons[index].id,
                        quantity: quantity
                    };
                });

                cartObject.add_ons = this.model.chooseAddons.map((quantity, index) => {
                    let addon = app.productData.addons[index];
                    return {
                        id: addon.id,
                        name: addon.name,
                        price: addon.price,
                        quantity: quantity
                    };
                });

                this.$store.commit(this.isEdit ? "edit_in_cart" : "add_to_cart", cartObject);

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

    .qty2.form-control:disabled {
        background-color: inherit !important;
    }
</style>
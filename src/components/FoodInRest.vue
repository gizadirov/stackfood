<template>
    <section v-for="categorie in categories_products" :key="categorie.id" :id="'section-'+categorie.id">
        <h4>{{ categorie.name }}</h4>
        <div class="row">
            <div v-for="product in categorie.products" :key="product.id" class="col-md-6">
                <a class="menu_item modal_dialog" href="#" @click="openFoodDetails(product)">
                   <food-item :product="product" />
                </a>
            </div>
        </div>
        <!-- /row -->
    </section>
    <food-details ref="foodDetails" />
</template>

<script>
    import FoodDetails from './FoodDetails.vue';
    import FoodItem from './FoodItem.vue';

    export default {
        props: ["categories_products"],
        components: {
            'food-details': FoodDetails,
            'food-item': FoodItem
        },
        methods: {
            openFoodDetails(product) {
                this.$refs.foodDetails.open(product);
            }
        }
    }
</script>

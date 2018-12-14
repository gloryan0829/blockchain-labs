<template>
    <ul class="tabs">
        <li v-for="tab in tabs"
            v-bind:class="{active: tab === selectedTab}"
            v-on:click.prevent="onClickTab(tab)"
        >
            {{tab}}
        </li>
    </ul>
</template>

<script>
    export default {
        props : ['tabs','selectedTab'],
        data() {
            return {
                // selectedTab : this.selected-tab
            }
        },
        watch : {
            value(newValue, oldValue){
                // this.selectedTab = newValue
            }
        },
        methods : {
            onClickTab(tab) {
                this.$emit('@change', tab)
            }
        }
    }
</script>
<template>
    <form v-on:submit.prevent="onSubmit">
        <input type="text"
               v-model="inputValue"
               v-on:keyup="onKeyup"
               placeholder="검색어를 입력하세요" autofocus>
        <button type="reset" v-show="inputValue.length" v-on:click.stop="onReset" class="btn-reset"></button>
    </form>
</template>
<script>
    export default {
        props : ['value'],
        data() {
            return {
                inputValue : this.value
            }
        },
        watch : {
            value(newValue, oldValue){
                this.inputValue = newValue
            }
        },
        methods : {
            onSubmit() {
                this.$emit('@submit', this.inputValue.trim())
            },
            onReset() {
                this.inputValue = ""
                this.$emit('@reset')
            },
            onKeyup(e) {
                if (!this.inputValue.length) this.onReset()
            }
        }
    }
</script>
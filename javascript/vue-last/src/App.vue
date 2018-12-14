<template>
    <div>
        <header>
            <h2 class="container">검색</h2>
        </header>
        <div class="container">
            <search-form v-bind:value="query" v-on:@submit="onSubmit" v-on:@reset="onReset">
            </search-form>
        </div>
        <div v-if="submitted">
            <search-result v-bind:data="searchResult" v-bind:query="query"></search-result>
        </div>
        <div v-else>
            <tabs v-bind:tabs="tabs" v-bind:selected-tab="selectedTab" v-on:@change="onChangeTab"></tabs>
            <div v-if="selectedTab === tabs[0]">
                <list v-bind:data="keywords" type="keywords" v-on:@click="onClickKeyword"></list>
            </div>
            <div v-else>
                <list v-bind:data="history" type="history"
                      v-on:@click="onClickKeyword" v-on:@remove="onClickRemoveHistory"></list>
            </div>
        </div>
    </div>
</template>


<script>
    import FormComponent from "./components/FormComponent"
    import TabComponent from "./components/TabComponent"
    import ListComponent from "./components/ListComponent"
    import ResultComponent from "./components/ResultComponent"

    import SearchModel from './models/SearchModel.js'
    import KeywordModel from './models/KeywordModel.js'
    import HistoryModel from './models/HistoryModel.js'

    export default {
        name: 'app',
        data() {
            return {
                query: '',
                searchResult : [],
                tabs : ['추천 검색어', '최근 검색어'],
                selectedTab : '',
                keywords : [],
                history : [],
                submitted : false
            }
        },
        components : {
            'search-form' : FormComponent,
            'tabs' : TabComponent,
            'list' : ListComponent,
            'search-result' : ResultComponent
        },
        created() {
            this.selectedTab = this.tabs[0]
            this.fetchKeyword()
            this.fetchHistory()
        },
        methods : {
            onSubmit(query) {
                this.query = query
                this.search()
            },
            onChangeTab(tabName) {
                this.selectedTab = tabName
            },
            onClickKeyword(keyword) {
                this.query = keyword
                this.search()
            },
            onClickRemoveHistory(keyword) {
                console.log(keyword)
                HistoryModel.remove(keyword)
                this.fetchHistory()
            },
            onClickHistory(keyword) {
                this.query = keyword
                this.search()
            },
            fetchHistory() {
                HistoryModel.list().then(data => {
                    this.history = data
                })
            },
            fetchKeyword() {
                KeywordModel.list().then(data => {
                    this.keywords = data
                })
            },
            onReset(e) {
                this.query = ''
                this.searchResult = []
                this.submitted = false
            },
            search() {
                SearchModel.list().then((data) => {
                    this.searchResult = data
                })
                this.submitted = true
                HistoryModel.add(this.query)
                this.fetchHistory()

            }
        }
    }
</script>

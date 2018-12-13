import SearchModel from './models/SearchModel.js'
import KeywordModel from './models/KeywordModel.js'
import HistoryModel from './models/HistoryModel.js'


new Vue({
    el: '#app',
    data: {
        query: '',
        searchResult : [],
        tabs : ['추천 검색어', '최근 검색어'],
        selectedTab : '',
        keywords : [],
        history : [],
        submitted : false
    },
    created() {
        this.selectedTab = this.tabs[0]
        this.fetchKeyword()
        this.fetchHistory()
    },
    methods : {
        onSubmit(e) {
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
        onKeyup(e){
            if (!this.query.length) this.onReset()
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
})
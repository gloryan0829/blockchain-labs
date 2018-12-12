import View from './View.js'

const tag = '[HistoryView]'

const HistoryView = Object.create(View)

HistoryView.setup = function (el) {
    this.init(el)
    return this
}
//
HistoryView.bindClickEvent = function() {
    Array.from(this.el.querySelectorAll('li')).forEach(li => {
        li.addEventListener('click', e => this.onClickKeyword(e))
    })
    Array.from(this.el.querySelectorAll('button.btn-remove')).forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation()
            this.onRemove(btn.parentElement.dataset.keyword)
        })
    })
}

HistoryView.onClickKeyword = function (e) {
    const {keyword} = e.currentTarget.dataset
    this.emit('@click', {keyword})
}

HistoryView.onRemove = function (keyword) {
    this.emit('@remove', {keyword})
}

HistoryView.render = function(data = []) {
    this.el.innerHTML = data.length ? this.getKeywordHtml(data) : '최근 검색어가 없습니다'
    this.bindClickEvent()
}

HistoryView.getKeywordHtml = function (data) {
    return data.reduce((html, item, index) => {
        html += `
        <li data-keyword="${item.keyword}">
            ${item.keyword}
            <span class="date">${item.date}</span>
            <button class="btn-remove"></button>
        </li>`
        return html
    }, '<ul class="list">') + '</ul>'
}

export default HistoryView
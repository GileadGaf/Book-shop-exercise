'use strict'

function onInit() {
    createBooks();
    onSetLang()
    renderSelectLang();

}

function renderBooks() {
    var books = getBooks();
    var pageSize = getPageSize();
    var elBooksList = document.querySelector('.books-list');
    if (!books || !books.length) {
        elBooksList.innerHTML = '<tr ><td colspan="6"><h2>There are no books!</h2></td> </tr>';
        return;
    }
    var strHtmls = books.map(function(book) {
        return `<tr onclick="onReadBook('${book.id}')">
       <td> ${book.id} </td>
       <td> ${book.title} </td>
       <td> ${formatCurrency(book.price)} </td>
      <td><button data-trans="read-btn" class="action-btn blue">Read</button> </td>
      <td><button data-trans="update-btn" class="action-btn orange" onclick="onUpdateBook('${book.id}',event)">Update</button> </td>
      <td><button data-trans="delete-btn" class="action-btn red" onclick="onRemoveBook('${book.id}',event)">Delete</button> </td>
               </tr>`
    });
    elBooksList.innerHTML = strHtmls.join('');

    var pageNum = getPage() + 1;
    var pageSize = getPageSize();
    var allBooksCount = getAllBooksCount();
    var strHtml = '';
    if (pageNum > 1) {
        strHtml += '<button class="pointer btn-arrow" data-page="--" onclick="onPageChanging(this)">◀</button>';
    }
    for (var i = 1; i <= Math.ceil(allBooksCount / pageSize); i++) {
        var className = (i === pageNum) ? 'active' : '';
        strHtml += ` <button class="pointer ${className}" data-page="${i}" onclick="onPageChanging(this)">${i}</button>`;

    }
    if (pageNum * pageSize < allBooksCount) {
        strHtml += '<button class="pointer btn-arrow" data-page="++" onclick="onPageChanging(this)">▶</button>';
    }
    var elPaging = document.querySelector('.paging');
    elPaging.innerHTML = strHtml;

    doTrans();
}



function onAddBook() {
    var strHtml = `<form  onsubmit="onSaveBook(event,'ADD')">
    <h2 data-trans="add-new-book">Add a new book</h2>
    <h3 ><span data-trans="title-label">Title</span>:<input data-trans="title-label"  type="text" class="long-field" name="txt-book-title" placeholder="book title"></h3>
    <h3><span data-trans="price-label">Price</span>:<input data-trans="price-label" type="text" class="long-field" name="txt-book-price" placeholder="price"></h3>
    <button data-trans="save-book" class="save-book">Save</button>
    </form>`

    var elModel = document.querySelector('.modal');
    var elBookSect = elModel.querySelector('.view-book');
    elBookSect.innerHTML = strHtml;
    elModel.hidden = false;
    doTrans();
}

function onSaveBook(ev, action, bookId = 0) {
    ev.preventDefault();
    var bookTitle = document.querySelector('input[name=txt-book-title]').value;
    var bookPrice = +document.querySelector('input[name=txt-book-price]').value;
    console.log(bookTitle + ' ' + bookPrice);
    if (!bookTitle | isNaN(bookPrice)) return;
    switch (action) {
        case 'ADD':
            addBook(bookTitle, bookPrice);
            break;

        case 'UPDATE':
            updateBook(bookId, bookTitle, bookPrice);
            break;

        default:
            break;
    }

    closeModal();
    renderBooks();
}


function onRemoveBook(bookId, ev) {
    ev.stopPropagation();
    removeBook(bookId);

    renderBooks();
}

function onUpdateBook(bookId, ev) {
    ev.stopPropagation();
    var book = getBookById(bookId);
    var strHtml = `<form  onsubmit="onSaveBook(event,'UPDATE','${bookId}')">
    <h2 data-trans="update-book">Update book</h2>
    <h3><span data-trans="title-label">Title</span>: <input data-trans="title-label" type="text" value="${book.title}" class="long-field" name="txt-book-title" placeholder="book title"></h3>
    <h3><span data-trans="price-label">Price</span>: <input data-trans="price-label" type="text" value="${book.price}" class="long-field" name="txt-book-price" placeholder="price"></h3>
    <button data-trans="save-book" class="save-book">Save</button>
    </form>`

    var elModel = document.querySelector('.modal');
    var elBookSect = elModel.querySelector('.view-book');
    elBookSect.innerHTML = strHtml;
    elModel.hidden = false;
    doTrans();
}

function onReadBook(bookId) {
    var book = getBookById(bookId);
    if (!book) return;

    var strHtml = `
   
    <h2>${book.title}</h2>
    <h3><span data-trans="price-label"> Price</span>: ${formatCurrency(book.price)}</h3>
    <h3><span data-trans="rating"> Rating </span>: <span class="book-rate">${book.rate}</span> </h3>
    <img src="${book.imgUrl}" />
    <section>
        <h4 data-trans="rate-this-book">Rate the book</h4>
        <button onclick="onChangeRateInput(-1,'${book.id}')">➖</button>
        <input name="rate-input" type="number" min="1" max="10" value="${book.rate}">
        <button onclick="onChangeRateInput(1,'${book.id}')">➕</button>
    </section>
                `
    var elModel = document.querySelector('.modal');
    var elBookSect = elModel.querySelector('.view-book');
    elBookSect.innerHTML = strHtml;
    elModel.hidden = false;
    doTrans();
}

function onChangeRateInput(diff, bookId) {
    var elRateInput = document.querySelector('input[name=rate-input]');
    var rate = +elRateInput.value;
    rate += diff;
    if (isNaN(rate)) return;
    if (rate < 1 || rate > 10) return;
    elRateInput.value = rate;
    onUpdateRate(bookId, rate)
    document.querySelector('.modal h3 .book-rate').innerText = rate;
}

function onUpdateRate(bookId, newRate) {
    updateRate(bookId, newRate);
}

function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.hidden = true;
}
//How to toggle between the sorts?
function onSortBy(sortBy) {
    setSort(sortBy);
    renderBooks();
}

function onPageChanging(elPageBtn) {
    var dataValue = elPageBtn.getAttribute('data-page');
    var pageNum = getPage() + 1;
    if (dataValue === '++') {
        pageNum++;

    } else if (dataValue === '--') {
        pageNum--;
    } else {
        var pageNum = +dataValue;
        if (isNaN(pageNum)) return;
    }

    setPage(pageNum);
    renderBooks();
}

function onSetLang(lang = getLang()) {
    setLang(lang);
    // TODO: if lang is hebrew add RTL class to document.body
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    renderBooks();

}

function renderSelectLang() {
    document.querySelector('[name=select-lang]').value = getLang();
}
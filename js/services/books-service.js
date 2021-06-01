'use strict'
const KEY = 'books';
const PAGE_SIZE = 5;

var gBooks;
var gSortBy = '';
var gSortDiff = 1;
var gPageIdx = 0;



function getBooks() {
    var startIdx = gPageIdx * PAGE_SIZE;

    var books = gBooks;
    switch (gSortBy) {
        case 'TITLE':
            books = books.sort(function(a, b) {
                return a.title.localeCompare(b.title) * gSortDiff;
            })
            break;
        case 'PRICE':

            books = books.sort(function(a, b) {
                return (b.price - a.price) * gSortDiff;
            })
            break;

        default:
            break;
    }
    return books.slice(startIdx, startIdx + PAGE_SIZE);
}

function getAllBooksCount() {
    return gBooks.length;
}

function getBookById(bookId) {
    return gBooks.find(function(book) {
        return book.id === bookId;
    });

}

function removeBook(bookId) {
    var bookIdx = gBooks.findIndex(function(book) {
        return book.id === bookId;
    });
    if (bookIdx === -1) return;
    gBooks.splice(bookIdx, 1);
    _saveBooksToStorage();
}

function addBook(bookTitle, bookPrice) {
    var book = _createBook(bookTitle, bookPrice);
    gBooks.push(book);
    _saveBooksToStorage();
}

function updateBook(bookId, newTitle, newPrice) {
    var bookToUpdate = getBookById(bookId);

    if (!bookToUpdate) return;
    bookToUpdate.title = newTitle;
    bookToUpdate.price = newPrice;
    _saveBooksToStorage();
}

function updateRate(bookId, newRate) {
    var bookToUpdate = getBookById(bookId);
    if (!bookToUpdate) return;
    bookToUpdate.rate = newRate;
    _saveBooksToStorage();
}

function setSort(sortBy) {
    gSortDiff = (gSortBy === sortBy) ? -gSortDiff : -1;
    gSortBy = sortBy;

}


function createBooks() {
    var books = loadFromStorage(KEY);
    if (!books || !books.length) {
        books = [];
        for (var i = 0; i < 42; i++) {
            books.push(_createBook('Harry Potter', 6.5));
        }

    }
    gBooks = books;
    _saveBooksToStorage();
}

function setPage(pageIdx) {
    gPageIdx = pageIdx - 1;
}

function getPage() {
    return gPageIdx;
}

function getPageSize() {
    return PAGE_SIZE;
}

function _createBook(title, price) {
    var imgUrl = 'imgs/harrypotter.jpg';
    return {
        id: makeId(),
        title,
        price,
        rate: 0,
        imgUrl
    };
}

function _saveBooksToStorage() {
    saveToStorage(KEY, gBooks)
}
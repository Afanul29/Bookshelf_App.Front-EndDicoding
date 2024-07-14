document.addEventListener("DOMContentLoaded", function() {
  const inputBookForm = document.getElementById("inputBook");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  const searchBookForm = document.getElementById("searchBook");

  inputBookForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addNewBook();
  });

  searchBookForm.addEventListener("submit", function(event) {
    event.preventDefault();
    searchBookByTitle();
  });

  // Load existing books from localStorage
  loadBooks();

  function addNewBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = Number(document.getElementById("inputBookYear").value); // Convert to number
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    const id = +new Date(); // Generate unique ID using timestamp

    const book = {
      id: id,
      title: title,
      author: author,
      year: year,
      isComplete: isComplete
    };

    if (isComplete) {
      addToBookshelf(book, completeBookshelfList);
    } else {
      addToBookshelf(book, incompleteBookshelfList);
    }

    inputBookForm.reset();

    // Save book to localStorage
    saveBook(book);
  }

  function addToBookshelf(book, bookshelfList) {
    const bookItem = createBookItem(book);
    bookshelfList.appendChild(bookItem);
  }

  function createBookItem(book) {
    const article = document.createElement("article");
    article.classList.add("book_item");

    const titleElement = document.createElement("h3");
    titleElement.innerText = book.title;

    const authorElement = document.createElement("p");
    authorElement.innerText = "Penulis: " + book.author;

    const yearElement = document.createElement("p");
    yearElement.innerText = "Tahun: " + book.year;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const buttonToggleStatus = document.createElement("button");
    buttonToggleStatus.classList.add("green");
    buttonToggleStatus.innerText = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
    buttonToggleStatus.addEventListener("click", function() {
      toggleBookStatus(article, book);
    });

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("red");
    buttonDelete.innerText = "Hapus buku";
    buttonDelete.addEventListener("click", function() {
      article.remove();
      // Remove book from localStorage
      removeBook(book);
    });

    actionContainer.appendChild(buttonToggleStatus);
    actionContainer.appendChild(buttonDelete);

    article.appendChild(titleElement);
    article.appendChild(authorElement);
    article.appendChild(yearElement);
    article.appendChild(actionContainer);

    return article;
  }

  function toggleBookStatus(bookItem, book) {
    book.isComplete = !book.isComplete;
    const buttonToggleStatus = bookItem.querySelector("button.green");
    buttonToggleStatus.innerText = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";

    // Move book to appropriate shelf
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }

    // Update book data in localStorage
    updateBook(book);
  }

  function loadBooks() {
    const books = JSON.parse(localStorage.getItem("books"));
    if (books) {
      books.forEach(function(book) {
        addToBookshelf(book, book.isComplete ? completeBookshelfList : incompleteBookshelfList);
      });
    }
  }

  function saveBook(book) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  function updateBook(updatedBook) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const index = books.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
      books[index] = updatedBook;
      localStorage.setItem("books", JSON.stringify(books));
    }
  }

  function removeBook(bookToRemove) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter(book => book.id !== bookToRemove.id);
    localStorage.setItem("books", JSON.stringify(books));
  }

  function searchBookByTitle() {
    const searchTerm = document.getElementById("searchBookTitle").value.trim().toLowerCase();
    const allBooks = document.querySelectorAll(".book_item");
    
    allBooks.forEach(book => {
      const title = book.querySelector("h3").innerText.toLowerCase();
      if (title.includes(searchTerm)) {
        book.style.display = "block";
      } else {
        book.style.display = "none";
      }
    });
  }
});
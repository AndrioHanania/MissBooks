import { bookService } from "../services/book.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { utilService } from "../services/util.service.js";
import { Toggle } from "../components/Toggle.jsx";

const { useState, useEffect } = React;
const { useNavigate, useParams } = ReactRouterDOM;


export function BookEdit() {
    const [BookToEdit, setBookToEdit] = useState(bookService.getEmptyBook());
    const navigate = useNavigate();
    const { bookId } = useParams();
    const { title, subtitle, description, authors, listPrice, thumbnail, language, categories, pageCount, publishedDate } = BookToEdit;
    const { amount, currencyCode, isOnSale } = listPrice;
    const isLoginUserAdmin = userService.isLoginUserAdmin();

    if(!isLoginUserAdmin) {
        return (
            <section>
                <h2>Sorry but only admin users allow to edit books!</h2>
            </section>
        );
    }

    useEffect(() => {
        if (bookId) loadBook();
    }, [])

    async function loadBook() {
        try{
            setBookToEdit(await bookService.get(bookId));
        }
        catch(err){
            console.error('Problem getting book', err);
        }
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || '';
                break;

            case 'text':
                if(value.includes(','))
                    value = value.split(',').map(e => e.trim());
                break;

            case 'checkbox':
                value = target.checked;
                break;

            default:
                break;
        }

        if (field.startsWith('listPrice.')) {
            const key = field.split('.')[1];
            setBookToEdit(prevBookToEdit => ({ ...prevBookToEdit, listPrice: { ...prevBookToEdit.listPrice, [key]: value } }));
        }
        else
            setBookToEdit(prevBookToEdit => ({ ...prevBookToEdit, [field]: value }));
    }

    async function onSaveBook(ev) {
        ev.preventDefault();

        try{
            const savedBook = await bookService.save(BookToEdit);
            navigate('/book');
            showSuccessMsg(`Book Saved (id: ${savedBook.id})`);
        }
        catch(err){
            showErrorMsg('Cannot save book');
            console.log('err:', err);
        }
    }

    return (
        <section className="book-edit">
            <form onSubmit={onSaveBook} >
                <div>
                    <label htmlFor="title">Title:</label>
                    <input 
                        onChange={handleChange}
                        value={title}
                        type="text"
                        name="title"
                        id="title"
                    />
                </div>

                <div>
                    <label htmlFor="subtitle">Subtitle:</label>
                    <input 
                        onChange={handleChange}
                        value={subtitle}
                        type="text"
                        name="subtitle"
                        id="subtitle"
                    />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <input 
                        onChange={handleChange}
                        value={description}
                        type="text"
                        name="description"
                        id="description"
                    />
                </div>

                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input 
                        onChange={handleChange}
                        value={amount}
                        type="number"
                        name="listPrice.amount"
                        id="amount" 
                    />
                </div>

                <div>
                    <label htmlFor="currency">Currency:</label>
                    <select 
                        onChange={handleChange}
                        value={currencyCode}
                        type="number"
                        name="listPrice.currencyCode"
                        id="currency"
                    >
                        {[...utilService.currencyCodeToSymbol.entries()].map(([code, symbol]) => (
                            <option key={code} value={code}>
                                {symbol}
                            </option>
                        ))}
                    </select>
                </div>

                <Toggle 
                    isChecked={isOnSale} 
                    onChange={handleChange} 
                    label1="Sale" 
                    label2="Not Sale" 
                    id="isOnSale"
                    name="listPrice.isOnSale"
                />

                <div>
                    <label htmlFor="thumbnail">Thumbnail:</label>
                    <input onChange={handleChange} value={thumbnail} type="text" name="thumbnail" id="thumbnail" />
                </div>

                <div>
                    <label htmlFor="language">Language: </label>
                    <select 
                        value={language}
                        onChange={handleChange}
                        id="language"
                        name="language"
                    >
                        {[...utilService.languages.entries()].map(([code, txt]) => (
                            <option key={code} value={code}>
                                {txt}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="categories">Categories: </label>
                    <select 
                        multiple 
                        value={categories}
                        onChange={handleChange}
                        id="categories"
                        name="categories"
                    >
                        {[...utilService.categories].map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="pageCount">Pages: </label>
                    <input 
                        value={pageCount}
                        onChange={handleChange}
                        type="number"
                        id="pageCount"
                        name="pageCount"
                    />
                </div>

                <div>
                    <label htmlFor="publishedDate">Published Date:</label>
                    <input 
                        value={publishedDate}
                        onChange={handleChange}
                        type="number"
                        max={new Date().getFullYear()}
                        id="publishedDate"
                        name="publishedDate"
                    />
                </div>

                <div>
                    <label htmlFor="authors">Authors: </label>
                    <input 
                        value={authors.map(author => author.trim()).join(', ')}
                        onChange={handleChange}
                        data-type="array" 
                        type="text"
                        id="authors"
                        name="authors"
                    />
                </div>

                <button>Save</button>
            </form>
        </section>
    );
};
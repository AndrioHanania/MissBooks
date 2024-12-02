import { Toggle } from "./Toggle.jsx";
import { utilService } from "../services/util.service.js";

const { useState, useEffect, useRef, } = React;
const { useSearchParams  } = ReactRouterDOM;

export function BookFilter({ defaultFilter, onSetFilter }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterByToEdit, setFilterByToEdit] = useState(() =>
        utilService.paramsToFilter(searchParams, defaultFilter)
    );
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter)).current;
    const { txt, listPrice, language, category, pages, page_position, publish_year, publish_year_position } = filterByToEdit;
    const { amount, currencyCode, sale, amount_position } = listPrice;

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
        setSearchParams(utilService.filterToParams(filterByToEdit));
    }, [filterByToEdit]);

    function handleChange({ target }) {
        const field = target.name;
        let value = target.value;

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || '';
                break;

            case 'checkbox':
                value = target.checked;
                break;

            default: 
                break;
        }

        if (field.startsWith('listPrice.')) {
            const key = field.split('.')[1];
            setFilterByToEdit(prevFilter => ({ ...prevFilter, listPrice: { ...prevFilter.listPrice, [key]: value } }));
        }
        else
            setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }));
    }

    function onSubmitFilter(ev) {
        ev.preventDefault();
        onSetFilter(filterByToEdit);
    }

    function onReset() {
        setFilterByToEdit(defaultFilter);
    }

    return (
        <section className="book-filter">
            <h2>Filter Books</h2>

            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Search: </label>
                <input 
                    value={txt}
                    onChange={handleChange}
                    type="text" 
                    id="txt" 
                    name="txt"
                />

                <div style={{ display: 'flex' }}>
                    <div>
                        <label htmlFor="amount">Amount: </label>
                        <input 
                            value={amount}
                            onChange={handleChange}
                            type="number"
                            id="amount"
                            name="listPrice.amount"
                        />
                    </div>

                    <Toggle 
                        isChecked={amount_position} 
                        onChange={handleChange} 
                        label1="Above" 
                        label2="Below" 
                        id="amount_position" 
                        name="listPrice.amount_position"
                    />
                </div>


                <div>
                    <label htmlFor="sale">Sale: </label>
                    <select 
                        value={sale}
                        onChange={handleChange}
                        id="sale"
                        name="listPrice.sale"
                    >
                        <option value="sale">On Sale</option>
                        <option value="not sale">Not Sale</option>
                        <option value="all">All</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="currency">Currency: </label>
                    <select 
                        value={currencyCode}
                        onChange={handleChange}
                        id="currency"
                        name="listPrice.currencyCode"
                    >
                        <option value="all">All</option>

                        {[...utilService.currencyCodeToSymbol.entries()].map(([code, symbol]) => (
                            <option key={code} value={code}>
                                {symbol}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="language">Language: </label>
                    <select 
                        value={language}
                        onChange={handleChange}
                        id="language"
                        name="language"
                    >
                        <option value="all">All</option>

                        {[...utilService.languages.entries()].map(([code, txt]) => (
                            <option key={code} value={code}>
                                {txt}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="category">Category: </label>
                    <select 
                        value={category}
                        onChange={handleChange}
                        id="category"
                        name="category"
                    >
                        <option value="all">All</option>

                        {[...utilService.categories].map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex' }}>
                    <div>
                        <label htmlFor="pages">Pages: </label>
                        <input 
                            value={pages}
                            onChange={handleChange}
                            type="number"
                            id="pages"
                            name="pages"
                        />
                    </div>

                    <Toggle 
                        isChecked={page_position} 
                        onChange={handleChange} 
                        label1="Above" 
                        label2="Below" 
                        id="page_position" 
                        name="page_position"
                    />
                </div>

                <div style={{ display: 'flex' }}>
                    <div>
                        <label htmlFor="publish_year">Publish Year:</label>
                        <input 
                            value={publish_year}
                            onChange={handleChange}
                            type="number"
                            max={new Date().getFullYear()}
                            id="publish_year"
                            name="publish_year"
                        />
                    </div>

                    <Toggle
                        isChecked={publish_year_position} 
                        onChange={handleChange} 
                        label1="Above" 
                        label2="Below" 
                        id="publish_year_position" 
                        name="publish_year_position"
                    />
                </div>
                <button type="button" onClick={onReset}>Reset</button>
            </form>
        </section>
    );
};
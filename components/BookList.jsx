import { BookPreview } from "./BookPreview.jsx";
import { userService } from "../services/user.service.js";

const { Link } = ReactRouterDOM;
const { useNavigate } = ReactRouter;
const { useState, useEffect, } = React;

export function BookList({ books, onRemove }) {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function checkAdminStatus() {
            const adminStatus = await userService.isLoginUserAdmin();
            setIsAdmin(adminStatus);
        }
        checkAdminStatus();
    }, []);

    return (
        <ul className="book-list">
            {books.map(book =>
                <li key={book.id} onClick={() => navigate(`/book/${book.id}`)}>
                    {book.listPrice.isOnSale && (
                        <img className="sale-icon" src="./assets/img/sale-icon.svg" alt="sale-icon"/>
                    )}
                    <BookPreview book={book}/>
                    <section>
                        {isAdmin && (<button ><Link to={`/book/edit/${book.id}`}>Edit</Link></button>)}
                        {isAdmin && (<button onClick={() => onRemove(book.id)}>x</button>)}
                    </section>
                </li>
            )}
        </ul>
    );
};
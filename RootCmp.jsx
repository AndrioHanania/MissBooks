
import { AppHeader } from "./components/AppHeader.jsx";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Team } from "./components/Team.jsx"
import { Vision } from "./components/Vision.jsx"
import { BookIndex } from "./pages/BookIndex.jsx";
import { BookDetails } from "./pages/BookDetails.jsx";
import { BookEdit } from "./pages/BookEdit.jsx";
import { SearchBook } from "./pages/SearchBook.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { NotFound } from './components/NotFound.jsx';
import { UserMsg } from "./components/UserMsg.jsx";

const Router = ReactRouterDOM.HashRouter
const { Routes, Route, Navigate } = ReactRouterDOM

export function RootCmp() {
    return (
        <Router>
            <section className="app main-layout">
                <AppHeader />
                <main className="main-layout">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About />}>
                            <Route path="/about/team" element={<Team />} />
                            <Route path="/about/vision" element={<Vision />} />
                        </Route>
                        <Route path="/book" element={<BookIndex />} />
                        <Route path="/book/:bookId" element={<BookDetails />} />
                        <Route path="/book/edit" element={<BookEdit />} />
                        <Route path="/book/edit/:bookId" element={<BookEdit />} />
                        <Route path="book/search" element={<SearchBook/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <UserMsg/>
            </section>
        </Router>
    );
};
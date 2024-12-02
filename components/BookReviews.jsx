import { bookReviewService } from "../services/book-review.service.js";
import { ReviewList } from "./ReviewList.jsx";
import { ReviewAdd } from "./ReviewAdd.jsx";

const { useEffect, useState } = React;

export function BookReviews({ bookId }) {
    const [bookReviews, setBookReviews] = useState([]);

    useEffect(() => {
        loadBookReviews();
    }, []);

    async function loadBookReviews() {
        try{
            setBookReviews(await bookReviewService.query({ bookId }));
        }
        catch(err){
            console.error('Problem getting book reviews', err);
        }
    }

    function onRemoveBookReview(bookReviewId) {
        setBookReviews(prevBookReviews => prevBookReviews.filter(bookReview => bookReview.id != bookReviewId));
    }

    function onAddReview(id, reviewId) {
        setBookReviews(prevBookReviews => [
            ...prevBookReviews,
            { id, bookId, reviewId }
        ]);
    }

    return (
        <section style={{ alignSelf: 'end' }}>
            <ReviewAdd bookId={bookId} onAdd={onAddReview}/>

            <ReviewList bookReviews={bookReviews} onRemove={onRemoveBookReview}/>
        </section>
    );
};

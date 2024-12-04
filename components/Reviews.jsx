import { reviewService } from "../services/review.service.js";
import { ReviewList } from "./ReviewList.jsx";
import { ReviewAdd } from "./ReviewAdd.jsx";

const { useEffect, useState } = React;

export function Reviews({ bookId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        loadReviews();
    }, [bookId]);

    async function loadReviews() {
        try{
            setReviews(await reviewService.query({ bookId }));
        }
        catch(err){
            console.error('Problem getting book reviews', err);
        }
    }

    function onRemoveBookReview(reviewId) {
        setReviews(prevReviews => prevReviews.filter(review => review.id != reviewId));
    }

    function onAddReview(savedReview) {
        setReviews(prevReviews => [
            ...prevReviews,
            savedReview
        ]);
    }

    return (
        <section style={{ alignSelf: 'end' }}>
            <ReviewAdd bookId={bookId} onAdd={onAddReview}/>

            <ReviewList reviews={reviews} onRemove={onRemoveBookReview}/>
        </section>
    );
};

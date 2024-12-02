import { reviewService } from "../services/review.service.js";
import { bookReviewService } from "../services/book-review.service.js";
import { utilService } from "../services/util.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { RateByFactory } from "./rating/RateByFactory.jsx";

const { useEffect, useState } = React;

export function Review({ reviewId, onRemove }) {
    const [review, setReview] = useState(reviewService.getEmptyReview());

    useEffect(() => {
        loadReview();
    }, [])

    async function loadReview() {
        try{
            setReview(await reviewService.get(reviewId));
        }
        catch(err){
            console.error('Problem getting review', err);
        }
    }

    async function onUpdateReadAt(event) {
        const newReadAt = new Date(event.target.value);

        try{
            await reviewService.save({...review, readAt: newReadAt});
            setReview(prevReview => ({ ...prevReview, readAt: newReadAt }));
        }
        catch(err){
            showErrorMsg('Cannot updating review readAt');
            console.error('Problem updating review readAt', err);
        }
    };

    async function onUpdateRate({ target }) {
        const field = target.name;
        let value = target.value;

        try{
            await reviewService.save({...review, [field]: value});
            setReview(prevReview => ({ ...prevReview, [field]: value }));
        }
        catch(err){
            showErrorMsg('Cannot updating review rate');
            console.error('Problem updating review rate', err);
        }
    }

    async function onRemoveReview() {
        try{
            console.log('review.id: ', review.id)

            const bookReview = (await bookReviewService.query({ reviewId: review.id }))[0];
            console.log('bookReview: ', bookReview)
            await bookReviewService.remove(bookReview.id);
            onRemove(bookReview.id);
        }
        catch(err){
            showErrorMsg('Cannot removing review');
            console.error('Problem removing review', err);
        }
    }

    if (!review) return null;

    return (
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', border: '1px solid blue', borderRadius: '8px', padding: '5px 10px' }}>
            <button 
                onClick={onRemoveReview}////
            >
                x
            </button>
            
            <p style={{ margin: 0 }}>{review.fullname}</p>

            <RateByFactory
                val={review.rating}
                onChange={onUpdateRate}////
                type={review.rateBy}
                isDisabled={true}////
                //length={5}
            />

            <input
                id="date-picker"
                type="date"
                value={utilService.formatDate(review.readAt)}
                onChange={onUpdateReadAt}////
                disabled={true}////
            />
        </div>
    );
}

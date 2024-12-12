import { reviewService } from "../services/review.service.js";
import { userService } from "../services/user.service.js";
import { utilService } from "../services/util.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { ratingMethods, RateByFactory } from './rating/RateByFactory.jsx';
import { ValidationError } from "../errors/ValidationError.js";

const { useState, useEffect } = React;

export function ReviewAdd({ bookId, onAdd }) {
    const [reviewToAdd, setReviewToAdd] = useState(null);

    useEffect(() => {
        setReviewToAdd(reviewService.getEmptyReview(bookId));
    }, [bookId]);

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

            case 'date':
                value = value;
                break;

            default:
                break;
        }

        setReviewToAdd(prevReviewToAdd => ({ ...prevReviewToAdd, [field]: value }));
    }

    async function onSaveReview(ev) {
        ev.preventDefault();

        try{
            const savedReview = await reviewService.save({...reviewToAdd, fullname: userService.getLoggedinUser().fullname });
            onAdd(savedReview);
            showSuccessMsg(`Review Saved`);
        }
        catch(err){
            if (err instanceof ValidationError)
                showErrorMsg(err.message);
            else
                showErrorMsg('Cannot save review');

            console.error('err:', err);
        }
    }

    function handleRatingMethodChange(method) {
        setReviewToAdd(prevReviewToAdd => ({ ...prevReviewToAdd, rateBy: method, rating: 0 }));
    };
    
    if (!reviewToAdd) return <p>Loading...</p>;

    const { rating, rateBy, readAt } = reviewToAdd;

    return (
        <section className="review-add">
            <h2 className="review-add-header">Book Rating</h2>

            <form className="review-add-form" onSubmit={onSaveReview}>
                <div>
                    <label htmlFor="readAt">Read at:</label>
                    <input 
                        onChange={handleChange}
                        value={utilService.formatDate(readAt)}
                        type="date"
                        name="readAt"
                        id="readAt"
                    />
                </div>

                <div className="radio-btns">
                    {ratingMethods.map(method => (
                        <label key={method.id} className="radio-label">
                            <input
                                type="radio"
                                name="ratingMethod"
                                value={method.id}
                                checked={rateBy === method.id}
                                onChange={() => handleRatingMethodChange(method.id)}
                                className="radio-btn"
                            />

                            {method.label}
                        </label>
                    ))}
                </div>

                <RateByFactory
                    val={rating}
                    onSelected={handleChange}
                    type={rateBy}
                />

                {rating !== null && (
                    <div className="rating-res">
                        Your Rating: {rating}
                    </div>
                )}

                <button disabled={userService.isLogin()}>Save</button>
            </form>
        </section>
    );
};

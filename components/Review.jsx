import { reviewService } from "../services/review.service.js";
import { utilService } from "../services/util.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { RateByFactory } from "./rating/RateByFactory.jsx";
import { userService } from "../services/user.service.js";

const { useEffect, useState } = React;

export function Review({ reviewId, onRemove }) {
    const [review, setReview] = useState(reviewService.getEmptyReview(''));
    const [isLoginUserAdminOrOwner, setIsLoginUserAdminOrOwner] = useState(userService.isLoginUserAdmin());

    useEffect(() => {
        loadReview();
    }, [])

    async function loadReview() {
        try{
            const newReview = await reviewService.get(reviewId);
            const loginUser = userService.getLoggedinUser();

            setReview(newReview);
            setIsLoginUserAdminOrOwner(prev => prev || newReview.fullname === loginUser.fullname);
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
            await reviewService.remove(review.id);
            onRemove(bookReview.id);
        }
        catch(err){
            showErrorMsg('Cannot removing review');
            console.error('Problem removing review', err);
        }
    }

    if (!review) return null;

    return (
        <div className="review">
            {isLoginUserAdminOrOwner && (<button onClick={onRemoveReview}>x</button>)}
            
            <p style={{ margin: 0 }}>{review.fullname}</p>

            <RateByFactory
                val={review.rating}
                onChange={onUpdateRate}
                type={review.rateBy}
                isDisabled={!isLoginUserAdminOrOwner}
            />

            <input
                id="date-picker"
                type="date"
                value={utilService.formatDate(review.readAt)}
                onChange={onUpdateReadAt}
                disabled={!isLoginUserAdminOrOwner}
            />
        </div>
    );
}

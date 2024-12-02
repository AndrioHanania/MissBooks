const { useState } = React;

export function LongTxt({ txt, length = 100 }) {
    const [isMore, setIsMore] = useState(false); 
    const isNeccery = txt.length < 100;

    return (
        <section className="long-txt">
            <p>{isNeccery || isMore ? txt : (txt.slice(0, length) + '...')}</p>
            {!isNeccery && <a onClick={() => setIsMore(prev => !prev)}>{isMore ? "Show Less" : "Show More"}</a>}
        </section>
    );
};
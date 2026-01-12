import error from '../assets/error.png';

interface Params {
    errorMessage?: string | undefined;
};

function DisplayError({ errorMessage }: Params) {
    const displayMessage = (errorMessage || 'Unknown Error Occured');
    console.log('DisplayError rendered with message:', displayMessage); // Debug render

    return (
        <div className="error-container">
            <div className="error-child-container">
                <img src={error} alt="" className="error-image" />
                <div className="error-message">
                    {displayMessage}
                </div>
            </div>
        </div>
    )
}

export default DisplayError;
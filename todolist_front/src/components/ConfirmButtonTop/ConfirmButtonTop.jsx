/** @jsxImportSource @emotion/react */
import * as s from "./style";
function ConfirmButtonTop({ onSubmit, onCancel, disabled }) {

    const handleCancelClick = () => {
        onCancel();
    }

    const handleSubmitClick = () => {
        onSubmit();
    }

    return (
        <div css={s.layout}>
            <button onClick={handleCancelClick}>취소</button>
            <button onClick={handleSubmitClick} disabled={disabled}>완료</button>
        </div>
    );
}

export default ConfirmButtonTop;
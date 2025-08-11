import React from "react";
import "../../css/base/Modal.css";

const Modal = ({ children, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;

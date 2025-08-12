import React from "react";
import "../../css/base/Modal.css";

const Modal = ({ children, onClose , width = "30vw"  }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                style={{ width: width }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;

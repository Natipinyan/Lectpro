import React, { useState, useRef } from "react";
import NotificationPopup from "./NotificationPopup";
import Modal from "../base/Modal";
import axios from "axios";
import '../../css/projects/upApprovedFile.css'
const ApprovedUploadModal = ({ project, onClose }) => {
    const [wordFile, setWordFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [wordFileName, setWordFileName] = useState("גרור קובץ הצעה או לחץ לבחירה");
    const [signatureFileName, setSignatureFileName] = useState("גרור דוגמת חתימה או לחץ לבחירה");
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    const wordInputRef = useRef(null);
    const signatureInputRef = useRef(null);

    const showNotification = (message, type) => setNotification({ message, type });
    const handleCloseNotification = () => setNotification(null);
    const handleDragOver = (e) => e.preventDefault();

    const handleDropWord = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || (!file.name.endsWith(".doc") && !file.name.endsWith(".docx"))) {
            showNotification("אנא העלה קובץ Word בלבד.", "error");
            return;
        }
        setWordFile(file);
        setWordFileName(file.name);
    };

    const handleDropSignature = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith("image/")) {
            showNotification("אנא העלה קובץ תמונה בלבד.", "error");
            return;
        }
        setSignatureFile(file);
        setSignatureFileName(file.name);
    };

    const handleFileChange = (setter, nameSetter, allowedTypes) => (e) => {
        const file = e.target.files[0];
        if (!file || !allowedTypes(file)) {
            showNotification("קובץ לא חוקי.", "error");
            return;
        }
        setter(file);
        nameSetter(file.name);
    };

    const handleUpload = async () => {
        if (!wordFile || !signatureFile) {
            showNotification("אנא בחר את כל הקבצים לפני השליחה.", "error");
            return;
        }

        const wordExt = wordFile.name.split('.').pop().toLowerCase();
        if (!['doc', 'docx'].includes(wordExt)) {
            showNotification("קובץ ההצעה חייב להיות Word (.doc או .docx).", "error");
            return;
        }

        const signatureExt = signatureFile.name.split('.').pop().toLowerCase();
        if (!['jpg', 'jpeg', 'png'].includes(signatureExt)) {
            showNotification("דוגמת החתימה חייבת להיות תמונה (.jpg או .png בלבד).", "error");
            return;
        }

        const formData = new FormData();
        formData.append("proposal", wordFile);
        formData.append("signature", signatureFile);

        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/upload/${project.id}/uploadTwoFiles`,
                formData,
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.data.success) {
                showNotification(response.data.message, "success");
                setWordFile(null);
                setSignatureFile(null);
                setWordFileName("גרור קובץ הצעה או לחץ לבחירה");
                setSignatureFileName("גרור דוגמת חתימה או לחץ לבחירה");
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                showNotification(response.data.message || "אירעה שגיאה בהעלאה", "error");
            }
        } catch (err) {
            if (err.response?.data?.message) {
                showNotification(err.response.data.message, "error");
            } else {
                showNotification("שגיאת רשת בשליחת הקבצים", "error");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose} width="50vw">
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={handleCloseNotification}
                />
            )}
            <div className="apSignWord">
                <h2>העלאת מסמך מאושר: {project.title}</h2>

                <div className="upload-section">
                    <h3>קובץ הצעה (Word)</h3>
                    <div
                        className="upload-container"
                        onDragOver={handleDragOver}
                        onDrop={handleDropWord}
                        onClick={() => wordInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={wordInputRef}
                            style={{ display: "none" }}
                            accept=".doc,.docx"
                            onChange={handleFileChange(
                                setWordFile,
                                setWordFileName,
                                (file) => file.name.endsWith(".doc") || file.name.endsWith(".docx")
                            )}
                        />
                        <div className="upload-text">{wordFileName}</div>
                    </div>
                </div>

                <div className="upload-section">
                    <h3>דוגמת חתימה (תמונה)</h3>
                    <div
                        className="upload-container"
                        onDragOver={handleDragOver}
                        onDrop={handleDropSignature}
                        onClick={() => signatureInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={signatureInputRef}
                            style={{ display: "none" }}
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange(
                                setSignatureFile,
                                setSignatureFileName,
                                (file) => {
                                    const ext = file.name.split('.').pop().toLowerCase();
                                    return ['jpg', 'jpeg', 'png'].includes(ext);
                                }
                            )}
                        />
                        <div className="upload-text">{signatureFileName}</div>
                    </div>
                </div>

                <div className="upload-btn-wrapper">
                    <button onClick={handleUpload} disabled={loading} className="upload-submit-btn">
                        {loading ? "טוען..." : "שמור"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ApprovedUploadModal;

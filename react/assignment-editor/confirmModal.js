import React from 'react';
import Modal from '../shared/modal';
import { confirmable, createConfirmation } from 'react-confirm';
import PropTypes from 'prop-types';

const ConfirmModal = ({okLabel, cancelLabel, title, list, show, proceed, dismiss, cancel, confirmation, options}) => {
            // let listView = null;
            // if(list && list.length != 0){
            //     listView = (
            //         <ul>{
            //             list.map((elem) => {
            //             return (<li>{elem}</li>);
            //             })
            //         }</ul>);
            // }
    return (
                <Modal close={dismiss} title={title}>
                  <div id="modal-text">
                    <div dangerouslySetInnerHTML={{ __html: confirmation}}></div>
                  </div>
                  <div id="modal-footer">
                    <button className="button" id="cancel-button" onClick={proceed}>{okLabel}</button>
                    <button className="button" id="confirm-button" onClick={cancel}>{cancelLabel}</button>
                  </div>
                </Modal>
    );

};
ConfirmModal.propTypes = {
    okLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    title: PropTypes.string,
    list: PropTypes.array,
    show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
    proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
    cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
    dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
    confirmation: PropTypes.string,  // arguments of your confirm function
    options: PropTypes.object        // arguments of your confirm function
};

const confirm = createConfirmation(confirmable(ConfirmModal));
export default confirm;

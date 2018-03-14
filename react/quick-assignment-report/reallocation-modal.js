import React, { Component } from 'react';
import Modal from '../shared/modal';
import Select from 'react-select';
//import Modal from 'react-modal';
const ReallocationModal = ({title, close}) => {
    console.log(title);
    const modalContent = (<form role="form" className="section">
    <ul>
        <li><p>Reallocate task to user: </p><Select clearable={false} /></li>
        <li><p>Mark as extra credit: </p><input type="checkbox"></input></li>
        <li><button type="button">Submit</button></li>
    </ul>
    </form>)
    return (<Modal title={title} close={close.bind(this)} children={modalContent}></Modal>);
};

export default ReallocationModal;
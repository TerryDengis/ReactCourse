import React, { useReducer } from 'react';
import uuid from 'uuid';

import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACS,
  CLEAR_FILTER
} from '../types';

const ContactState = props => {
  const initialState = {
    contacts: [
      {
        type: 'professional',
        id: '1',
        name: 'Harry K',
        email: 'Harry@mail.com',
        phone: '403-555-9876'
      },
      {
        type: 'personal',
        id: '2',
        name: 'Jill J',
        email: 'Jill@mail.com',
        phone: '403-222-2345'
      },
      {
        type: 'personal',
        id: '3',
        name: 'Ted J',
        email: 'Ted@mail.com',
        phone: '403-555-1234'
      }
    ]
  };

  const [state, dispatch] = useReducer(contactReducer, initialState);

  // add contact
  const addContact = contact => {
    contact.id = uuid.v4();
    dispatch({ type: ADD_CONTACT, payload: contact });
  };
  // delete contact

  // set current contact

  // clear current contact

  // update contact

  // filter contacts

  // clear filter

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        addContact
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;

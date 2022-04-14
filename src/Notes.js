import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteNote, fetchNotes } from './store/notesSlice';

const Notes = ({notes, loadNotes, removeNote})=> {
  const dispatch = useDispatch();
//refactor to use lifecyle methods instead of hooks
  useEffect(() => {
    loadNotes()
    .then((res) => {
      dispatch({ type: 'FETCH_NOTES', payload: res })
    })
  }, []) 

  const onRemoveNote = (noteId) => { 
    removeNote(noteId)
    .then(() => {
      dispatch({ type: 'DELETE_NOTE', payload: noteId }) 
    })
  }

  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        {notes.map(note => {
          return <div key={note.id}>
            <li>{note.text}</li>
            <div onClick={() => onRemoveNote(note.id)}>Delete</div>
          </div>
          })}
      </div>
    </div>
  );
};

const mapState = state => {
  return { notes: state.notes }
}
//if you want to change something in store
const mapDispatchToProps = (dispatch)=> {
  return {
    loadNotes: ()=> dispatch(fetchNotes()),
    removeNote: (noteId)=> dispatch(deleteNote(noteId))
  }
}
export default connect(mapState, mapDispatchToProps)(Notes);

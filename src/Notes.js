import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Notes = ({notes})=> {
  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        {notes.map(note => <li key={note.id}>{note.text}</li>)}
      </div>
    </div>
  );
};

const mapState = state => state;
//if you want to change something in store
const mapDispatchToProps = (dispatch)=> {
  return {
    loadNotes: ()=> dispatch(fetchNotes())
  }
}
export default connect(mapState, mapDispatchToProps)(Notes);

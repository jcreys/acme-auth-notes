import axios from 'axios';

const notes = (state = [], action)=> {
  if (action.type === 'FETCH_NOTES'){
    return action.payload;
  } else if (action.type === 'DELETE_NOTE') {
    return state.filter((item) => item.id !== action.payload);
  }
  return state;
};

const fetchNotes = () => {
  return async()=> {
    const token = window.localStorage.getItem('token');
    let response = await axios.get('/api/notes', {
      headers: {
        authorization: token
      }
    });
    return response.data    
  }
}

const deleteNote = (noteId) => {
    return async()=> {
      const token = window.localStorage.getItem('token');
      let response = await axios.delete(`/api/notes/${noteId}`, {
        headers: {
          authorization: token
        }
      });
      return response.data    
    }
  }
  

export { fetchNotes, deleteNote };
export default notes;


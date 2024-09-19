export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#RRGGBBAA',
  },
  chatBox: {
    width: '400px',
    height: '600px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    backgroundImage: 'url("https://i.pinimg.com/564x/74/c7/07/74c707db416ed040c5af26e8e437d818.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flexDirection: 'column' as 'column', // Explicitly cast flexDirection to 'column'
  },
  messages: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto' as 'auto', // Explicitly cast overflowY to 'auto'
  },
  message: {
    padding: '10px 15px',
    margin: '10px 0',
    borderRadius: '20px',
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: '#fff',
    alignSelf: 'flex-end',
  },
  inputBox: {
    display: 'flex',
    padding: '20px',
    borderTop: '1px solid #e0e0e0',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #e0e0e0',
    marginRight: '10px',
  },
  sendButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};

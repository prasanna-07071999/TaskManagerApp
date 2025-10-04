import React from 'react';

const AuthContext = React.createContext();

const AuthConsumer = AuthContext.Consumer;

export { AuthConsumer };
export default AuthContext;

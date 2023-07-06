import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const UserContext = React.createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>);
}

export { UserContext, UserProvider };

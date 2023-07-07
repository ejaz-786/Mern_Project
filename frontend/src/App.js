import { useEffect, useState } from "react";
function App() {
  const [state, setState] = useState([]);

  // login user;-
  const submitData = async () => {
    const payload = {
      email: "harshsharma1@gmail.com",
      password: "harsh5@12345",
    };
    try {
      const response = await fetch(`api/v1/login`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json;charset=UTF-8",
        },
      });
      const data = await response.json();
      console.log("data:", data);
    } catch (err) {
      console.log("eror:", err);
    }
  };

  return (
    <div className="App">
      <h1>App is Running</h1>
      <button onClick={() => submitData()}>Login</button>
    </div>
  );
}

export default App;

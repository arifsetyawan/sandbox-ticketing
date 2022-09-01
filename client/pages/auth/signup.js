import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="mb-3 form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3 form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            className="form-control"
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default signup;

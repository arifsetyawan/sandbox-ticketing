import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => Router.push("/"),
    body: {},
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signin you out</div>;
};

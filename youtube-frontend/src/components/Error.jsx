import { useRouteError } from "react-router-dom"

function Error() {

    const error = useRouteError();
  return (
    <div>
        <h1>Oops... !</h1>
        <h2>{error.data}</h2>
        <h3>Error Status Code : {error.status}</h3>
    </div>
  )
}

export default Error
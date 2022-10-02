import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../store/authContext";

import { ColorRing as Loader } from "react-loader-spinner";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const loginHandler = (e) => {
    e.preventDefault();

    setLoading(true);

    // send req to backend route
    axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/users/login`,
      data: {
        email,
        password,
      },
    })
      .then((data) => {
        // console.log(data);
        auth.login(data.data.token);
        toast.info("Logged-in successfully!");
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        toast.info(
          err.response.data.error,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
          {
            theme: "dark",
          }
        );

        setLoading(false);
      });
  };
  return (
    <div className="login_wrapper">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1>Login</h1>
      <div className="login_form">
        <form action="" onSubmit={loginHandler}>
          <div className="login_formcontrol">
            <label htmlFor="email">Email: </label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} required id="email" />
          </div>
          <div className="login_formcontrol">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              required
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="login_formcontrol">
            <button className="loginform_btn">Login now</button>
          </div>
        </form>
        {loading && (
          <Loader
            visible={true}
            height="150"
            width="150"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#212529"]}
          />
        )}
        {/* <div className="login_social">
          <p>Login with: </p>
          <div className="login_social_form_icons">
            <Link to="/">
              <i className="fa-brands fa-facebook"></i>
            </Link>
            <Link to="/">
              {" "}
              <i className="fa-brands fa-twitter"></i>
            </Link>
            <Link to="/">
              <i className="fa-brands fa-github"></i>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;

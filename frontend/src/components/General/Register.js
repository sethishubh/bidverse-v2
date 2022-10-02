import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../store/authContext";
import { Link, useNavigate } from "react-router-dom";

import { ColorRing as Loader } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import "./register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  let redirectTimer;

  const signUpHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    // send req to backend route
    axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/users/signup`,
      data: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      },
    })
      .then((data) => {
        toast.info("Successfully registered!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        auth.login(data.data.token);

        setLoading(false);
        redirectTimer = setTimeout(() => {
          navigate("/");
        }, 2900);
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

  const nameUpdateHandler = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: e.target.value,
    }));
  };

  const emailUpdateHandler = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      email: e.target.value,
    }));
  };

  const passwordUpdateHandler = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      password: e.target.value,
    }));
  };

  const passwrdConfirmUpdateHandler = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      passwordConfirm: e.target.value,
    }));
  };

  useEffect(() => {
    return () => {
      clearTimeout(redirectTimer);
    };
  }, [redirectTimer]);

  return (
    <div className="signup_wrapper">
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
      <h1>Signup</h1>
      <div className="signup_form">
        <form action="" onSubmit={signUpHandler}>
          <div className="signup_formcontrol">
            <label htmlFor="name">Full name: </label>
            <input type="name" required id="name" value={formData.name} onChange={nameUpdateHandler} />
          </div>
          <div className="signup_formcontrol">
            <label htmlFor="email">Email: </label>
            <input type="email" required id="email" value={formData.email} onChange={emailUpdateHandler} />
          </div>
          <div className="signup_formcontrol">
            <label htmlFor="password">Password: </label>
            <input type="password" required id="password" value={formData.password} onChange={passwordUpdateHandler} />
          </div>
          <div className="signup_formcontrol">
            <label htmlFor="confirm_password">Confirm password: </label>
            <input
              type="confirm_password"
              required
              id="confirm_password"
              value={formData.passwordConfirm}
              onChange={passwrdConfirmUpdateHandler}
            />
          </div>
          <div className="signup_formcontrol">
            <button className="signupform_btn">Register now</button>
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
        {/* <div className="signup_social">
          <p>Signup with: </p>
          <div className="signup_social_form_icons">
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

export default Register;

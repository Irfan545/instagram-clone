

const LoginForm = () => {
    return ( 
    <div className="parent-login">
        <div className="login-form">
            <div className="logo-div">Instagram</div>
            <div className="form-div">
            <form>
            <lable>Email:</lable>
            <input type='email' placeholder="Email"/>
            <lable>Password:</lable>
            <input type='password' placeholder="Password"/>
            <button>Log In</button>
            </form>
            <div className="forget-pass">
                <a className="link" href="#">Forgotton your password?</a>
            </div>
            </div>
        </div>
    </div> );
}
 
export default LoginForm;
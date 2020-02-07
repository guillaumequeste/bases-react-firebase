Dans cet exemple, tous les fichiers sont au même niveau dans le dossier "src", sauf le fichier ".env" qui est à la racine du projet

- Créer projet React (bases-react-firebase)

- Créer projet Firebase : console -> add new project -> entrer le nom du projet (on n'active pas GoogleAnalytics)

- Authentification :
    - Authentification

    - Mode de connexion : Adresse e-mail/Mot de passe -> activer

    - Settings (roue -> paramètres du projet)

    - ajouter une application (bases-react-firebase)

    - voir la configuration de Firebase

    - dans le projet React, installer les dépendances : "firebase" et "react-router-dom"

    - créer un fichier ".env" à la racine du projet :
        ## Firebase
        REACT_APP_FIREBASE_KEY="AIzaSyDXSToZY7oJp_xMrt04MosmuB1fC8r_8qw"
        REACT_APP_FIREBASE_DOMAIN="bases-react-firebase.firebaseapp.com"
        REACT_APP_FIREBASE_DATABASE="https://bases-react-firebase.firebaseio.com"
        REACT_APP_FIREBASE_PROJECT_ID="bases-react-firebase"
        REACT_APP_FIREBASE_STORAGE_BUCKET="bases-react-firebase.appspot.com"
        REACT_APP_FIREBASE_SENDER_ID=258838541033
        REACT_APP_FIREBASE_APP_ID="1:258838541033:web:f85e8256e0148879063678"

    - dans le dossier src, créer un fichier "base.js":
        import * as firebase from "firebase/app";
        import "firebase/auth";
        const app = firebase.initializeApp({
            apiKey: process.env.REACT_APP_FIREBASE_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
            databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID
        });
        export default app;

    - dans le fichier "App.js", créer les routes dans des balises <AuthProvider>...</AuthProvider> :
        import React from "react";
        import "./App.css";
        import { BrowserRouter as Router, Route } from "react-router-dom";
        import Home from "./Home";
        import Login from "./Login";
        import SignUp from "./SignUp";
        import { AuthProvider } from "./Auth";
        import PrivateRoute from "./PrivateRoute";
        const App = () => {
        return (
            <AuthProvider>
            <Router>
                <div>
                <PrivateRoute exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={SignUp} />
                </div>
            </Router>
            </AuthProvider>
        );
        };
        export default App;

    - créer un fichier "PrivateRoute.js" :
        import React, { useContext } from "react";
        import { Route, Redirect } from "react-router-dom";
        import { AuthContext } from "./Auth";
        const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
        const {currentUser} = useContext(AuthContext);
        return (
            <Route
            {...rest}
            render={routeProps =>
                !!currentUser ? (
                <RouteComponent {...routeProps} />
                ) : (
                <Redirect to={"/login"} />
                )
            }
            />
        );
        };
        export default PrivateRoute

    - créer un fichier "Auth.js" :
        import React, { useEffect, useState } from "react";
        import app from "./base.js";
        export const AuthContext = React.createContext();
        export const AuthProvider = ({ children }) => {
        const [currentUser, setCurrentUser] = useState(null);
        useEffect(() => {
            app.auth().onAuthStateChanged(setCurrentUser);
        }, []);
        return (
            <AuthContext.Provider
            value={{
                currentUser
            }}
            >
            {children}
            </AuthContext.Provider>
        );
        };
    
    - créer un fichier "Home.js" :
        import React from "react";
        import app from "./base";
        const Home = () => {
        return (
            <>
            <h1>Home</h1>
            <button onClick={() => app.auth().signOut()}>Sign out</button>
            </>
        );
        };
        export default Home;

    - créer un fichier "SignUp.js" :
        import React, { useCallback } from "react";
        import { withRouter } from "react-router";
        import app from "./base";
        const SignUp = ({ history }) => {
        const handleSignUp = useCallback(async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
            await app
                .auth()
                .createUserWithEmailAndPassword(email.value, password.value);
            history.push("/");
            } catch (error) {
            alert(error);
            }
        }, [history]);
        return (
            <div>
            <h1>Sign up</h1>
            <form onSubmit={handleSignUp}>
                <label>
                Email
                <input name="email" type="email" placeholder="Email" />
                </label>
                <label>
                Password
                <input name="password" type="password" placeholder="Password" />
                </label>
                <button type="submit">Sign Up</button>
            </form>
            </div>
        );
        };
        export default withRouter(SignUp);
    
    - créer un fichier "Login.js" :
        import React, { useCallback, useContext } from "react";
        import { withRouter, Redirect } from "react-router";
        import app from "./base.js";
        import { AuthContext } from "./Auth.js";
        const Login = ({ history }) => {
        const handleLogin = useCallback(
            async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
                await app
                .auth()
                .signInWithEmailAndPassword(email.value, password.value);
                history.push("/");
            } catch (error) {
                alert(error);
            }
            },
            [history]
        );
        const { currentUser } = useContext(AuthContext);
        if (currentUser) {
            return <Redirect to="/" />;
        }
        return (
            <div>
            <h1>Log in</h1>
            <form onSubmit={handleLogin}>
                <label>
                Email
                <input name="email" type="email" placeholder="Email" />
                </label>
                <label>
                Password
                <input name="password" type="password" placeholder="Password" />
                </label>
                <button type="submit">Log in</button>
            </form>
            </div>
        );
        };
        export default withRouter(Login);
- dans la console, cliquer dans le menu de gauche sur "Database"

- créer une base de données

- mode test

- choisir l'endroit où sera le cloud

- réécrire et créer les fichiers qui vont suivre (Attention la disposition des fichiers n'est plus la même)

- réécrire le fichier "base.js" :
    import * as firebase from "firebase";
    import "firebase/auth";
    import firestore from 'firebase/firestore'
    const config = {
        apiKey: process.env.REACT_APP_FIREBASE_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
    };
    firebase.initializeApp(config);
    export default firebase;

- créer le fichier "Accueil.js" :
    import React, { Component } from 'react'
    import { Link } from 'react-router-dom';
    import firebase from "./base";
    class Accueil extends Component {
        constructor(props) {
            super(props);
            this.ref = firebase.firestore().collection('users').orderBy('nom', 'asc');
            this.unsubscribe = null;
            this.state = {
            users: []
            };
        }
        onCollectionUpdate = (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
            const { nom, prenom, age, photo } = doc.data();
            users.push({
                key: doc.id,
                doc, // DocumentSnapshot
                nom,
                prenom,
                age,
                photo
            });
            });
            this.setState({
            users
        });
        }
        componentDidMount() {
            this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
        }
        render () {
            return (
                <div>
                    <h3>Accueil</h3>
                    <Link to="/login">Login</Link>
                    <table class="table table-stripe">
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>Age</th>
                            <th>Photo</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map((user, id) =>
                            <tr key={id}>
                            <td>{user.nom}</td>
                            <td>{user.prenom}</td>
                            <td>{user.age}</td>
                            <td><img src={`${user.photo}`} /></td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
    export default Accueil

- ajouter les routes (App.js) :
    import Accueil from "./Accueil";
    import Login from "./authentification/Login";
    import SignUp from "./SignUp";
    import Admin from "./admin/Admin";
    import Create from './admin/Create';
    import Show from './admin/Show';
    import Edit from './admin/Edit';
    <Route exact path="/" component={Accueil} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={SignUp} />
    <PrivateRoute exact path="/admin" component={Admin} />
    <PrivateRoute path='/create' component={Create} />
    <PrivateRoute path='/show/:id' component={Show} />
    <PrivateRoute path='/edit/:id' component={Edit} />

- réécrire "Admin.js" :
    import React, { Component } from "react";
    import firebase from "../base";
    import { Link } from 'react-router-dom';
    class Admin extends Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('users').orderBy('nom', 'asc');
        this.unsubscribe = null;
        this.state = {
        users: []
        };
    }
    onCollectionUpdate = (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
        const { nom, prenom, age, photo } = doc.data();
        users.push({
            key: doc.id,
            doc, // DocumentSnapshot
            nom,
            prenom,
            age,
            photo
        });
        });
        this.setState({
        users
    });
    }
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }
    render() {
        return (
        <div>
            <h3>BOARD LIST</h3>
            <h4><Link to="/">Accueil</Link></h4>
            <h4><Link to="/create">Créer un utilisateur</Link></h4>
            <table class="table table-stripe">
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Age</th>
                    <th>Photo</th>
                </tr>
                </thead>
                <tbody>
                {this.state.users.map((user, id) =>
                    <tr key={id}>
                    <td><Link to={`/show/${user.key}`}>{user.nom}</Link></td>
                    <td>{user.prenom}</td>
                    <td>{user.age}</td>
                    <td><img src={`${user.photo}`} /></td>
                    </tr>
                )}
                </tbody>
            </table>
            <button onClick={() => firebase.auth().signOut()}>Sign out</button>
        </div>
        );
    }
    }
    export default Admin;

- créer le fichier "Show.js" :
    import React, { Component } from 'react';
    import firebase from '../base';
    import { Link } from 'react-router-dom';
    class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
        user: {},
        key: ''
        };
    }
    componentDidMount() {
        const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
        ref.get().then((doc) => {
        if (doc.exists) {
            this.setState({
            user: doc.data(),
            key: doc.id,
            isLoading: false
            });
        } else {
            console.log("No such document!");
        }
        });
    }
    delete(id){
        firebase.firestore().collection('users').doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        this.props.history.push("/admin")
        }).catch((error) => {
        console.error("Error removing document: ", error);
        });
    }
    render() {
        return (
        <div>
            <h4><Link to="/admin">User List</Link></h4>
            <h3 class="panel-title">{this.state.user.nom}</h3>
            <dl>
                <dt>Prenom:</dt>
                <dd>{this.state.user.prenom}</dd>
                <dt>Age:</dt>
                <dd>{this.state.user.age}</dd>
                <dt>Photo:</dt>
                <img src={`${this.state.user.photo}`} />
            </dl>
            <Link to={`/edit/${this.state.key}`} class="btn btn-success">Edit</Link>&nbsp;
            <button onClick={this.delete.bind(this, this.state.key)} class="btn btn-danger">Delete</button>
        </div>
        );
    }
    }
    export default Show;

- créer le fichier "Create.js" :
    import React, { Component } from 'react';
    import firebase from '../base';
    import { Link } from 'react-router-dom';
    class Create extends Component {
    constructor() {
        super();
        this.ref = firebase.firestore().collection('users');
        this.state = {
        nom: '',
        prenom: '',
        age: '',
        photo: ''
        };
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { nom, prenom, age, photo } = this.state;
        this.ref.add({
        nom,
        prenom,
        age,
        photo
        }).then((docRef) => {
        this.setState({
            nom: '',
            prenom: '',
            age: '',
            photo: ''
        });
        this.props.history.push("/admin")
        })
        .catch((error) => {
        console.error("Error adding document: ", error);
        });
    }
    render() {
        const { nom, prenom, age, photo } = this.state;
        return (
        <div>
            <h3>Création d'un utilisateur</h3>
            <h4><Link to="/admin">Liste des utilisateurs</Link></h4>
                <form onSubmit={this.onSubmit}>
                <div class="form-group">
                    <label htmlFor="nom">Nom:</label>
                    <input type="text" class="form-control" name="nom" value={nom} onChange={this.onChange} placeholder="Nom" />
                </div>
                <div class="form-group">
                    <label htmlFor="prenom">Prenom:</label>
                    <textarea class="form-control" name="prenom" onChange={this.onChange} placeholder="Prenom" cols="80" rows="3" />
                </div>
                <div class="form-group">
                    <label htmlFor="age">Age:</label>
                    <input type="number" class="form-control" name="age" value={age} onChange={this.onChange} placeholder="Age" />
                </div>
                <div className="form-group">
                    <label htmlFor="photo">Photo:</label>
                    <textarea className="form-control" name="photo" value={photo} onChange={this.onChange} placeholder="url de la photo" cols="80" rows="3" />
                    </div>
                <button type="submit" className="btn btn-success">Submit</button>
                </form>
        </div>
        );
    }
    }
    export default Create;

- créer le fichier "Edit.js" :
    import React, { Component } from 'react';
    import firebase from '../base';
    import { Link } from 'react-router-dom';
    class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
        key: '',
        nom: '',
        prenom: '',
        age: '',
        photo: ''
        };
    }
    componentDidMount() {
        const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
        ref.get().then((doc) => {
        if (doc.exists) {
            const user = doc.data();
            this.setState({
            key: doc.id,
            nom: user.nom,
            prenom: user.prenom,
            age: user.age,
            photo: user.photo
            });
        } else {
            console.log("No such document!");
        }
        });
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState({user:state});

    }
    onSubmit = (e) => {
        e.preventDefault();
        const { nom, prenom, age, photo } = this.state;
        const updateRef = firebase.firestore().collection('users').doc(this.state.key);
        updateRef.set({
        nom,
        prenom,
        age,
        photo
        }).then((docRef) => {
        this.setState({
            key: '',
            nom: '',
            prenom: '',
            age: '',
            photo: ''
        });
        this.props.history.push("/show/"+this.props.match.params.id)
        })
        .catch((error) => {
        console.error("Error adding document: ", error);
        });
    }
    render() {
        return (
        <div>
            <h3>EDIT Utilisateur</h3>
            <Link to="/admin">Liste des utilisateurs</Link>
            <h4><Link to={`/show/${this.state.key}`}>Liste des utilisateurs</Link></h4>
            <form onSubmit={this.onSubmit}>
                <div class="form-group">
                    <label for="nom">Nom:</label>
                    <input type="text" class="form-control" name="nom" value={this.state.nom} onChange={this.onChange} placeholder="Nom" />
                </div>
                <div class="form-group">
                    <label for="prenom">Prenom:</label>
                    <input type="text" class="form-control" name="prenom" value={this.state.prenom} onChange={this.onChange} placeholder="Prenom" />
                </div>
                <div class="form-group">
                    <label for="age">Age:</label>
                    <input type="number" class="form-control" name="age" value={this.state.age} onChange={this.onChange} placeholder="Age" />
                </div>
                <div className="form-group">
                    <label for="photo">Photo:</label>
                    <input type="text" class="form-control" name="photo" value={this.state.photo} onChange={this.onChange} placeholder="url de la photo" />
                </div>
                <button type="submit" class="btn btn-success">Submit</button>
            </form>
        </div>
        );
    }
    }
    export default Edit;



Console firebase -> database -> règles :
allow read, write: if request.time < timestamp.date(2020, 3, 8); (initialement)
allow read, write: if request.auth != null;
allow read, write: if true; (ce qu'il faut mettre ?)
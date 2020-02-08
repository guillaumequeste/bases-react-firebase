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
          const { nom, prenom, age } = doc.data();
          users.push({
            key: doc.id,
            doc, // DocumentSnapshot
            nom,
            prenom,
            age,
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
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(user =>
                        <tr>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.age}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Accueil
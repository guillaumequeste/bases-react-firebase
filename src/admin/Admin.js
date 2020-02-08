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
          <table className="table table-stripe">
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
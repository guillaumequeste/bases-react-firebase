import React, { Component } from "react";
import firebase from "../base";
import { Link } from 'react-router-dom';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
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

  render() {
    return (
      <div>
        <h3>BOARD LIST</h3>
        <h4><Link to="/create">Créer un utilisateur</Link></h4>
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
                  <td><Link to={`/show/${user.key}`}>{user.nom}</Link></td>
                  <td>{user.prenom}</td>
                  <td>{user.age}</td>
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
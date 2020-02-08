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
      age: ''
    };
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { nom, prenom, age } = this.state;
    this.ref.add({
      nom,
      prenom,
      age
    }).then((docRef) => {
      this.setState({
        nom: '',
        prenom: '',
        age: ''
      });
      this.props.history.push("/admin")
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  render() {
    const { nom, prenom, age } = this.state;
    return (
      <div>
        <h3>Création d'un utilisateur</h3>
        <h4><Link to="/admin">Liste des utilisateurs</Link></h4>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="nom">Nom:</label>
              <input type="text" className="form-control" name="nom" value={nom} onChange={this.onChange} placeholder="Nom" />
            </div>
            <div className="form-group">
              <label htmlFor="prenom">Prenom:</label>
              <textarea className="form-control" name="prenom" value={prenom} onChange={this.onChange} placeholder="Prenom" cols="80" rows="3" />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input type="number" className="form-control" name="age" value={age} onChange={this.onChange} placeholder="Age" />
            </div>
            <button type="submit" className="btn btn-success">Submit</button>
          </form>
      </div>
    );
  }
}

export default Create;
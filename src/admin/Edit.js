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
      age: ''
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const board = doc.data();
        this.setState({
          key: doc.id,
          nom: board.nom,
          prenom: board.prenom,
          age: board.age
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
    const { nom, prenom, age } = this.state;
    const updateRef = firebase.firestore().collection('users').doc(this.state.key);
    updateRef.set({
      nom,
      prenom,
      age
    }).then((docRef) => {
      this.setState({
        key: '',
        nom: '',
        prenom: '',
        age: ''
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
        <h4><Link to={`/show/${this.state.key}`}>Fiche</Link></h4>
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
            <button type="submit" class="btn btn-success">Submit</button>
        </form>
      </div>
    );
  }
}

export default Edit;
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
        <h4><Link to="/admin">Liste des utilisateurs</Link></h4>
        <h3 className="panel-title">{this.state.user.nom}</h3>
        <dl>
            <dt>Prenom:</dt>
            <dd>{this.state.user.prenom}</dd>
            <dt>Age:</dt>
            <dd>{this.state.user.age}</dd>
            <dt>Photo:</dt>
            <img src={`${this.state.user.photo}`} />
        </dl>
        <Link to={`/edit/${this.state.key}`} className="btn btn-success">Edit</Link>&nbsp;
        <button onClick={this.delete.bind(this, this.state.key)} className="btn btn-danger">Delete</button>
      </div>
    );
  }
}

export default Show;
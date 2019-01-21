import React , {Component} from 'react'
import {Button} from 'reactstrap'

import "../styles/Command.css"

class CommandScreen extends Component {

  render(){
    return(
      <div className="command-list">
        <div>
        <Button style={styles.buttonStyles} color="primary">HOW TO</Button>
        </div>
        <div>
        <Button style={styles.buttonStyles} color="success">START ORDER</Button>
        </div>
        <div>
        <Button style={styles.buttonStyles} color="info">SUMMARY</Button>
        </div>
        <div>
        <Button style={styles.buttonStyles} color="warning">END ORDER</Button>
        </div>
      </div>
    )
  }
}

const styles = {
  buttonStyles : {
    // "display":"block"
  }
}


export default CommandScreen